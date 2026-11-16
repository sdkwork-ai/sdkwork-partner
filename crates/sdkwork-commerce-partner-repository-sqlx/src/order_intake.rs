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

use crate::postgres_partner_admin::{error_from_sql, next_bigint_id, next_uuid};

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
