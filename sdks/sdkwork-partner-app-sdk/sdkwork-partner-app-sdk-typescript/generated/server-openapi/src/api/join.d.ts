import type { ApiRequestOptions, HttpClient } from '../http/client';
import type { InviteCodeValidateItem, PageInfo, PartnerJoinApplicationItem, PartnerJoinApplicationSubmitRequest, PartnerJoinProgramItem } from '../types';
export declare class JoinPartnerJoinInviteCodeApi {
    private client;
    constructor(client: HttpClient);
    /** Validate an invite code */
    retrieve(code: string, requestOptions?: ApiRequestOptions): Promise<InviteCodeValidateItem>;
}
export interface JoinPartnerJoinApplicationListParams {
    page?: number;
    pageSize?: number;
}
export declare class JoinPartnerJoinApplicationApi {
    private client;
    constructor(client: HttpClient);
    /** Submit a partner join application */
    create(body: PartnerJoinApplicationSubmitRequest, requestOptions?: ApiRequestOptions): Promise<PartnerJoinApplicationItem>;
    /** List my join applications */
    list(params?: JoinPartnerJoinApplicationListParams, requestOptions?: ApiRequestOptions): Promise<{
        items: PartnerJoinApplicationItem[];
        pageInfo: PageInfo;
    }>;
    /** Cancel my join application */
    cancel(applicationId: string, requestOptions?: ApiRequestOptions): Promise<PartnerJoinApplicationItem>;
}
export declare class JoinPartnerJoinApi {
    private client;
    readonly application: JoinPartnerJoinApplicationApi;
    readonly inviteCode: JoinPartnerJoinInviteCodeApi;
    constructor(client: HttpClient);
    /** Retrieve partner program catalog */
    retrieve(requestOptions?: ApiRequestOptions): Promise<PartnerJoinProgramItem>;
}
export declare class JoinApi {
    private client;
    readonly partnerJoin: JoinPartnerJoinApi;
    constructor(client: HttpClient);
}
export declare function createJoinApi(client: HttpClient): JoinApi;
//# sourceMappingURL=join.d.ts.map