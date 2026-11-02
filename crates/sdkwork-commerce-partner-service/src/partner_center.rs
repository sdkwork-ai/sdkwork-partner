//! Partner self-service centre (分销中心) app surface.
//!
//! The app surface never accepts a partner id from the client: the current
//! partner is always resolved from the authenticated IAM user. Read models are
//! partner-scoped (team subtree, per-member earnings, the caller's own
//! commission records) and financial commands delegate to the admin repository
//! so the withdrawal hold/settle lifecycle has exactly one implementation.

use crate::backend_admin::{PartnerAdminListPage, PartnerAdminRepositoryPort, PartnerAdminSubject};
use crate::commands::CreateWithdrawalCommand;
use crate::domain::parse_money_to_cents;
use crate::queries::{ListWithdrawalsQuery, PartnerAdminListQuery, RetrievePartnerQuery};
use sdkwork_contract_service::CommerceServiceError;
use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

/// Scoped end-user identity for the distribution centre.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct PartnerCenterSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

impl PartnerCenterSubject {
    pub fn new(tenant_id: i64, organization_id: i64, user_id: i64) -> Result<Self, String> {
        if tenant_id < 0 || organization_id < 0 || user_id <= 0 {
            return Err(
                "tenant/organization must be non-negative and user id positive".to_string(),
            );
        }
        Ok(Self {
            tenant_id,
            organization_id,
            user_id,
        })
    }
}

impl PartnerCenterSubject {
    fn admin_subject(&self) -> Result<PartnerAdminSubject, CommerceServiceError> {
        PartnerAdminSubject::new(self.tenant_id, self.organization_id, self.user_id)
            .map_err(CommerceServiceError::validation)
    }
}

pub type PartnerCenterFuture<'a, T> =
    Pin<Box<dyn Future<Output = Result<T, CommerceServiceError>> + Send + 'a>>;

/// Resolved partner identity for the signed-in user.
#[derive(Clone, Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PartnerCenterIdentity {
    #[serde(with = "sdkwork_utils_rust::serde_int64")]
    pub partner_id: i64,
    pub name: String,
    pub level_no: i32,
    pub level_name: String,
    pub status: String,
    pub invite_code: String,
    pub joined_at: Option<String>,
    pub parent_partner_name: String,
    #[serde(with = "sdkwork_utils_rust::serde_int64")]
    pub direct_team_size: i64,
    #[serde(with = "sdkwork_utils_rust::serde_int64")]
    pub customer_count: i64,
}

/// Partner-centre overview: identity, network size and money summary.
#[derive(Clone, Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PartnerCenterItem {
    #[serde(with = "sdkwork_utils_rust::serde_int64")]
    pub partner_id: i64,
    pub name: String,
    pub level_no: i32,
    pub level_name: String,
    pub status: String,
    pub invite_code: String,
    pub joined_at: Option<String>,
    pub parent_partner_name: String,
    #[serde(with = "sdkwork_utils_rust::serde_int64")]
    pub direct_team_size: i64,
    #[serde(with = "sdkwork_utils_rust::serde_int64")]
    pub team_size: i64,
    #[serde(with = "sdkwork_utils_rust::serde_int64")]
    pub customer_count: i64,
    pub currency: String,
    pub available_balance: String,
    pub frozen_balance: String,
    pub total_commission: String,
    pub withdrawn_amount: String,
    pub min_withdrawal_amount: String,
}

/// One member of the caller's team with that member's own earnings.
#[derive(Clone, Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PartnerTeamMemberItem {
    #[serde(with = "sdkwork_utils_rust::serde_int64")]
    pub partner_id: i64,
    pub name: String,
    pub level_no: i32,
    pub level_name: String,
    pub status: String,
    pub joined_at: Option<String>,
    /// 1 = direct child, 2 = grandchild, ...
    pub depth: i32,
    #[serde(with = "sdkwork_utils_rust::serde_int64")]
    pub direct_team_size: i64,
    #[serde(with = "sdkwork_utils_rust::serde_int64")]
    pub customer_count: i64,
    /// Lifetime commission credited to this member.
    pub total_commission: String,
    /// This member's currently withdrawable balance.
    pub available_balance: String,
}

