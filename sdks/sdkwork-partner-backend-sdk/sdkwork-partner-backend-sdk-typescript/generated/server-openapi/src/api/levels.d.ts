import type { ApiRequestOptions, HttpClient } from '../http/client';
import type { AdminLevelsRestoreDefaultsRequest, RestoreDefaultLevelsResult } from '../types';
export declare class LevelsLevelsRestoreDefaultsApi {
    private client;
    constructor(client: HttpClient);
    /** Restore the commercial default level catalog (seven-tier pyramid). */
    create(body?: AdminLevelsRestoreDefaultsRequest, requestOptions?: ApiRequestOptions): Promise<RestoreDefaultLevelsResult>;
}
export declare class LevelsApi {
    readonly levelsRestoreDefaults: LevelsLevelsRestoreDefaultsApi;
    constructor(client: HttpClient);
}
export declare function createLevelsApi(client: HttpClient): LevelsApi;
//# sourceMappingURL=levels.d.ts.map