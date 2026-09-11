import { backendApiPath } from './paths';
export class LevelsLevelsRestoreDefaultsApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** Restore the commercial default level catalog (seven-tier pyramid). */
    async create(body, requestOptions) {
        return this.client.request(backendApiPath(`/partners/levels/restore_defaults`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST', ...(body !== undefined ? { body, contentType: 'application/json' } : {}), sdkworkUnwrapKind: 'item' });
    }
}
export class LevelsApi {
    levelsRestoreDefaults;
    constructor(client) {
        this.levelsRestoreDefaults = new LevelsLevelsRestoreDefaultsApi(client);
    }
}
export function createLevelsApi(client) {
    return new LevelsApi(client);
}
//# sourceMappingURL=levels.js.map