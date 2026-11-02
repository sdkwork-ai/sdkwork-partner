//! PostgreSQL implementation of the partner self-service read port.
//!
//! Every query is tenant/organization scoped and keyed by the partner resolved
//! from the authenticated user. The team projection is a recursive-CTE subtree
//! with a per-member earnings aggregate, so the app gets team management in one
//! page rather than an N+1 walk.

use chrono::{DateTime, Utc};
use sdkwork_commerce_partner_service::backend_admin::PartnerAdminListPage;
use sdkwork_commerce_partner_service::domain::cents_to_decimal;
use sdkwork_commerce_partner_service::partner_center::{
    PartnerCenterFuture, PartnerCenterIdentity, PartnerCenterReadPort, PartnerCenterSubject,
    PartnerCommissionRecordItem, PartnerTeamMemberItem,
};
use sdkwork_commerce_partner_service::queries::PartnerAdminListQuery;
use sdkwork_contract_service::CommerceServiceError;
use sqlx::Row;

use crate::partner_admin_sql::COUNT_DESCENDANTS;
use crate::postgres_partner_admin::{error_from_sql, PostgresPartnerAdminRepository};

const SELECT_PARTNER_IDENTITY: &str = r#"
SELECT
    p.id,
    p.name,
    p.level_no,
    COALESCE(l.name, '') AS level_name,
    p.status,
    COALESCE(p.invite_code, '') AS invite_code,
    p.joined_at,
    COALESCE(pp.name, '') AS parent_partner_name,
    (
        SELECT COUNT(*) FROM partner_partner c
        WHERE c.tenant_id = p.tenant_id AND c.organization_id = p.organization_id
          AND c.parent_partner_id = p.id AND c.deleted_at IS NULL
    ) AS direct_team_size,
    (
        SELECT COUNT(*) FROM partner_customer_binding cb
        WHERE cb.tenant_id = p.tenant_id AND cb.organization_id = p.organization_id
          AND cb.partner_id = p.id AND cb.status = 'ACTIVE'
    ) AS customer_count
FROM partner_partner p
LEFT JOIN partner_level l
    ON l.tenant_id = p.tenant_id AND l.organization_id = p.organization_id
   AND l.level_no = p.level_no
LEFT JOIN partner_partner pp
    ON pp.id = p.parent_partner_id AND pp.tenant_id = p.tenant_id
   AND pp.organization_id = p.organization_id
WHERE p.tenant_id = $1 AND p.organization_id = $2
  AND p.user_account_id = $3 AND p.deleted_at IS NULL
LIMIT 1
"#;

const SELECT_TEAM_PAGE: &str = r#"
WITH RECURSIVE descendants AS (
    SELECT p.id, p.parent_partner_id, p.name, p.level_no, p.status, p.joined_at,
           0 AS depth
    FROM partner_partner p
    WHERE p.tenant_id = $1 AND p.organization_id = $2 AND p.id = $3
      AND p.deleted_at IS NULL
    UNION ALL
    SELECT p.id, p.parent_partner_id, p.name, p.level_no, p.status, p.joined_at,
           d.depth + 1
    FROM partner_partner p
    JOIN descendants d ON p.parent_partner_id = d.id
    WHERE p.tenant_id = $1 AND p.organization_id = $2
      AND p.deleted_at IS NULL AND d.depth < 64
)
SELECT
    d.id,
    d.name,
    d.level_no,
    COALESCE(l.name, '') AS level_name,
    d.status,
    d.joined_at,
    d.depth,
    (
        SELECT COUNT(*) FROM partner_partner c
        WHERE c.tenant_id = $1 AND c.organization_id = $2
          AND c.parent_partner_id = d.id AND c.deleted_at IS NULL
    ) AS direct_team_size,
    (
        SELECT COUNT(*) FROM partner_customer_binding cb
        WHERE cb.tenant_id = $1 AND cb.organization_id = $2
          AND cb.partner_id = d.id AND cb.status = 'ACTIVE'
    ) AS customer_count,
    COALESCE((
        SELECT SUM(x.amount) FROM partner_commission_distribution x
        WHERE x.tenant_id = $1 AND x.organization_id = $2
          AND x.receiver_partner_id = d.id
    ), 0)::text AS total_commission,
    COALESCE((
        SELECT a.available_amount FROM acct_account a
        WHERE a.tenant_id = $1 AND a.organization_id = $2
          AND a.owner_type = 'PARTNER' AND a.owner_id = d.id
          AND a.asset_code = 'cash' AND a.account_purpose = 'SETTLEMENT'
        LIMIT 1
    ), 0) AS available_balance_cents