/// One commission allocation received by the caller.
#[derive(Clone, Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PartnerCommissionRecordItem {
    #[serde(with = "sdkwork_utils_rust::serde_int64")]
    pub id: i64,
    #[serde(with = "sdkwork_utils_rust::serde_int64")]
    pub settlement_id: i64,
    #[serde(with = "sdkwork_utils_rust::serde_int64")]
    pub event_id: i64,
    /// `join_fee` / `customer_revenue` / ...
    pub source_type: String,
    pub source_ref: String,
    /// Commission base after the platform margin is applied.
    pub base_amount: String,
    pub ratio: String,
    pub amount: String,
    pub level_offset: i32,
    pub status: String,
    pub computed_at: String,
    pub created_at: String,
}

/// App-facing withdrawal projection (operator ids stay internal).
#[derive(Clone, Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PartnerWithdrawalItem {
    #[serde(with = "sdkwork_utils_rust::serde_int64")]
    pub id: i64,
    pub amount: String,
    pub status: String,
    pub review_remark: String,
    pub paid_at: Option<String>,
    pub remark: String,
    pub created_at: String,
    pub updated_at: String,
}

/// Read-only repository port for the partner centre projections.
pub trait PartnerCenterReadPort: Send + Sync {
    /// Resolves the partner bound to `subject.user_id`; not-found when the
    /// signed-in user is not a partner.
    fn retrieve_partner_identity<'a>(
        &'a self,
        subject: &'a PartnerCenterSubject,
    ) -> PartnerCenterFuture<'a, PartnerCenterIdentity>;

    /// Number of partners in the caller's whole subtree (excluding self).
    fn count_team_members<'a>(
        &'a self,
        partner_id: i64,
        subject: &'a PartnerCenterSubject,
    ) -> PartnerCenterFuture<'a, i64>;

    /// Paged team subtree with per-member earnings.
    fn list_team<'a>(
        &'a self,
        query: PartnerAdminListQuery,
        subject: &'a PartnerCenterSubject,
    ) -> PartnerCenterFuture<'a, PartnerAdminListPage<PartnerTeamMemberItem>>;

    /// Paged commission records received by the caller.
    fn list_commission_records<'a>(
        &'a self,
        query: PartnerAdminListQuery,
        subject: &'a PartnerCenterSubject,
    ) -> PartnerCenterFuture<'a, PartnerAdminListPage<PartnerCommissionRecordItem>>;
}

/// Self-service distribution centre facade.
pub struct PartnerCenterService {
    read: Arc<dyn PartnerCenterReadPort + Send + Sync>,
    admin: Arc<dyn PartnerAdminRepositoryPort + Send + Sync>,
}

impl PartnerCenterService {
    pub fn new(
        read: Arc<dyn PartnerCenterReadPort + Send + Sync>,
        admin: Arc<dyn PartnerAdminRepositoryPort + Send + Sync>,
    ) -> Self {
        Self { read, admin }
    }

    pub async fn retrieve_center(
        &self,
        subject: &PartnerCenterSubject,
    ) -> Result<PartnerCenterItem, CommerceServiceError> {
        let identity = self.read.retrieve_partner_identity(subject).await?;
        let admin_subject = subject.admin_subject()?;
        let stats = self
            .admin
            .retrieve_partner_stats(
                RetrievePartnerQuery::new(identity.partner_id)?,
                &admin_subject,
            )
            .await?;
        let config = self
            .admin
            .retrieve_commission_config(&admin_subject)
            .await?;
        let team_size = self
            .read
            .count_team_members(identity.partner_id, subject)
            .await?;

        Ok(PartnerCenterItem {
            partner_id: identity.partner_id,
            name: identity.name,
            level_no: identity.level_no,
            level_name: identity.level_name,
            status: identity.status,
            invite_code: identity.invite_code,
            joined_at: identity.joined_at,
            parent_partner_name: identity.parent_partner_name,
            direct_team_size: identity.direct_team_size,
            team_size,
            customer_count: stats.customer_count.max(identity.customer_count),
            currency: config.currency,
            available_balance: stats.available_balance,
            frozen_balance: stats.withdrawing_amount,
            total_commission: stats.total_commission,
            withdrawn_amount: stats.withdrawn_amount,
            min_withdrawal_amount: config.min_withdrawal_amount,
        })
    }

