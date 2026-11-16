//! Order → partner commission intake.
//!
//! The order domain owns payment; the partner domain owns commission events and
//! settlement. This module is the narrow capability the order repository calls on
//! a successful payment: it records one idempotent commissionable event per order
//! (unique on tenant/organization/source_type/source_ref). Settlement runs through
//! the existing partner settlement operation, which reads the same PENDING events.

use chrono::{DateTime, Utc};
use sdkwork_commerce_partner_service::domain::cents_to_decimal;
use sdkwork_contract_service::CommerceServiceError;
use sqlx::PgPool;

use std::sync::Arc;

use sdkwork_commerce_partner_service::backend_admin::{
    PartnerAdminRepositoryPort, PartnerAdminSubject, SettlementRunResult,
};
use sdkwork_commerce_partner_service::commands::RunCommissionSettlementCommand;

use crate::account_adapter::PartnerAccountWalletAdapter;
use crate::postgres_partner_admin::{
    error_from_sql, next_bigint_id, next_uuid, PostgresPartnerAdminRepository,
};

const INSERT_ORDER_COMMISSION_EVENT: &str = r#"
INSERT INTO partner_commission_event
    (id, uuid, tenant_id, organization_id, source_type, source_ref,
     customer_user_id, base_amount, event_at, status, remark)
VALUES ($1, $2, $3, $4, 'ORDER', $5, $6, $7::numeric, $8, 'PENDING', $9)
ON CONFLICT (tenant_id, organization_id, source_type, source_ref)
DO UPDATE SET updated_at = CURRENT_TIMESTAMP
RETURNING id
"#;

/// Records the commissionable base of a paid order.
///
/// * `order_ref` — order id/number; the unique key makes retries idempotent.
/// * `base_amount_cents` — the profit base the settlement engine allocates.
///
/// Returns the commission event id (the existing one on a retry).
pub async fn record_order_commission_event(
    pool: &PgPool,
    tenant_id: i64,
    organization_id: i64,
    order_ref: &str,
    customer_user_id: i64,
    base_amount_cents: i64,
    event_at: DateTime<Utc>,
) -> Result<i64, CommerceServiceError> {
    let order_ref = order_ref.trim();
    if order_ref.is_empty() {
        return Err(CommerceServiceError::validation("order reference is required"));
    }
    if order_ref.len() > 128 {
        return Err(CommerceServiceError::validation(
            "order reference must be at most 128 characters",
        ));
    }
    if customer_user_id <= 0 {
        return Err(CommerceServiceError::validation(
            "customer_user_id must be positive",
        ));
    }
    if base_amount_cents < 0 {
        return Err(CommerceServiceError::validation(
            "commission base amount must not be negative",
        ));
    }
    sqlx::query_scalar::<_, i64>(INSERT_ORDER_COMMISSION_EVENT)
        .bind(next_bigint_id())
        .bind(next_uuid())
        .bind(tenant_id)
        .bind(organization_id)
        .bind(order_ref)
        .bind(customer_user_id)
        .bind(cents_to_decimal(base_amount_cents))
        .bind(event_at)
        .bind("order payment commission")
        .fetch_one(pool)
        .await
        .map_err(error_from_sql)
}

/// Records the paid order's revenue and settles pending events immediately.
///
/// Settlement uses the partner system actor (user 0) and the shared differential
/// (level) engine; `FOR UPDATE SKIP LOCKED` plus the wallet idempotency keys make
/// concurrent payment callbacks safe. `settle_limit` bounds the work done on the
/// payment path; any residue is settled by the next payment or the admin run.
pub async fn record_and_settle_order_commission(
    pool: &PgPool,
    tenant_id: i64,
    organization_id: i64,
    order_ref: &str,
    customer_user_id: i64,
    revenue_cents: i64,
    event_at: DateTime<Utc>,
    settle_limit: i64,
) -> Result<(i64, SettlementRunResult), CommerceServiceError> {
    let event_id = record_order_commission_event(
        pool,
        tenant_id,
        organization_id,
        order_ref,
        customer_user_id,
        revenue_cents,
        event_at,
    )
    .await?;
    let repository = PostgresPartnerAdminRepository::new(
        pool.clone(),
        Arc::new(PartnerAccountWalletAdapter::new(pool.clone())),
    );
    let subject = PartnerAdminSubject::new(tenant_id, organization_id, 0)
        .map_err(CommerceServiceError::validation)?;
    let command = RunCommissionSettlementCommand::new(settle_limit.max(1))?;
    let outcome = repository.run_commission_settlement(command, &subject).await?;
    Ok((event_id, outcome))
}

#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::postgres::PgPoolOptions;

    fn lazy_pool() -> PgPool {
        // Validation runs before any query, so a lazy pool suffices for these tests.
        PgPoolOptions::new()
            .connect_lazy("postgres://partner:partner@127.0.0.1:5432/partner")
            .expect("lazy pool")
    }

    #[tokio::test]
    async fn rejects_blank_order_reference() {
        let error = record_order_commission_event(
            &lazy_pool(),
            1,
            0,
            "   ",
            7,
            1_000,
            Utc::now(),
        )
        .await
        .expect_err("blank reference must be rejected");
        assert_eq!(error.code(), "validation");
    }

    #[tokio::test]
    async fn rejects_non_positive_customer() {
        let error = record_order_commission_event(
            &lazy_pool(),
            1,
            0,
            "order-1",
            0,
            1_000,
            Utc::now(),
        )
        .await
        .expect_err("customer must be positive");
        assert_eq!(error.code(), "validation");
    }

    #[tokio::test]
    async fn rejects_negative_revenue() {
        let error = record_order_commission_event(
            &lazy_pool(),
            1,
            0,
            "order-1",
            7,
            -1,
            Utc::now(),
        )
        .await
        .expect_err("negative revenue must be rejected");
        assert_eq!(error.code(), "validation");
    }

    #[tokio::test]
    async fn rejects_overlong_order_reference() {
        let reference = "x".repeat(129);
        let error = record_order_commission_event(
            &lazy_pool(),
            1,
            0,
            &reference,
            7,
            1_000,
            Utc::now(),
        )
        .await
        .expect_err("reference must be bounded");
        assert_eq!(error.code(), "validation");
    }
}