FROM descendants d
LEFT JOIN partner_level l
    ON l.tenant_id = $1 AND l.organization_id = $2 AND l.level_no = d.level_no
WHERE d.depth > 0
ORDER BY d.depth ASC, d.joined_at DESC NULLS LAST, d.id DESC
LIMIT $4 OFFSET $5
"#;

const SELECT_TEAM_COUNT: &str = r#"
WITH RECURSIVE descendants AS (
    SELECT p.id, p.parent_partner_id, 0 AS depth
    FROM partner_partner p
    WHERE p.tenant_id = $1 AND p.organization_id = $2 AND p.id = $3
      AND p.deleted_at IS NULL
    UNION ALL
    SELECT p.id, p.parent_partner_id, d.depth + 1
    FROM partner_partner p
    JOIN descendants d ON p.parent_partner_id = d.id
    WHERE p.tenant_id = $1 AND p.organization_id = $2
      AND p.deleted_at IS NULL AND d.depth < 64
)
SELECT COUNT(*) AS count FROM descendants WHERE depth > 0
"#;

const SELECT_COMMISSION_PAGE: &str = r#"
SELECT
    d.id,
    d.settlement_id,
    s.event_id,
    e.source_type,
    e.source_ref,
    d.base_amount::text AS base_amount,
    d.ratio::text AS ratio,
    d.amount::text AS amount,
    d.level_offset,
    s.status,
    s.computed_at,
    d.created_at
FROM partner_commission_distribution d
JOIN partner_commission_settlement s
    ON s.id = d.settlement_id AND s.tenant_id = d.tenant_id
   AND s.organization_id = d.organization_id
JOIN partner_commission_event e
    ON e.id = s.event_id AND e.tenant_id = s.tenant_id
   AND e.organization_id = s.organization_id
WHERE d.tenant_id = $1 AND d.organization_id = $2
  AND d.receiver_partner_id = $3
ORDER BY d.created_at DESC, d.id DESC
LIMIT $4 OFFSET $5
"#;

const SELECT_COMMISSION_COUNT: &str = r#"
SELECT COUNT(*) AS count
FROM partner_commission_distribution d
WHERE d.tenant_id = $1 AND d.organization_id = $2
  AND d.receiver_partner_id = $3
"#;

