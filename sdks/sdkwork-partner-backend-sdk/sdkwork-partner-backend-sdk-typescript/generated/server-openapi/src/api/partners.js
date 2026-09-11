import { backendApiPath } from './paths';
export class PartnersApplicationsApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** List partner join applications */
    async list(params, requestOptions) {
        const query = buildQueryString([
            { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
            { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'applicant_type', value: params?.applicantType, style: 'form', explode: true, allowReserved: false },
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.request(appendQueryString(backendApiPath(`/partners/applications`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'page' });
    }
    /** Retrieve a partner join application */
    async retrieve(applicationId, requestOptions) {
        return this.client.request(backendApiPath(`/partners/applications/${serializePathParameter(applicationId, { name: 'applicationId', style: 'simple', explode: false })}`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'item' });
    }
    /** Approve a partner join application */
    async approve(applicationId, body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/applications/${serializePathParameter(applicationId, { name: 'applicationId', style: 'simple', explode: false })}/approve`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
    /** Reject a partner join application */
    async reject(applicationId, body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/applications/${serializePathParameter(applicationId, { name: 'applicationId', style: 'simple', explode: false })}/reject`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
}
export class PartnersStatsApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** List partner stats snapshots */
    async list(params, requestOptions) {
        const query = buildQueryString([
            { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
            { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'partner_id', value: params?.partnerId, style: 'form', explode: true, allowReserved: false },
            { name: 'period_type', value: params?.periodType, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.request(appendQueryString(backendApiPath(`/partners/stats`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'page' });
    }
    /** Retrieve a partner's aggregated stats */
    async retrieve(partnerId, requestOptions) {
        return this.client.request(backendApiPath(`/partners/${serializePathParameter(partnerId, { name: 'partnerId', style: 'simple', explode: false })}/stats`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'item' });
    }
}
export class PartnersStatsOverviewApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** Retrieve partner stats overview */
    async list(requestOptions) {
        return this.client.request(backendApiPath(`/partners/stats/overview`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'item' });
    }
}
export class PartnersWithdrawalPaymentsApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** Mark an approved withdrawal as paid */
    async update(withdrawalId, body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/withdrawals/${serializePathParameter(withdrawalId, { name: 'withdrawalId', style: 'simple', explode: false })}/pay`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'PATCH', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
}
export class PartnersWithdrawalReviewsApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** Approve or reject a withdrawal request */
    async update(withdrawalId, body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/withdrawals/${serializePathParameter(withdrawalId, { name: 'withdrawalId', style: 'simple', explode: false })}/review`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'PATCH', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
}
export class PartnersWithdrawalsApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** List withdrawal requests */
    async list(params, requestOptions) {
        const query = buildQueryString([
            { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
            { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'partner_id', value: params?.partnerId, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.request(appendQueryString(backendApiPath(`/partners/withdrawals`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'page' });
    }
    /** Create a withdrawal request */
    async create(body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/withdrawals`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
}
export class PartnersAuditLogsApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** List partner admin audit logs */
    async list(params, requestOptions) {
        const query = buildQueryString([
            { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
            { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'action', value: params?.action, style: 'form', explode: true, allowReserved: false },
            { name: 'target_type', value: params?.targetType, style: 'form', explode: true, allowReserved: false },
            { name: 'target_id', value: params?.targetId, style: 'form', explode: true, allowReserved: false },
            { name: 'operator_id', value: params?.operatorId, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.request(appendQueryString(backendApiPath(`/partners/audit_logs`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'page' });
    }
}
export class PartnersLedgerEntriesApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** List ledger entries of a partner */
    async list(partnerId, params, requestOptions) {
        const query = buildQueryString([
            { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
            { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'entry_type', value: params?.entryType, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.request(appendQueryString(backendApiPath(`/partners/${serializePathParameter(partnerId, { name: 'partnerId', style: 'simple', explode: false })}/ledger`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'page' });
    }
    /** Create a manual ledger adjustment */
    async create(body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/ledger/adjustments`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
}
export class PartnersSettlementsApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** Run commission settlement for pending events */
    async run(body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/settlements/run`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
    /** List commission settlements */
    async list(params, requestOptions) {
        const query = buildQueryString([
            { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
            { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'partner_id', value: params?.partnerId, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.request(appendQueryString(backendApiPath(`/partners/settlements`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'page' });
    }
}
export class PartnersCommissionEventsApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** List commission revenue events */
    async list(params, requestOptions) {
        const query = buildQueryString([
            { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
            { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'source_type', value: params?.sourceType, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.request(appendQueryString(backendApiPath(`/partners/commission_events`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'page' });
    }
    /** Create a manual commission revenue event */
    async create(body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/commission_events`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
}
export class PartnersCustomerBindingsApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** Bind a customer to a partner */
    async create(body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/customers`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
    /** List customer bindings across all partners */
    async list(params, requestOptions) {
        const query = buildQueryString([
            { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
            { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'partner_id', value: params?.partnerId, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.request(appendQueryString(backendApiPath(`/partners/customers`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'page' });
    }
    /** Unbind a customer from a partner */
    async delete(bindingId, requestOptions) {
        return this.client.request(backendApiPath(`/partners/customers/${serializePathParameter(bindingId, { name: 'bindingId', style: 'simple', explode: false })}`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'DELETE' });
    }
}
export class PartnersJoinFeePaymentsApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** Record a join fee payment and trigger ancestor commission */
    async create(partnerId, body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/${serializePathParameter(partnerId, { name: 'partnerId', style: 'simple', explode: false })}/join_fee_payments`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
    /** List join fee payments across all partners */
    async list(params, requestOptions) {
        const query = buildQueryString([
            { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
            { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'partner_id', value: params?.partnerId, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.request(appendQueryString(backendApiPath(`/partners/join_fee_payments`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'page' });
    }
}
export class PartnersAncestorsApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** List the partner ancestor chain */
    async list(partnerId, requestOptions) {
        return this.client.request(backendApiPath(`/partners/${serializePathParameter(partnerId, { name: 'partnerId', style: 'simple', explode: false })}/ancestors`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'item' });
    }
}
export class PartnersTreeApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** List the partner descendant tree */
    async list(partnerId, requestOptions) {
        return this.client.request(backendApiPath(`/partners/${serializePathParameter(partnerId, { name: 'partnerId', style: 'simple', explode: false })}/tree`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'item' });
    }
}
export class PartnersUserAccountApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** Bind an IAM user account to a partner */
    async create(partnerId, body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/${serializePathParameter(partnerId, { name: 'partnerId', style: 'simple', explode: false })}/user_account`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
}
export class PartnersCommissionConfigApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** Retrieve the commission configuration */
    async retrieve(requestOptions) {
        return this.client.request(backendApiPath(`/partners/commission_config`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'item' });
    }
    /** Update the commission configuration */
    async update(body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/commission_config`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'PATCH', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
}
export class PartnersLevelsApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** List partner levels */
    async list(requestOptions) {
        return this.client.request(backendApiPath(`/partners/levels`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'page' });
    }
    /** Create a partner level */
    async create(body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/levels`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
    /** Update a partner level */
    async update(levelId, body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/levels/${serializePathParameter(levelId, { name: 'levelId', style: 'simple', explode: false })}`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'PATCH', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
    /** Delete a partner level */
    async delete(levelId, requestOptions) {
        return this.client.request(backendApiPath(`/partners/levels/${serializePathParameter(levelId, { name: 'levelId', style: 'simple', explode: false })}`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'DELETE' });
    }
}
export class PartnersApi {
    client;
    levels;
    commissionConfig;
    userAccount;
    tree;
    ancestors;
    joinFeePayments;
    customerBindings;
    commissionEvents;
    settlements;
    ledgerEntries;
    auditLogs;
    withdrawals;
    withdrawalReviews;
    withdrawalPayments;
    statsOverview;
    stats;
    applications;
    constructor(client) {
        this.client = client;
        this.levels = new PartnersLevelsApi(client);
        this.commissionConfig = new PartnersCommissionConfigApi(client);
        this.userAccount = new PartnersUserAccountApi(client);
        this.tree = new PartnersTreeApi(client);
        this.ancestors = new PartnersAncestorsApi(client);
        this.joinFeePayments = new PartnersJoinFeePaymentsApi(client);
        this.customerBindings = new PartnersCustomerBindingsApi(client);
        this.commissionEvents = new PartnersCommissionEventsApi(client);
        this.settlements = new PartnersSettlementsApi(client);
        this.ledgerEntries = new PartnersLedgerEntriesApi(client);
        this.auditLogs = new PartnersAuditLogsApi(client);
        this.withdrawals = new PartnersWithdrawalsApi(client);
        this.withdrawalReviews = new PartnersWithdrawalReviewsApi(client);
        this.withdrawalPayments = new PartnersWithdrawalPaymentsApi(client);
        this.statsOverview = new PartnersStatsOverviewApi(client);
        this.stats = new PartnersStatsApi(client);
        this.applications = new PartnersApplicationsApi(client);
    }
    /** List partners */
    async list(params, requestOptions) {
        const query = buildQueryString([
            { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
            { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
            { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
            { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
            { name: 'level_no', value: params?.levelNo, style: 'form', explode: true, allowReserved: false },
            { name: 'created_from', value: params?.createdFrom, style: 'form', explode: true, allowReserved: false },
            { name: 'created_to', value: params?.createdTo, style: 'form', explode: true, allowReserved: false },
            { name: 'join_fee_status', value: params?.joinFeeStatus, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.request(appendQueryString(backendApiPath(`/partners`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'page' });
    }
    /** Create a partner */
    async create(body, requestOptions) {
        return this.client.request(backendApiPath(`/partners`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
    /** Retrieve a partner */
    async retrieve(partnerId, requestOptions) {
        return this.client.request(backendApiPath(`/partners/${serializePathParameter(partnerId, { name: 'partnerId', style: 'simple', explode: false })}`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET', sdkworkUnwrapKind: 'item' });
    }
    /** Update a partner */
    async update(partnerId, body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/${serializePathParameter(partnerId, { name: 'partnerId', style: 'simple', explode: false })}`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'PATCH', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
}
export function createPartnersApi(client) {
    return new PartnersApi(client);
}
function appendQueryString(path, rawQueryString) {
    const query = rawQueryString.replace(/^\?+/, '');
    if (!query) {
        return path;
    }
    return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}
function serializePathParameter(value, spec) {
    if (value === undefined || value === null) {
        return '';
    }
    const style = spec.style || 'simple';
    if (Array.isArray(value)) {
        return serializePathArray(spec.name, value, style, spec.explode);
    }
    if (typeof value === 'object') {
        return serializePathObject(spec.name, value, style, spec.explode);
    }
    return pathPrefix(spec.name, style, false) + encodePathValue(serializePathPrimitive(value));
}
function serializePathArray(name, values, style, explode) {
    const serialized = values
        .filter((item) => item !== undefined && item !== null)
        .map((item) => encodePathValue(serializePathPrimitive(item)));
    if (serialized.length === 0) {
        return pathPrefix(name, style, false);
    }
    if (style === 'matrix') {
        return explode
            ? serialized.map((item) => `;${name}=${item}`).join('')
            : `;${name}=${serialized.join(',')}`;
    }
    return pathPrefix(name, style, false) + serialized.join(explode ? '.' : ',');
}
function serializePathObject(name, value, style, explode) {
    const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
    if (entries.length === 0) {
        return pathPrefix(name, style, true);
    }
    if (style === 'matrix') {
        return explode
            ? entries.map(([key, entryValue]) => `;${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join('')
            : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',')}`;
    }
    const serialized = explode
        ? entries.map(([key, entryValue]) => `${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join(style === 'label' ? '.' : ',')
        : entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',');
    return pathPrefix(name, style, true) + serialized;
}
function pathPrefix(name, style, _objectValue) {
    if (style === 'label')
        return '.';
    if (style === 'matrix')
        return `;${name}`;
    return '';
}
function encodePathValue(value) {
    return encodeURIComponent(value);
}
function serializePathPrimitive(value) {
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
}
function buildQueryString(parameters) {
    const pairs = [];
    for (const parameter of parameters) {
        appendSerializedParameter(pairs, parameter);
    }
    return pairs.join('&');
}
function appendSerializedParameter(pairs, parameter) {
    if (parameter.value === undefined || parameter.value === null) {
        return;
    }
    if (parameter.contentType) {
        pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(JSON.stringify(parameter.value), parameter.allowReserved)}`);
        return;
    }
    const style = parameter.style || 'form';
    if (style === 'deepObject') {
        appendDeepObjectParameter(pairs, parameter.name, parameter.value, parameter.allowReserved);
        return;
    }
    if (Array.isArray(parameter.value)) {
        appendArrayParameter(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
        return;
    }
    if (typeof parameter.value === 'object') {
        appendObjectParameter(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
        return;
    }
    pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(serializePrimitive(parameter.value), parameter.allowReserved)}`);
}
function appendArrayParameter(pairs, name, value, style, explode, allowReserved) {
    const values = value
        .filter((item) => item !== undefined && item !== null)
        .map((item) => serializePrimitive(item));
    if (values.length === 0) {
        return;
    }
    if (style === 'form' && explode) {
        for (const item of values) {
            pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(item, allowReserved)}`);
        }
        return;
    }
    pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(values.join(','), allowReserved)}`);
}
function appendObjectParameter(pairs, name, value, style, explode, allowReserved) {
    const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
    if (entries.length === 0) {
        return;
    }
    if (style === 'form' && explode) {
        for (const [key, entryValue] of entries) {
            pairs.push(`${encodeQueryComponent(key)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
        }
        return;
    }
    const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive(entryValue)]).join(',');
    pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serialized, allowReserved)}`);
}
function appendDeepObjectParameter(pairs, name, value, allowReserved) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serializePrimitive(value), allowReserved)}`);
        return;
    }
    for (const [key, entryValue] of Object.entries(value)) {
        if (entryValue === undefined || entryValue === null) {
            continue;
        }
        pairs.push(`${encodeQueryComponent(`${name}[${key}]`)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
    }
}
function serializePrimitive(value) {
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
}
function encodeQueryComponent(value) {
    return encodeURIComponent(value);
}
function encodeQueryValue(value, allowReserved) {
    const encoded = encodeURIComponent(value);
    if (!allowReserved) {
        return encoded;
    }
    return encoded.replace(/%3A/gi, ':')
        .replace(/%2F/gi, '/')
        .replace(/%3F/gi, '?')
        .replace(/%23/gi, '#')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']')
        .replace(/%40/gi, '@')
        .replace(/%21/gi, '!')
        .replace(/%24/gi, '$')
        .replace(/%26/gi, '&')
        .replace(/%27/gi, "'")
        .replace(/%28/gi, '(')
        .replace(/%29/gi, ')')
        .replace(/%2A/gi, '*')
        .replace(/%2B/gi, '+')
        .replace(/%2C/gi, ',')
        .replace(/%3B/gi, ';')
        .replace(/%3D/gi, '=');
}
//# sourceMappingURL=partners.js.map