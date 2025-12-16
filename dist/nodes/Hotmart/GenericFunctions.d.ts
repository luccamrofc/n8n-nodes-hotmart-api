import type { IExecuteFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
interface IHotmartCredentials {
    environment: 'production' | 'sandbox';
    clientId: string;
    clientSecret: string;
    basicToken: string;
}
export declare function getBaseUrl(environment: string): string;
export declare function getAccessToken(credentials: IHotmartCredentials): Promise<string>;
export declare function hotmartApiRequest(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<IDataObject | IDataObject[]>;
export declare function hotmartApiRequestAllItems(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<IDataObject[]>;
export {};