impl PartnerCenterReadPort for PostgresPartnerAdminRepository {
    fn retrieve_partner_identity<'a>(
        &'a self,
        subject: &'a PartnerCenterSubject,
    ) -> PartnerCenterFuture<'a, PartnerCenterIdentity> {
        Box::pin(async move {
            let row = sqlx::query(SELECT_PARTNER_IDENTITY)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(subject.user_id)
                .fetch_optional(self.pool())
                .await
                .map_err(error_from_sql)?
                .ok_or_else(|| {
                    CommerceServiceError::not_found(
                        "the signed-in user is not a partner of this tenant",
                    )
                })?;
            Ok(PartnerCenterIdentity {
                partner_id: row.get("id"),
                name: row.get("name"),
                level_no: row.get("level_no"),
                level_name: row.get("level_name"),
                status: row.get("status"),
                invite_code: row.get("invite_code"),
                joined_at: row
                    .try_get::<Option<DateTime<Utc>>, _>("joined_at")
                    .unwrap_or(None)
                    .map(|value| value.to_rfc3339()),
                parent_partner_name: row.get("parent_partner_name"),
                direct_team_size: row.get("direct_team_size"),
                customer_count: row.get("customer_count"),
            })
        })
    }

    fn count_team_members<'a>(
        &'a self,
        partner_id: i64,
        subject: &'a PartnerCenterSubject,
    ) -> PartnerCenterFuture<'a, i64> {
        Box::pin(async move {
            let count = sqlx::query(COUNT_DESCENDANTS)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(partner_id)
                .fetch_one(self.pool())
                .await
                .map_err(error_from_sql)?
                .get::<i64, _>("count");
            Ok(count.max(0))
        })
    }

    fn list_team<'a>(
        &'a self,
        query: PartnerAdminListQuery,
        subject: &'a PartnerCenterSubject,
    ) -> PartnerCenterFuture<'a, PartnerAdminListPage<PartnerTeamMemberItem>> {
        Box::pin(async move {
            let identity = self.retrieve_partner_identity(subject).await?;
            let total = sqlx::query(SELECT_TEAM_COUNT)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(identity.partner_id)
                .fetch_one(self.pool())
                .await
                .map_err(error_from_sql)?
                .get::<i64, _>("count");
            let offset = (query.page - 1) * query.page_size;
            let rows = sqlx::query(SELECT_TEAM_PAGE)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(identity.partner_id)
                .bind(query.page_size)
                .bind(offset)
                .fetch_all(self.pool())
                .await
                .map_err(error_from_sql)?;
            Ok(PartnerAdminListPage {
                items: rows
                    .iter()
                    .map(|row| PartnerTeamMemberItem {
                        partner_id: row.get("id"),
                        name: row.get("name"),
                        level_no: row.get("level_no"),
                        level_name: row.get("level_name"),
                        status: row.get("status"),
                        joined_at: row
                            .try_get::<Option<DateTime<Utc>>, _>("joined_at")
                            .unwrap_or(None)
                            .map(|value| value.to_rfc3339()),
                        depth: row.get("depth"),
                        direct_team_size: row.get("direct_team_size"),
                        customer_count: row.get("customer_count"),
                        total_commission: row.get("total_commission"),
                        available_balance: cents_to_decimal(
                            row.get::<i64, _>("available_balance_cents"),
                        ),
                    })
                    .collect(),
                page: query.page,
                page_size: query.page_size,
                total,
            })
        })
    }

    fn list_commission_records<'a>(
        &'a self,
        query: PartnerAdminListQuery,
        subject: &'a PartnerCenterSubject,
    ) -> PartnerCenterFuture<'a, PartnerAdminListPage<PartnerCommissionRecordItem>> {
        Box::pin(async move {
            let identity = self.retrieve_partner_identity(subject).await?;
            let total = sqlx::query(SELECT_COMMISSION_COUNT)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(identity.partner_id)
                .fetch_one(self.pool())
                .await
                .map_err(error_from_sql)?
                .get::<i64, _>("count");
            let offset = (query.page - 1) * query.page_size;
            let rows = sqlx::query(SELECT_COMMISSION_PAGE)
                .bind(subject.tenant_id)
                .bind(subject.organization_id)
                .bind(identity.partner_id)
                .bind(query.page_size)
                .bind(offset)
                .fetch_all(self.pool())
                .await
                .map_err(error_from_sql)?;
            Ok(PartnerAdminListPage {
                items: rows
                    .iter()
                    .map(|row| PartnerCommissionRecordItem {
                        id: row.get("id"),
                        settlement_id: row.get("settlement_id"),
                        event_id: row.get("event_id"),
                        source_type: row.get("source_type"),
                        source_ref: row.get("source_ref"),
                        base_amount: row.get("base_amount"),
                        ratio: row.get("ratio"),
                        amount: row.get("amount"),
                        level_offset: row.get("level_offset"),
                        status: row.get("status"),
                        computed_at: row.get::<DateTime<Utc>, _>("computed_at").to_rfc3339(),
                        created_at: row.get::<DateTime<Utc>, _>("created_at").to_rfc3339(),
                    })
                    .collect(),
                page: query.page,
                page_size: query.page_size,
                total,
            })
        })
    }
}
