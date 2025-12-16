import type {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IHttpRequestMethods,
    IDataObject,
} from 'n8n-workflow';

import {
    salesOperations,
    salesFields,
    subscriptionsOperations,
    subscriptionsFields,
    productsOperations,
    productsFields,
    membersOperations,
    membersFields,
} from './descriptions';

import {
    getAccessToken,
    getBaseUrl,
} from './GenericFunctions';

export class Hotmart implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Hotmart',
        name: 'hotmart',
        icon: 'file:hotmart.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Hotmart API',
        defaults: {
            name: 'Hotmart',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'hotmartApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: '={{$credentials.environment === "sandbox" ? "https://sandbox.hotmart.com" : "https://api-hot-connect.hotmart.com"}}',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Member Area',
                        value: 'members',
                    },
                    {
                        name: 'Product',
                        value: 'products',
                    },
                    {
                        name: 'Sale',
                        value: 'sales',
                    },
                    {
                        name: 'Subscription',
                        value: 'subscriptions',
                    },
                ],
                default: 'sales',
            },
            // Operations and Fields
            ...salesOperations,
            ...salesFields,
            ...subscriptionsOperations,
            ...subscriptionsFields,
            ...productsOperations,
            ...productsFields,
            ...membersOperations,
            ...membersFields,
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        // Get credentials and access token
        const credentials = await this.getCredentials('hotmartApi');
        const accessToken = await getAccessToken({
            environment: credentials.environment as 'production' | 'sandbox',
            clientId: credentials.clientId as string,
            clientSecret: credentials.clientSecret as string,
            basicToken: credentials.basicToken as string,
        });

        const baseUrl = getBaseUrl(credentials.environment as string);

        for (let i = 0; i < items.length; i++) {
            try {
                let endpoint = '';
                let method: IHttpRequestMethods = 'GET';
                const qs: IDataObject = {};
                let body: IDataObject = {};

                // Build request based on resource and operation
                if (resource === 'sales') {
                    if (operation === 'getAll') {
                        endpoint = '/payments/api/v1/sales/history';
                    } else if (operation === 'getSummary') {
                        endpoint = '/payments/api/v1/sales/summary';
                    } else if (operation === 'getCommissions') {
                        endpoint = '/payments/api/v1/sales/commissions';
                    } else if (operation === 'getPriceDetails') {
                        endpoint = '/payments/api/v1/sales/price/details';
                    }

                    // Apply filters
                    const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
                    Object.assign(qs, filters);

                    // Apply limit
                    const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
                    if (!returnAll) {
                        const limit = this.getNodeParameter('limit', i, 50) as number;
                        qs.max_results = limit;
                    }
                }

                if (resource === 'subscriptions') {
                    if (operation === 'getAll') {
                        endpoint = '/payments/api/v1/subscriptions';
                    } else if (operation === 'getSummary') {
                        endpoint = '/payments/api/v1/subscriptions/summary';
                    } else if (operation === 'getPurchases') {
                        endpoint = '/payments/api/v1/subscriptions/purchases';
                    } else if (operation === 'cancel') {
                        const subscriberCode = this.getNodeParameter('subscriberCode', i) as string;
                        endpoint = `/payments/api/v1/subscriptions/${subscriberCode}/cancel`;
                        method = 'POST';
                        const sendMail = this.getNodeParameter('sendMail', i, true) as boolean;
                        qs.send_mail = sendMail;
                    } else if (operation === 'reactivate') {
                        const subscriberCode = this.getNodeParameter('subscriberCode', i) as string;
                        endpoint = `/payments/api/v1/subscriptions/${subscriberCode}/reactivate`;
                        method = 'POST';
                    } else if (operation === 'changeBillingDate') {
                        const subscriberCode = this.getNodeParameter('subscriberCode', i) as string;
                        endpoint = `/payments/api/v1/subscriptions/${subscriberCode}/charge-date`;
                        method = 'PATCH';
                        const dueDay = this.getNodeParameter('dueDay', i) as number;
                        body = { due_day: dueDay };
                    }

                    // Apply filters for list operations
                    if (['getAll', 'getSummary', 'getPurchases'].includes(operation)) {
                        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
                        Object.assign(qs, filters);

                        const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
                        if (!returnAll && operation !== 'getSummary') {
                            const limit = this.getNodeParameter('limit', i, 50) as number;
                            qs.max_results = limit;
                        }
                    }
                }

                if (resource === 'products') {
                    if (operation === 'getAll') {
                        endpoint = '/products/api/v1/products';

                        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
                        Object.assign(qs, filters);

                        const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', i, 50) as number;
                            qs.max_results = limit;
                        }
                    }
                }

                if (resource === 'members') {
                    const subdomain = this.getNodeParameter('subdomain', i) as string;

                    if (operation === 'getStudents') {
                        endpoint = `/club/api/v2/${subdomain}/users`;
                    } else if (operation === 'getModules') {
                        endpoint = `/club/api/v2/${subdomain}/modules`;
                    } else if (operation === 'getPages') {
                        const moduleId = this.getNodeParameter('moduleId', i) as string;
                        endpoint = `/club/api/v2/${subdomain}/modules/${moduleId}/pages`;
                    } else if (operation === 'getStudentProgress') {
                        const userId = this.getNodeParameter('userId', i) as string;
                        endpoint = `/club/api/v2/${subdomain}/users/${userId}/progress`;
                    }

                    // Apply filters for list operations
                    if (['getStudents', 'getModules', 'getPages'].includes(operation)) {
                        if (operation === 'getStudents') {
                            const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
                            Object.assign(qs, filters);
                        }

                        const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', i, 50) as number;
                            qs.max_results = limit;
                        }
                    }
                }

                // Make the API request
                const requestOptions = {
                    method,
                    url: `${baseUrl}${endpoint}`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    qs,
                    body: Object.keys(body).length > 0 ? body : undefined,
                    json: true,
                };

                const response = await this.helpers.httpRequest(requestOptions);

                // Handle response
                if (response.items && Array.isArray(response.items)) {
                    // If response has items array, return each item
                    for (const item of response.items) {
                        returnData.push({ json: item as IDataObject });
                    }
                } else {
                    // Return the whole response
                    returnData.push({ json: response as IDataObject });
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: (error as Error).message } });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}
