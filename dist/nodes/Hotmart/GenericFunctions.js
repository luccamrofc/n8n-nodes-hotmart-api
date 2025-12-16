"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseUrl = getBaseUrl;
exports.getAccessToken = getAccessToken;
exports.hotmartApiRequest = hotmartApiRequest;
exports.hotmartApiRequestAllItems = hotmartApiRequestAllItems;
const n8n_workflow_1 = require("n8n-workflow");
const tokenCache = new Map();
function getBaseUrl(environment) {
    return environment === 'sandbox'
        ? 'https://sandbox.hotmart.com'
        : 'https://api-hot-connect.hotmart.com';
}
async function getAccessToken(credentials) {
    const cacheKey = `${credentials.clientId}:${credentials.environment}`;
    const cached = tokenCache.get(cacheKey);
    if (cached && cached.expiry > Date.now() + 60000) {
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
            throw new Error(`Authentication failed: ${response.statusText}`);
        }
        const data = (await response.json());
        tokenCache.set(cacheKey, {
            token: data.access_token,
            expiry: Date.now() + (data.expires_in * 1000),
        });
        return data.access_token;
    }
    catch (error) {
        throw new Error(`Failed to get Hotmart access token: ${error.message}`);
    }
}
async function hotmartApiRequest(method, endpoint, body = {}, qs = {}) {
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
        throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: error.message });
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
