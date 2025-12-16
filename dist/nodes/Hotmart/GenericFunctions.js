"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseUrl = getBaseUrl;
exports.invalidateTokenCache = invalidateTokenCache;
exports.getAccessToken = getAccessToken;
exports.hotmartApiRequest = hotmartApiRequest;
exports.hotmartApiRequestAllItems = hotmartApiRequestAllItems;
exports.testHotmartCredentials = testHotmartCredentials;
const n8n_workflow_1 = require("n8n-workflow");
const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000;
const tokenCache = new Map();
function getBaseUrl(environment) {
    return environment === 'sandbox'
        ? 'https://sandbox.hotmart.com'
        : 'https://api-hot-connect.hotmart.com';
}
function getCacheKey(credentials) {
    return `${credentials.clientId}:${credentials.environment}`;
}
function invalidateTokenCache(credentials) {
    const cacheKey = getCacheKey(credentials);
    tokenCache.delete(cacheKey);
}
async function getAccessToken(credentials) {
    var _a;
    const cacheKey = getCacheKey(credentials);
    const cached = tokenCache.get(cacheKey);
    if (cached && cached.expiry > Date.now() + TOKEN_EXPIRY_BUFFER_MS) {
        return cached.token;
    }
    const authUrl = 'https://api-sec-vlc.hotmart.com/security/oauth/token';
    try {
        const response = await fetch(authUrl, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${credentials.basicToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: credentials.clientId,
                client_secret: credentials.clientSecret,
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Falha na autenticação (${response.status}): ${errorText || response.statusText}`);
        }
        const data = (await response.json());
        if (((_a = data.token_type) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== 'bearer') {
            throw new Error(`Tipo de token inesperado: ${data.token_type}`);
        }
        tokenCache.set(cacheKey, {
            token: data.access_token,
            expiry: Date.now() + (data.expires_in * 1000),
            tokenType: data.token_type,
        });
        return data.access_token;
    }
    catch (error) {
        throw new Error(`Falha ao obter access token da Hotmart: ${error.message}`);
    }
}
async function hotmartApiRequest(method, endpoint, body = {}, qs = {}, retry = true) {
    const credentials = await this.getCredentials('hotmartApi');
    const accessToken = await getAccessToken(credentials);
    const baseUrl = getBaseUrl(credentials.environment);
    const options = {
        method,
        url: `${baseUrl}${endpoint}`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        qs,
        json: true,
    };
    if (Object.keys(body).length > 0) {
        options.body = body;
    }
    try {
        const response = await this.helpers.httpRequest(options);
        return response;
    }
    catch (error) {
        const err = error;
        if (err.statusCode === 401 && retry) {
            invalidateTokenCache(credentials);
            return hotmartApiRequest.call(this, method, endpoint, body, qs, false);
        }
        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
            message: err.message || 'Erro desconhecido na requisição'
        });
    }
}
async function hotmartApiRequestAllItems(method, endpoint, body = {}, qs = {}) {
    const returnData = [];
    let pageToken;
    do {
        if (pageToken) {
            qs.page_token = pageToken;
        }
        const response = await hotmartApiRequest.call(this, method, endpoint, body, qs);
        const items = response.items || [];
        returnData.push(...items);
        pageToken = response.page_token;
    } while (pageToken);
    return returnData;
}
async function testHotmartCredentials(credentials) {
    try {
        await getAccessToken(credentials);
        return true;
    }
    catch (error) {
        throw new Error(`Credenciais inválidas: ${error.message}`);
    }
}
