import type {
    IExecuteFunctions,
    IDataObject,
    IHttpRequestMethods,
    IHttpRequestOptions,
    JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export interface IHotmartCredentials {
    environment: 'production' | 'sandbox';
    clientId: string;
    clientSecret: string;
    basicToken: string;
}

interface ITokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope?: string;
    jti?: string;
}

interface ITokenCache {
    token: string;
    expiry: number;
    tokenType: string;
}

// Buffer de expiração: 5 minutos antes do token expirar
const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000;

// Configurações de retry para rate limit
const RATE_LIMIT_RETRY_COUNT = 3;
const RATE_LIMIT_BASE_DELAY_MS = 1000;

// Cache para access tokens
const tokenCache: Map<string, ITokenCache> = new Map();

/**
 * Delay helper para retry com backoff
 */
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Obtém a URL base baseada no ambiente
 */
export function getBaseUrl(environment: string): string {
    return environment === 'sandbox'
        ? 'https://sandbox.hotmart.com'
        : 'https://developers.hotmart.com';
}

/**
 * Gera a chave de cache única para as credenciais
 */
function getCacheKey(credentials: IHotmartCredentials): string {
    return `${credentials.clientId}:${credentials.environment}`;
}

/**
 * Invalida o cache de token para as credenciais especificadas
 */
export function invalidateTokenCache(credentials: IHotmartCredentials): void {
    const cacheKey = getCacheKey(credentials);
    tokenCache.delete(cacheKey);
}

/**
 * Obtém access token OAuth usando client credentials flow
 * Implementa cache com buffer de expiração de 5 minutos
 */
export async function getAccessToken(
    credentials: IHotmartCredentials,
): Promise<string> {
    const cacheKey = getCacheKey(credentials);
    const cached = tokenCache.get(cacheKey);

    // Retorna token cacheado se ainda válido (com buffer de 5 minutos)
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

        const data = (await response.json()) as ITokenResponse;

        // Valida o tipo de token
        if (data.token_type?.toLowerCase() !== 'bearer') {
            throw new Error(`Tipo de token inesperado: ${data.token_type}`);
        }

        // Cacheia o token
        tokenCache.set(cacheKey, {
            token: data.access_token,
            expiry: Date.now() + (data.expires_in * 1000),
            tokenType: data.token_type,
        });

        return data.access_token;
    } catch (error) {
        throw new Error(`Falha ao obter access token da Hotmart: ${(error as Error).message}`);
    }
}

/**
 * Faz uma requisição autenticada para a API da Hotmart
 * Implementa retry automático em caso de erro 401 (token) e 429 (rate limit)
 */
export async function hotmartApiRequest(
    this: IExecuteFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
    retryCount: number = 0,
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
        const err = error as { statusCode?: number; message?: string };

        // Retry para 401 (token expirado) - apenas na primeira tentativa
        if (err.statusCode === 401 && retryCount === 0) {
            invalidateTokenCache(credentials);
            return hotmartApiRequest.call(this, method, endpoint, body, qs, 1);
        }

        // Retry para 429 (rate limit) com backoff exponencial
        if (err.statusCode === 429 && retryCount < RATE_LIMIT_RETRY_COUNT) {
            const delayMs = RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, retryCount);
            await delay(delayMs);
            return hotmartApiRequest.call(this, method, endpoint, body, qs, retryCount + 1);
        }

        // Mensagem de erro melhorada para rate limit
        let errorMessage = err.message || 'Erro desconhecido na requisição';
        if (err.statusCode === 429) {
            errorMessage = `Rate limit da API Hotmart excedido após ${RATE_LIMIT_RETRY_COUNT} tentativas. Aguarde alguns minutos antes de tentar novamente. Dica: reduza a frequência de requisições ou use paginação para buscar menos dados por vez.`;
        }

        throw new NodeApiError(this.getNode(), {
            message: errorMessage
        } as JsonObject);
    }
}

/**
 * Faz uma requisição autenticada com suporte a paginação
 * Obtém todos os itens de endpoints paginados
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

/**
 * Testa as credenciais da Hotmart obtendo um token
 * Retorna true se bem-sucedido, lança erro se falhar
 */
export async function testHotmartCredentials(
    credentials: IHotmartCredentials,
): Promise<boolean> {
    try {
        await getAccessToken(credentials);
        return true;
    } catch (error) {
        throw new Error(`Credenciais inválidas: ${(error as Error).message}`);
    }
}
