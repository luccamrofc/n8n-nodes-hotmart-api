import type {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IHttpRequestMethods,
    IDataObject,
    JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import {
    salesOperations,
    salesFields,
    subscriptionsOperations,
    subscriptionsFields,
    productsOperations,
    productsFields,
    membersOperations,
    membersFields,
    authOperations,
    authFields,
    couponsOperations,
    couponsFields,
    installmentsOperations,
    installmentsFields,
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
                        description: 'Passar token de acesso dinamicamente - ideal para aplicações multi-tenant SaaS. Use a operação "Obter Access Token" para obter o token primeiro.',
                    },
                ],
                default: 'credentials',
                description: 'Escolha como autenticar com a API da Hotmart',
            },
            // Dynamic Token Fields (shown only in SaaS mode and NOT for auth resource)
            {
                displayName: 'Token de Acesso',
                name: 'accessToken',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                displayOptions: {
                    show: {
                        authMode: ['dynamic'],
                        resource: ['sales', 'subscriptions', 'products', 'members', 'coupons', 'installments'],
                    },
                },
                default: '',
                description: 'O token de acesso OAuth da Hotmart. Use a operação "Autenticação > Obter Access Token" para obter este token, ou passe de um node anterior.',
            },
            {
                displayName: 'Ambiente',
                name: 'environment',
                type: 'options',
                displayOptions: {
                    show: {
                        authMode: ['dynamic'],
                        resource: ['sales', 'subscriptions', 'products', 'members', 'coupons', 'installments'],
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
                description: 'O ambiente da Hotmart. IMPORTANTE: Credenciais de Produção só funcionam em Produção e vice-versa.',
            },
            // Resource Selector
            {
                displayName: 'Recurso',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Autenticação',
                        value: 'auth',
                    },
                    {
                        name: 'Área de Membros',
                        value: 'members',
                    },
                    {
                        name: 'Assinatura',
                        value: 'subscriptions',
                    },
                    {
                        name: 'Cupom',
                        value: 'coupons',
                    },
                    {
                        name: 'Negociação de Parcelas',
                        value: 'installments',
                    },
                    {
                        name: 'Produto',
                        value: 'products',
                    },
                    {
                        name: 'Venda',
                        value: 'sales',
                    },
                ],
                default: 'sales',
            },
            // Operations and Fields
            ...authOperations,
            ...authFields,
            ...salesOperations,
            ...salesFields,
            ...subscriptionsOperations,
            ...subscriptionsFields,
            ...productsOperations,
            ...productsFields,
            ...membersOperations,
            ...membersFields,
            ...couponsOperations,
            ...couponsFields,
            ...installmentsOperations,
            ...installmentsFields,
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        const authMode = this.getNodeParameter('authMode', 0) as string;
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        // Handle Auth resource separately (doesn't require prior authentication)
        if (resource === 'auth') {
            if (operation === 'getAccessToken') {
                for (let i = 0; i < items.length; i++) {
                    try {
                        const clientId = this.getNodeParameter('authClientId', i) as string;
                        const clientSecret = this.getNodeParameter('authClientSecret', i) as string;
                        const basicToken = this.getNodeParameter('authBasicToken', i) as string;
                        const environment = this.getNodeParameter('authEnvironment', i) as 'production' | 'sandbox';

                        const accessToken = await getAccessToken({
                            environment,
                            clientId,
                            clientSecret,
                            basicToken,
                        });

                        // Calculate expiration time (Hotmart tokens typically expire in 7200 seconds / 2 hours)
                        const expiresIn = 7200;
                        const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

                        returnData.push({
                            json: {
                                access_token: accessToken,
                                token_type: 'bearer',
                                expires_in: expiresIn,
                                expires_at: expiresAt,
                                environment,
                            },
                        });
                    } catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ json: { error: (error as Error).message } });
                            continue;
                        }
                        throw error;
                    }
                }
            }
            return [returnData];
        }

        // For other resources, get authentication
        let accessToken: string;
        let baseUrl: string;

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
            accessToken = this.getNodeParameter('accessToken', 0, '') as string;
            const environment = this.getNodeParameter('environment', 0, 'production') as string;

            if (!accessToken) {
                throw new Error('Token de Acesso é obrigatório no modo SaaS. Use a operação "Autenticação > Obter Access Token" primeiro.');
            }

            baseUrl = getBaseUrl(environment);
        }

        for (let i = 0; i < items.length; i++) {
            try {
                // In SaaS mode, allow different tokens per item
                let itemAccessToken = accessToken;
                let itemBaseUrl = baseUrl;

                if (authMode === 'dynamic') {
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

                if (resource === 'coupons') {
                    const productId = this.getNodeParameter('productId', i, '') as string;

                    if (operation === 'create') {
                        endpoint = `/products/api/v1/product/${productId}/coupon`;
                        method = 'POST';

                        const couponCode = this.getNodeParameter('couponCode', i) as string;
                        const discountPercent = this.getNodeParameter('discount', i) as number;
                        // Convert percentage (1-99) to decimal (0.01-0.99)
                        const discount = discountPercent / 100;

                        body = {
                            code: couponCode,
                            discount,
                        };

                        const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

                        if (additionalOptions.startDate) {
                            body.start_date = new Date(additionalOptions.startDate as string).getTime();
                        }
                        if (additionalOptions.endDate) {
                            body.end_date = new Date(additionalOptions.endDate as string).getTime();
                        }
                        if (additionalOptions.affiliateId) {
                            body.affiliate = additionalOptions.affiliateId;
                        }
                        if (additionalOptions.offerIds) {
                            body.offer_ids = (additionalOptions.offerIds as string).split(',').map(id => id.trim());
                        }
                    } else if (operation === 'getAll') {
                        endpoint = `/products/api/v1/coupon/product/${productId}`;

                        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
                        if (filters.code) {
                            qs.code = filters.code;
                        }

                        const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', i, 50) as number;
                            qs.max_results = limit;
                        }
                    } else if (operation === 'delete') {
                        const couponId = this.getNodeParameter('couponId', i) as string;
                        endpoint = `/products/api/v1/coupon/${couponId}`;
                        method = 'DELETE';
                    }
                }

                if (resource === 'installments') {
                    if (operation === 'negotiate') {
                        endpoint = '/payments/api/v1/installments/negotiate';
                        method = 'POST';

                        const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
                        const recurrencesStr = this.getNodeParameter('recurrences', i) as string;
                        const paymentType = this.getNodeParameter('paymentType', i) as string;

                        // Parse recurrences string to array of numbers
                        const recurrences = recurrencesStr.split(',').map(r => parseInt(r.trim(), 10)).filter(r => !isNaN(r));

                        body = {
                            subscription_id: parseInt(subscriptionId, 10),
                            recurrences,
                            payment_type: paymentType,
                        };

                        // Add document for BILLET payment type
                        if (paymentType === 'BILLET') {
                            const document = this.getNodeParameter('document', i) as string;
                            body.document = document.replace(/[.\-\/]/g, ''); // Remove formatting
                        }

                        // Add discount if enabled
                        const offerDiscount = this.getNodeParameter('offerDiscount', i, false) as boolean;
                        if (offerDiscount) {
                            const discountType = this.getNodeParameter('discountType', i) as string;
                            const discountValue = this.getNodeParameter('discountValue', i) as number;
                            body.discount = {
                                type: discountType,
                                value: discountValue,
                            };
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
                // Extract error message safely to avoid circular reference issues
                const err = error as { message?: string; response?: { data?: { message?: string } }; statusCode?: number };
                const errorMessage = err.response?.data?.message || err.message || 'Erro desconhecido na requisição';

                if (this.continueOnFail()) {
                    returnData.push({ json: { error: errorMessage } });
                    continue;
                }

                throw new NodeApiError(this.getNode(), { message: errorMessage } as JsonObject);
            }
        }

        return [returnData];
    }
}
