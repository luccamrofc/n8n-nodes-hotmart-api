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
        icon: 'file:hotmart.png',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Integração com a API da Hotmart com suporte a credenciais estáticas e tokens dinâmicos (modo SaaS)',
        defaults: {
            name: 'Hotmart',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'hotmartApi',
                required: true,
                displayOptions: {
                    show: {
                        authMode: ['credentials'],
                    },
                },
            },
        ],
        properties: [
            // Auth Mode Selector - FIRST PROPERTY
            {
                displayName: 'Modo de Autenticação',
                name: 'authMode',
                type: 'options',
                options: [
                    {
                        name: 'Credenciais (Uso Pessoal)',
                        value: 'credentials',
                        description: 'Usar credenciais salvas no n8n - ideal para uso pessoal/single-tenant',
                    },
                    {
                        name: 'Token Dinâmico (Modo SaaS)',
                        value: 'dynamic',
                        description: 'Passar token de acesso dinamicamente - ideal para aplicações multi-tenant SaaS',
                    },
                ],
                default: 'credentials',
                description: 'Escolha como autenticar com a API da Hotmart',
            },
            // Dynamic Token Fields (shown only in SaaS mode)
            {
                displayName: 'Token de Acesso',
                name: 'accessToken',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                required: true,
                displayOptions: {
                    show: {
                        authMode: ['dynamic'],
                    },
                },
                default: '',
                description: 'O token de acesso OAuth da Hotmart. Pode ser passado dinamicamente de um node anterior (ex: do seu banco de dados ou fluxo OAuth).',
            },
            {
                displayName: 'Ambiente',
                name: 'environment',
                type: 'options',
                required: true,
                displayOptions: {
                    show: {
                        authMode: ['dynamic'],
                    },
                },
                options: [
                    {
                        name: 'Produção',
                        value: 'production',
                    },
                    {
                        name: 'Sandbox',
                        value: 'sandbox',
                    },
                ],
                default: 'production',
                description: 'O ambiente da Hotmart para usar',
            },
            // Resource Selector
            {
                displayName: 'Recurso',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Área de Membros',
                        value: 'members',
                    },
                    {
                        name: 'Produto',
                        value: 'products',
                    },
                    {
                        name: 'Venda',
                        value: 'sales',
                    },
                    {
                        name: 'Assinatura',
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

        const authMode = this.getNodeParameter('authMode', 0) as string;
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        let accessToken: string;
        let baseUrl: string;

        // Get authentication based on mode
        if (authMode === 'credentials') {
            // Traditional n8n credentials mode
            const credentials = await this.getCredentials('hotmartApi');
            accessToken = await getAccessToken({
                environment: credentials.environment as 'production' | 'sandbox',
                clientId: credentials.clientId as string,
                clientSecret: credentials.clientSecret as string,
                basicToken: credentials.basicToken as string,
            });
            baseUrl = getBaseUrl(credentials.environment as string);
        } else {
            // Dynamic/SaaS mode - token passed directly
            accessToken = this.getNodeParameter('accessToken', 0) as string;
            const environment = this.getNodeParameter('environment', 0) as string;
            baseUrl = getBaseUrl(environment);
        }

        for (let i = 0; i < items.length; i++) {
            try {
                // In SaaS mode, allow different tokens per item
                let itemAccessToken = accessToken;
                let itemBaseUrl = baseUrl;

                if (authMode === 'dynamic') {
                    // Check if this item has its own token (for batch processing)
                    const itemToken = this.getNodeParameter('accessToken', i, '') as string;
                    if (itemToken) {
                        itemAccessToken = itemToken;
                    }
                    const itemEnv = this.getNodeParameter('environment', i, 'production') as string;
                    itemBaseUrl = getBaseUrl(itemEnv);
                }

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
                    url: `${itemBaseUrl}${endpoint}`,
                    headers: {
                        Authorization: `Bearer ${itemAccessToken}`,
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
