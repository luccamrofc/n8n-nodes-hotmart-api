import type { IExecuteFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export interface IHotmartCredentials {
    environment: 'production' | 'sandbox';
    clientId: string;
    clientSecret: string;
    basicToken: string;
}
export declare function getBaseUrl(environment: string): string;
export declare function invalidateTokenCache(credentials: IHotmartCredentials): void;
export declare function getAccessToken(credentials: IHotmartCredentials): Promise<string>;
export declare function hotmartApiRequest(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject, retryCount?: number): Promise<IDataObject | IDataObject[]>;
export declare function hotmartApiRequestAllItems(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<IDataObject[]>;
export declare function testHotmartCredentials(credentials: IHotmartCredentials): Promise<boolean>;
