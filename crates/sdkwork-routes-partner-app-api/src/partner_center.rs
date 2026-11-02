//! Partner self-service centre routes (分销中心 app surface).
//!
//! All reads are scoped to the partner resolved from the authenticated IAM
//! user; no partner id is accepted from the client.

use std::sync::Arc;

use axum::extract::{Extension, Query, State};
use axum::response::Response;
use axum::routing::get;
use axum::{Json, Router};
use sdkwork_commerce_partner_service::partner_center::{
    PartnerCenterService, PartnerCenterSubject,
};
use sdkwork_contract_service::CommerceServiceError;
use sdkwork_iam_context_service::IamAppContext;
use sdkwork_utils_rust::OffsetListPageParams;
use sdkwork_web_core::WebRequestContext;
use serde::Deserialize;

use crate::api_response::{
    conflict, internal_error, not_found, parse_page, success_created, success_item, success_items,
    unauthorized, validation,
};

#[derive(Clone)]
struct PartnerCenterState {
    service: Arc<PartnerCenterService>,
}

#[derive(Debug, Deserialize)]
struct ListParams {
    page: Option<i64>,
    page_size: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateWithdrawalRequest {
    amount: String,
    #[serde(default)]
    remark: String,
}

pub fn build_partner_center_router(service: Arc<PartnerCenterService>) -> Router {
    Router::new()
        .route("/app/v3/api/partner_center", get(retrieve_center))
        .route("/app/v3/api/partner_center/team", get(list_team))
        .route(
            "/app/v3/api/partner_center/commissions",
            get(list_commission_records),
        )
        .route(
            "/app/v3/api/partner_center/withdrawals",
            get(list_withdrawals).post(create_withdrawal),
        )
        .with_state(PartnerCenterState { service })
}

fn service_error(
    context: Option<&WebRequestContext>,
    operation: &'static str,
    error: CommerceServiceError,
) -> Response {
    tracing::error!(
        operation,
        error_code = error.code(),
        error = error.message(),
        "partner center operation failed"
    );
    match error.code() {
        "validation" => validation(context, error.message()),
        "not-found" => not_found(context, "partner center resource not found"),
        "conflict" | "invalid-state" | "locked" => conflict(context, error.message()),
        "unauthenticated" => unauthorized(context, "authentication is required"),
        "unauthorized" => unauthorized(context, "permission is required"),
        _ => internal_error(context, "partner center data operation failed"),
    }
}

async fn retrieve_center(
    State(state): State<PartnerCenterState>,
    Extension(iam): Extension<IamAppContext>,
    Extension(context): Extension<WebRequestContext>,
) -> Response {
    let subject = match require_subject(&context, &iam) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state.service.retrieve_center(&subject).await {
        Ok(item) => success_item(Some(&context), item),
        Err(error) => service_error(Some(&context), "retrieve partner center", error),
    }
}

async fn list_team(
    State(state): State<PartnerCenterState>,
    Extension(iam): Extension<IamAppContext>,
    Extension(context): Extension<WebRequestContext>,
    Query(params): Query<ListParams>,
) -> Response {
    let subject = match require_subject(&context, &iam) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let page = match parse_page(Some(&context), params.page, params.page_size) {
        Ok(page) => page,
        Err(response) => return *response,
    };
    let query = match build_list_query(&context, &page) {
        Ok(query) => query,
        Err(response) => return response,
    };
    match state.service.list_team(query, &subject).await {
        Ok(result) => success_items(Some(&context), result.items, result.total, page),
        Err(error) => service_error(Some(&context), "list partner team", error),
    }
}

async fn list_commission_records(
    State(state): State<PartnerCenterState>,
    Extension(iam): Extension<IamAppContext>,
    Extension(context): Extension<WebRequestContext>,
    Query(params): Query<ListParams>,
) -> Response {
    let subject = match require_subject(&context, &iam) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let page = match parse_page(Some(&context), params.page, params.page_size) {
        Ok(page) => page,
        Err(response) => return *response,
    };
    let query = match build_list_query(&context, &page) {
        Ok(query) => query,
        Err(response) => return response,
    };
    match state.service.list_commission_records(query, &subject).await {
        Ok(result) => success_items(Some(&context), result.items, result.total, page),
        Err(error) => service_error(Some(&context), "list partner commission records", error),
    }
}

async fn list_withdrawals(
    State(state): State<PartnerCenterState>,
    Extension(iam): Extension<IamAppContext>,
    Extension(context): Extension<WebRequestContext>,
    Query(params): Query<ListParams>,
) -> Response {
    let subject = match require_subject(&context, &iam) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let page = match parse_page(Some(&context), params.page, params.page_size) {
        Ok(page) => page,
        Err(response) => return *response,
    };
    let query = match build_list_query(&context, &page) {
        Ok(query) => query,
        Err(response) => return response,
    };
    match state.service.list_withdrawals(query, &subject).await {
        Ok(result) => success_items(Some(&context), result.items, result.total, page),
        Err(error) => service_error(Some(&context), "list partner withdrawals", error),
    }
}

async fn create_withdrawal(
    State(state): State<PartnerCenterState>,
    Extension(iam): Extension<IamAppContext>,
    Extension(context): Extension<WebRequestContext>,
    Json(body): Json<CreateWithdrawalRequest>,
) -> Response {
    let subject = match require_subject(&context, &iam) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    match state
        .service
        .create_withdrawal(&body.amount, &body.remark, &subject)
        .await
    {
        Ok(item) => success_created(Some(&context), item),
        Err(error) => service_error(Some(&context), "create partner withdrawal", error),
    }
}

// axum handler helpers return `Result<_, Response>` by framework convention;
// boxing the error type adds no benefit at these call sites.
#[allow(clippy::result_large_err)]
fn require_subject(
    context: &WebRequestContext,
    iam: &IamAppContext,
) -> Result<PartnerCenterSubject, Response> {
    let tenant_id = iam
        .tenant_id
        .trim()
        .parse::<i64>()
        .map_err(|_| unauthorized(Some(context), "tenant id must be numeric"))?;
    let organization_id = iam
        .organization_id
        .as_deref()
        .unwrap_or("0")
        .trim()
        .parse::<i64>()
        .map_err(|_| unauthorized(Some(context), "organization id must be numeric"))?;
    let user_id = iam
        .user_id
        .trim()
        .parse::<i64>()
        .map_err(|_| unauthorized(Some(context), "user id must be numeric"))?;
    PartnerCenterSubject::new(tenant_id, organization_id, user_id)
        .map_err(|message| unauthorized(Some(context), message))
}

#[allow(clippy::result_large_err)]
fn build_list_query(
    context: &WebRequestContext,
    params: &OffsetListPageParams,
) -> Result<sdkwork_commerce_partner_service::queries::PartnerAdminListQuery, Response> {
    sdkwork_commerce_partner_service::queries::PartnerAdminListQuery::new(
        params.page,
        params.page_size,
        None,
    )
    .map_err(|error| validation(Some(context), error.message()))
}
