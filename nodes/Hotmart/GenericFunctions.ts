import type {
    IExecuteFunctions,
    IDataObject,
    IHttpRequestMethods,
    IHttpRequestOptions,
    JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

interface IHotmartCredentials {
    environment: 'production' | 'sandbox';
    clientId: string;
    clientSecret: string;
    basicToken: string;
}

interface ITokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

// Cache for access tokens
const tokenCache: Map<string, { token: string; expiry: number }> = new Map();

/**
 * Get the base URL based on the environment
 */
export function getBaseUrl(environment: string): string {
    return environment === 'sandbox'
        ? 'https://sandbox.hotmart.com'
        : 'https://api-hot-connect.hotmart.com';
}

/**
 * Get OAuth access token using client credentials flow
 */
export async function getAccessToken(
    credentials: IHotmartCredentials,
): Promise<string> {
    const cacheKey = `${credentials.clientId}:${credentials.environment}`;
    const cached = tokenCache.get(cacheKey);

    // Return cached token if still valid (with 60 second buffer)
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

        const data = (await response.json()) as ITokenResponse;

        // Cache the token
        tokenCache.set(cacheKey, {
            token: data.access_token,
            expiry: Date.now() + (data.expires_in * 1000),
        });

        return data.access_token;
    } catch (error) {
        throw new Error(`Failed to get Hotmart access token: ${(error as Error).message}`);
    }
}

/**
 * Make an authenticated API request to Hotmart
 */
export async function hotmartApiRequest(
    this: IExecuteFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
    const credentials = await this.getCredentials('hotmartApi') as unknown as IHotmartCredentials;

    const accessToken = await getAccessToken(credentials);
    const baseUrl = getBaseUrl(credentials.environment);

    const options: IHttpRequestOptions = {
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
        return response as IDataObject | IDataObject[];
    } catch (error) {
        throw new NodeApiError(this.getNode(), { message: (error as Error).message } as JsonObject);
    }
}

/**
 * Make an authenticated API request with pagination support
 */
export async function hotmartApiRequestAllItems(
    this: IExecuteFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
): Promise<IDataObject[]> {
    const returnData: IDataObject[] = [];
    let pageToken: string | undefined;

    do {
        if (pageToken) {
            qs.page_token = pageToken;
        }

        const response = await hotmartApiRequest.call(this, method, endpoint, body, qs) as IDataObject;

        const items = (response.items as IDataObject[]) || [];
        returnData.push(...items);

        pageToken = response.page_token as string | undefined;
    } while (pageToken);

    return returnData;
}
