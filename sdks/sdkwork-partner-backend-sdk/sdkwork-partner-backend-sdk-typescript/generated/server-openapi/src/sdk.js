import { createHttpClient } from './http/client';
import { createPartnersApi } from './api/partners';
import { createLevelsApi } from './api/levels';
export class SdkworkBackendClient {
    httpClient;
    partners;
    levels;
    constructor(config) {
        this.httpClient = createHttpClient(config);
        this.partners = createPartnersApi(this.httpClient);
        this.levels = createLevelsApi(this.httpClient);
    }
    setAuthToken(token) {
        this.httpClient.setAuthToken(token);
        return this;
    }
    setAccessToken(token) {
        this.httpClient.setAccessToken(token);
        return this;
    }
    setTokenManager(manager) {
        this.httpClient.setTokenManager(manager);
        return this;
    }
    get http() {
        return this.httpClient;
    }
}
export function createClient(config) {
    return new SdkworkBackendClient(config);
}
export default SdkworkBackendClient;
//# sourceMappingURL=sdk.js.map