    pub async fn list_team(
        &self,
        query: PartnerAdminListQuery,
        subject: &PartnerCenterSubject,
    ) -> Result<PartnerAdminListPage<PartnerTeamMemberItem>, CommerceServiceError> {
        self.read.list_team(query, subject).await
    }

    pub async fn list_commission_records(
        &self,
        query: PartnerAdminListQuery,
        subject: &PartnerCenterSubject,
    ) -> Result<PartnerAdminListPage<PartnerCommissionRecordItem>, CommerceServiceError> {
        self.read.list_commission_records(query, subject).await
    }

    pub async fn list_withdrawals(
        &self,
        query: PartnerAdminListQuery,
        subject: &PartnerCenterSubject,
    ) -> Result<PartnerAdminListPage<PartnerWithdrawalItem>, CommerceServiceError> {
        let identity = self.read.retrieve_partner_identity(subject).await?;
        let admin_subject = subject.admin_subject()?;
        let page = self
            .admin
            .list_withdrawals(
                ListWithdrawalsQuery::new(query, Some(identity.partner_id), None),
                &admin_subject,
            )
            .await?;
        Ok(PartnerAdminListPage {
            items: page
                .items
                .into_iter()
                .map(|item| PartnerWithdrawalItem {
                    id: item.id,
                    amount: item.amount,
                    status: item.status,
                    review_remark: item.review_remark,
                    paid_at: item.paid_at,
                    remark: item.remark,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                })
                .collect(),
            page: page.page,
            page_size: page.page_size,
            total: page.total,
        })
    }

    /// Applies for a withdrawal. The partner id is resolved from the session;
    /// minimum amount, available balance, and the account hold are enforced by
    /// the shared admin repository path.
    pub async fn create_withdrawal(
        &self,
        amount: &str,
        remark: &str,
        subject: &PartnerCenterSubject,
    ) -> Result<PartnerWithdrawalItem, CommerceServiceError> {
        let amount_cents = parse_money_to_cents("amount", amount)?;
        if amount_cents <= 0 {
            return Err(CommerceServiceError::validation(
                "amount must be a positive amount",
            ));
        }
        let identity = self.read.retrieve_partner_identity(subject).await?;
        let admin_subject = subject.admin_subject()?;
        let item = self
            .admin
            .create_withdrawal(
                CreateWithdrawalCommand::new(identity.partner_id, amount_cents, remark)?,
                &admin_subject,
            )
            .await?;
        Ok(PartnerWithdrawalItem {
            id: item.id,
            amount: item.amount,
            status: item.status,
            review_remark: item.review_remark,
            paid_at: item.paid_at,
            remark: item.remark,
            created_at: item.created_at,
            updated_at: item.updated_at,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn subject_rejects_anonymous_user() {
        assert!(PartnerCenterSubject::new(100_001, 0, 0).is_err());
        assert!(PartnerCenterSubject::new(100_001, 0, 42).is_ok());
    }

    #[test]
    fn subject_rejects_negative_tenant_scope() {
        assert!(PartnerCenterSubject::new(-1, 0, 42).is_err());
        assert!(PartnerCenterSubject::new(0, -1, 42).is_err());
    }

    #[test]
    fn subject_maps_to_admin_scope_with_same_ids() {
        let subject = PartnerCenterSubject::new(7, 3, 42).expect("valid subject");
        let admin = subject.admin_subject().expect("admin scope");
        assert_eq!(admin.tenant_id, 7);
        assert_eq!(admin.organization_id, 3);
        assert_eq!(admin.user_id, 42);
    }
}
