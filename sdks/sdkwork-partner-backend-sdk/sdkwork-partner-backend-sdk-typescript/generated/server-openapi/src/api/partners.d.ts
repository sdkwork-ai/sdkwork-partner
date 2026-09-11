import type { ApiRequestOptions, HttpClient } from '../http/client';
import type { AdminCommissionConfigUpdateRequest, AdminCommissionEventCreateRequest, AdminCustomerBindRequest, AdminJoinFeePaymentCreateRequest, AdminLedgerAdjustmentRequest, AdminPartnerApplicationApproveRequest, AdminPartnerApplicationItem, AdminPartnerApplicationRejectRequest, AdminPartnerBindUserAccountRequest, AdminPartnerCreateRequest, AdminPartnerLevelCreateRequest, AdminPartnerLevelUpdateRequest, AdminPartnerUpdateRequest, AdminSettlementRunRequest, AdminWithdrawalCreateRequest, AdminWithdrawalPayRequest, AdminWithdrawalReviewRequest, AuditLogItem, CommissionConfigItem, CommissionEventItem, CustomerBindingItem, JoinFeePaymentItem, LedgerEntryItem, PageInfo, PartnerAncestorItem, PartnerItem, PartnerLevelItem, PartnerStatItem, PartnerTreeItem, SettlementItem, SettlementRunResult, StatSnapshotItem, StatsOverviewItem, WithdrawalItem } from '../types';
export interface PartnersApplicationsListParams {
    page?: number;
    pageSize?: number;
    status?: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    applicantType?: 'INDIVIDUAL' | 'ORGANIZATION';
    q?: string;
}
export declare class PartnersApplicationsApi {
    private client;
    constructor(client: HttpClient);
    /** List partner join applications */
    list(params?: PartnersApplicationsListParams, requestOptions?: ApiRequestOptions): Promise<{
        items: AdminPartnerApplicationItem[];
        pageInfo: PageInfo;
    }>;
    /** Retrieve a partner join application */
    retrieve(applicationId: string, requestOptions?: ApiRequestOptions): Promise<AdminPartnerApplicationItem>;
    /** Approve a partner join application */
    approve(applicationId: string, body: AdminPartnerApplicationApproveRequest, requestOptions?: ApiRequestOptions): Promise<AdminPartnerApplicationItem>;
    /** Reject a partner join application */
    reject(applicationId: string, body: AdminPartnerApplicationRejectRequest, requestOptions?: ApiRequestOptions): Promise<AdminPartnerApplicationItem>;
}
export interface PartnersStatsListParams {
    page?: number;
    pageSize?: number;
    q?: string;
    partnerId?: string;
    periodType?: 'DAY' | 'MONTH';
}
export declare class PartnersStatsApi {
    private client;
    constructor(client: HttpClient);
    /** List partner stats snapshots */
    list(params?: PartnersStatsListParams, requestOptions?: ApiRequestOptions): Promise<{
        items: StatSnapshotItem[];
        pageInfo: PageInfo;
    }>;
    /** Retrieve a partner's aggregated stats */
    retrieve(partnerId: string, requestOptions?: ApiRequestOptions): Promise<PartnerStatItem>;
}
export declare class PartnersStatsOverviewApi {
    private client;
    constructor(client: HttpClient);
    /** Retrieve partner stats overview */
    list(requestOptions?: ApiRequestOptions): Promise<StatsOverviewItem>;
}
export declare class PartnersWithdrawalPaymentsApi {
    private client;
    constructor(client: HttpClient);
    /** Mark an approved withdrawal as paid */
    update(withdrawalId: string, body: AdminWithdrawalPayRequest, requestOptions?: ApiRequestOptions): Promise<WithdrawalItem>;
}
export declare class PartnersWithdrawalReviewsApi {
    private client;
    constructor(client: HttpClient);
    /** Approve or reject a withdrawal request */
    update(withdrawalId: string, body: AdminWithdrawalReviewRequest, requestOptions?: ApiRequestOptions): Promise<WithdrawalItem>;
}
export interface PartnersWithdrawalsListParams {
    page?: number;
    pageSize?: number;
    q?: string;
    partnerId?: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
}
export declare class PartnersWithdrawalsApi {
    private client;
    constructor(client: HttpClient);
    /** List withdrawal requests */
    list(params?: PartnersWithdrawalsListParams, requestOptions?: ApiRequestOptions): Promise<{
        items: WithdrawalItem[];
        pageInfo: PageInfo;
    }>;
    /** Create a withdrawal request */
    create(body: AdminWithdrawalCreateRequest, requestOptions?: ApiRequestOptions): Promise<WithdrawalItem>;
}
export interface PartnersAuditLogsListParams {
    page?: number;
    pageSize?: number;
    q?: string;
    action?: string;
    targetType?: string;
    targetId?: string;
    operatorId?: string;
}
export declare class PartnersAuditLogsApi {
    private client;
    constructor(client: HttpClient);
    /** List partner admin audit logs */
    list(params?: PartnersAuditLogsListParams, requestOptions?: ApiRequestOptions): Promise<{
        items: AuditLogItem[];
        pageInfo: PageInfo;
    }>;
}
export interface PartnersLedgerEntriesListParams {
    page?: number;
    pageSize?: number;
    q?: string;
    entryType?: string;
}
export declare class PartnersLedgerEntriesApi {
    private client;
    constructor(client: HttpClient);
    /** List ledger entries of a partner */
    list(partnerId: string, params?: PartnersLedgerEntriesListParams, requestOptions?: ApiRequestOptions): Promise<{
        items: LedgerEntryItem[];
        pageInfo: PageInfo;
    }>;
    /** Create a manual ledger adjustment */
    create(body: AdminLedgerAdjustmentRequest, requestOptions?: ApiRequestOptions): Promise<LedgerEntryItem>;
}
export interface PartnersSettlementsListParams {
    page?: number;
    pageSize?: number;
    q?: string;
    partnerId?: string;
    status?: 'SETTLED' | 'SKIPPED';
}
export declare class PartnersSettlementsApi {
    private client;
    constructor(client: HttpClient);
    /** Run commission settlement for pending events */
    run(body: AdminSettlementRunRequest, requestOptions?: ApiRequestOptions): Promise<SettlementRunResult>;
    /** List commission settlements */
    list(params?: PartnersSettlementsListParams, requestOptions?: ApiRequestOptions): Promise<{
        items: SettlementItem[];
        pageInfo: PageInfo;
    }>;
}
export interface PartnersCommissionEventsListParams {
    page?: number;
    pageSize?: number;
    q?: string;
    status?: 'PENDING' | 'SETTLED' | 'SKIPPED' | 'FAILED';
    sourceType?: 'USAGE_SETTLEMENT' | 'RECHARGE' | 'MANUAL';
}
export declare class PartnersCommissionEventsApi {
    private client;
    constructor(client: HttpClient);
    /** List commission revenue events */
    list(params?: PartnersCommissionEventsListParams, requestOptions?: ApiRequestOptions): Promise<{
        items: CommissionEventItem[];
        pageInfo: PageInfo;
    }>;
    /** Create a manual commission revenue event */
    create(body: AdminCommissionEventCreateRequest, requestOptions?: ApiRequestOptions): Promise<CommissionEventItem>;
}
export interface PartnersCustomerBindingsListParams {
    page?: number;
    pageSize?: number;
    q?: string;
    partnerId?: string;
    status?: string;
}
export declare class PartnersCustomerBindingsApi {
    private client;
    constructor(client: HttpClient);
    /** Bind a customer to a partner */
    create(body: AdminCustomerBindRequest, requestOptions?: ApiRequestOptions): Promise<CustomerBindingItem>;
    /** List customer bindings across all partners */
    list(params?: PartnersCustomerBindingsListParams, requestOptions?: ApiRequestOptions): Promise<{
        items: CustomerBindingItem[];
        pageInfo: PageInfo;
    }>;
    /** Unbind a customer from a partner */
    delete(bindingId: string, requestOptions?: ApiRequestOptions): Promise<void>;
}
export interface PartnersJoinFeePaymentsListParams {
    page?: number;
    pageSize?: number;
    q?: string;
    partnerId?: string;
    status?: string;
}
export declare class PartnersJoinFeePaymentsApi {
    private client;
    constructor(client: HttpClient);
    /** Record a join fee payment and trigger ancestor commission */
    create(partnerId: string, body: AdminJoinFeePaymentCreateRequest, requestOptions?: ApiRequestOptions): Promise<JoinFeePaymentItem>;
    /** List join fee payments across all partners */
    list(params?: PartnersJoinFeePaymentsListParams, requestOptions?: ApiRequestOptions): Promise<{
        items: JoinFeePaymentItem[];
        pageInfo: PageInfo;
    }>;
}
export declare class PartnersAncestorsApi {
    private client;
    constructor(client: HttpClient);
    /** List the partner ancestor chain */
    list(partnerId: string, requestOptions?: ApiRequestOptions): Promise<PartnerAncestorItem[]>;
}
export declare class PartnersTreeApi {
    private client;
    constructor(client: HttpClient);
    /** List the partner descendant tree */
    list(partnerId: string, requestOptions?: ApiRequestOptions): Promise<PartnerTreeItem[]>;
}
export declare class PartnersUserAccountApi {
    private client;
    constructor(client: HttpClient);
    /** Bind an IAM user account to a partner */
    create(partnerId: string, body: AdminPartnerBindUserAccountRequest, requestOptions?: ApiRequestOptions): Promise<PartnerItem>;
}
export declare class PartnersCommissionConfigApi {
    private client;
    constructor(client: HttpClient);
    /** Retrieve the commission configuration */
    retrieve(requestOptions?: ApiRequestOptions): Promise<CommissionConfigItem>;
    /** Update the commission configuration */
    update(body: AdminCommissionConfigUpdateRequest, requestOptions?: ApiRequestOptions): Promise<CommissionConfigItem>;
}
export declare class PartnersLevelsApi {
    private client;
    constructor(client: HttpClient);
    /** List partner levels */
    list(requestOptions?: ApiRequestOptions): Promise<{
        items: PartnerLevelItem[];
        pageInfo: PageInfo;
    }>;
    /** Create a partner level */
    create(body: AdminPartnerLevelCreateRequest, requestOptions?: ApiRequestOptions): Promise<PartnerLevelItem>;
    /** Update a partner level */
    update(levelId: string, body: AdminPartnerLevelUpdateRequest, requestOptions?: ApiRequestOptions): Promise<PartnerLevelItem>;
    /** Delete a partner level */
    delete(levelId: string, requestOptions?: ApiRequestOptions): Promise<void>;
}
export interface PartnersListParams {
    page?: number;
    pageSize?: number;
    q?: string;
    status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
    levelNo?: number;
    createdFrom?: string;
    createdTo?: string;
    joinFeeStatus?: 'PAID' | 'UNPAID';
}
export declare class PartnersApi {
    private client;
    readonly levels: PartnersLevelsApi;
    readonly commissionConfig: PartnersCommissionConfigApi;
    readonly userAccount: PartnersUserAccountApi;
    readonly tree: PartnersTreeApi;
    readonly ancestors: PartnersAncestorsApi;
    readonly joinFeePayments: PartnersJoinFeePaymentsApi;
    readonly customerBindings: PartnersCustomerBindingsApi;
    readonly commissionEvents: PartnersCommissionEventsApi;
    readonly settlements: PartnersSettlementsApi;
    readonly ledgerEntries: PartnersLedgerEntriesApi;
    readonly auditLogs: PartnersAuditLogsApi;
    readonly withdrawals: PartnersWithdrawalsApi;
    readonly withdrawalReviews: PartnersWithdrawalReviewsApi;
    readonly withdrawalPayments: PartnersWithdrawalPaymentsApi;
    readonly statsOverview: PartnersStatsOverviewApi;
    readonly stats: PartnersStatsApi;
    readonly applications: PartnersApplicationsApi;
    constructor(client: HttpClient);
    /** List partners */
    list(params?: PartnersListParams, requestOptions?: ApiRequestOptions): Promise<{
        items: PartnerItem[];
        pageInfo: PageInfo;
    }>;
    /** Create a partner */
    create(body: AdminPartnerCreateRequest, requestOptions?: ApiRequestOptions): Promise<PartnerItem>;
    /** Retrieve a partner */
    retrieve(partnerId: string, requestOptions?: ApiRequestOptions): Promise<PartnerItem>;
    /** Update a partner */
    update(partnerId: string, body: AdminPartnerUpdateRequest, requestOptions?: ApiRequestOptions): Promise<PartnerItem>;
}
export declare function createPartnersApi(client: HttpClient): PartnersApi;
//# sourceMappingURL=partners.d.ts.map