import { appApiPath } from './paths';
export class JoinPartnerJoinInviteCodeApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** Validate an invite code */
    async retrieve(code, requestOptions) {
        return this.client.request(appApiPath(`/partner_join/invite_codes/${serializePathParameter(code, { name: 'code', style: 'simple', explode: false })}`), { signal: requestOptions?.signal, timeout: requestOptions?.timeout, method: 'GET', skipAuth: true, sdkworkUnwrapKind: 'item' });
    }
}
export class JoinPartnerJoinApplicationApi {
    client;
    constructor(client) {
        this.client = client;
    }
    /** Submit a partner join application */
    async create(body, requestOptions) {
        return this.client.request(appApiPath(`/partner_join/applications`), { signal: requestOptions?.signal, timeout: requestOptions?.timeout, method: 'POST', body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
    }
    /** List my join applications */
    async list(params, requestOptions) {
        const query = buildQueryString([
            { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
            { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
        ]);
        return this.client.request(appendQueryString(appApiPath(`/partner_join/applications/mine`), query), { signal: requestOptions?.signal, timeout: requestOptions?.timeout, method: 'GET', sdkworkUnwrapKind: 'page' });
    }
    /** Cancel my join application */
    async cancel(applicationId, requestOptions) {
        return this.client.request(appApiPath(`/partner_join/applications/${serializePathParameter(applicationId, { name: 'applicationId', style: 'simple', explode: false })}/cancel`), { signal: requestOptions?.signal, timeout: requestOptions?.timeout, method: 'POST', sdkworkUnwrapKind: 'item' });
    }
}
export class JoinPartnerJoinApi {
    client;
    application;
    inviteCode;
    constructor(client) {
        this.client = client;
        this.application = new JoinPartnerJoinApplicationApi(client);
        this.inviteCode = new JoinPartnerJoinInviteCodeApi(client);
    }
    /** Retrieve partner program catalog */
    async retrieve(requestOptions) {
        return this.client.request(appApiPath(`/partner_join`), { signal: requestOptions?.signal, timeout: requestOptions?.timeout, method: 'GET', skipAuth: true, sdkworkUnwrapKind: 'item' });
    }
}
export class JoinApi {
    client;
    partnerJoin;
    constructor(client) {
        this.client = client;
        this.partnerJoin = new JoinPartnerJoinApi(client);
    }
}
export function createJoinApi(client) {
    return new JoinApi(client);
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
//# sourceMappingURL=join.js.map