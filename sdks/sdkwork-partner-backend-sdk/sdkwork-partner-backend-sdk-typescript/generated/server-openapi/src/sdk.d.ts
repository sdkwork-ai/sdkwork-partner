import { HttpClient } from './http/client';
import type { SdkworkBackendConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';
import { PartnersApi } from './api/partners';
import { LevelsApi } from './api/levels';
export declare class SdkworkBackendClient {
    private httpClient;
    readonly partners: PartnersApi;
    readonly levels: LevelsApi;
    constructor(config: SdkworkBackendConfig);
    setAuthToken(token: string): this;
    setAccessToken(token: string): this;
    setTokenManager(manager: AuthTokenManager): this;
    get http(): HttpClient;
}
export declare function createClient(config: SdkworkBackendConfig): SdkworkBackendClient;
export default SdkworkBackendClient;
//# sourceMappingURL=sdk.d.ts.map