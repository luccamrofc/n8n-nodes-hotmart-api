import type { IWebhookFunctions, INodeType, INodeTypeDescription, IWebhookResponseData } from 'n8n-workflow';
export declare class HotmartTrigger implements INodeType {
    description: INodeTypeDescription;
    webhook(this: IWebhookFunctions): Promise<IWebhookResponseData>;
}
