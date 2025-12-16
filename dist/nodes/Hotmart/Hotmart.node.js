"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hotmart = void 0;
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class Hotmart {
    constructor() {
        this.description = {
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
                        hide: {
                            resource: ['auth'],
                        },
                    },
                    default: '',
                    description: 'O token de acesso OAuth da Hotmart. Use a operação "Autenticação > Obter Access Token" para obter este token, ou passe de um node anterior.',
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
                        hide: {
                            resource: ['auth'],
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
                ...descriptions_1.authOperations,
                ...descriptions_1.authFields,
                ...descriptions_1.salesOperations,
                ...descriptions_1.salesFields,
                ...descriptions_1.subscriptionsOperations,
                ...descriptions_1.subscriptionsFields,
                ...descriptions_1.productsOperations,
                ...descriptions_1.productsFields,
                ...descriptions_1.membersOperations,
                ...descriptions_1.membersFields,
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const authMode = this.getNodeParameter('authMode', 0);
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        if (resource === 'auth') {
            if (operation === 'getAccessToken') {
                for (let i = 0; i < items.length; i++) {
                    try {
                        const clientId = this.getNodeParameter('authClientId', i);
                        const clientSecret = this.getNodeParameter('authClientSecret', i);
                        const basicToken = this.getNodeParameter('authBasicToken', i);
                        const environment = this.getNodeParameter('authEnvironment', i);
                        const accessToken = await (0, GenericFunctions_1.getAccessToken)({
                            environment,
                            clientId,
                            clientSecret,
                            basicToken,
                        });
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
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({ json: { error: error.message } });
                            continue;
                        }
                        throw error;
                    }
                }
            }
            return [returnData];
        }
        let accessToken;
        let baseUrl;
        if (authMode === 'credentials') {
            const credentials = await this.getCredentials('hotmartApi');
            accessToken = await (0, GenericFunctions_1.getAccessToken)({
                environment: credentials.environment,
                clientId: credentials.clientId,
                clientSecret: credentials.clientSecret,
                basicToken: credentials.basicToken,
            });
            baseUrl = (0, GenericFunctions_1.getBaseUrl)(credentials.environment);
        }
        else {
            accessToken = this.getNodeParameter('accessToken', 0);
            const environment = this.getNodeParameter('environment', 0);
            baseUrl = (0, GenericFunctions_1.getBaseUrl)(environment);
        }
        for (let i = 0; i < items.length; i++) {
            try {
                let itemAccessToken = accessToken;
                let itemBaseUrl = baseUrl;
                if (authMode === 'dynamic') {
                    const itemToken = this.getNodeParameter('accessToken', i, '');
                    if (itemToken) {
                        itemAccessToken = itemToken;
                    }
                    const itemEnv = this.getNodeParameter('environment', i, 'production');
                    itemBaseUrl = (0, GenericFunctions_1.getBaseUrl)(itemEnv);
                }
                let endpoint = '';
                let method = 'GET';
                const qs = {};
                let body = {};
                if (resource === 'sales') {
                    if (operation === 'getAll') {
                        endpoint = '/payments/api/v1/sales/history';
                    }
                    else if (operation === 'getSummary') {
                        endpoint = '/payments/api/v1/sales/summary';
                    }
                    else if (operation === 'getCommissions') {
                        endpoint = '/payments/api/v1/sales/commissions';
                    }
                    else if (operation === 'getPriceDetails') {
                        endpoint = '/payments/api/v1/sales/price/details';
                    }
                    const filters = this.getNodeParameter('filters', i, {});
                    Object.assign(qs, filters);
                    const returnAll = this.getNodeParameter('returnAll', i, false);
                    if (!returnAll) {
                        const limit = this.getNodeParameter('limit', i, 50);
                        qs.max_results = limit;
                    }
                }
                if (resource === 'subscriptions') {
                    if (operation === 'getAll') {
                        endpoint = '/payments/api/v1/subscriptions';
                    }
                    else if (operation === 'getSummary') {
                        endpoint = '/payments/api/v1/subscriptions/summary';
                    }
                    else if (operation === 'getPurchases') {
                        endpoint = '/payments/api/v1/subscriptions/purchases';
                    }
                    else if (operation === 'cancel') {
                        const subscriberCode = this.getNodeParameter('subscriberCode', i);
                        endpoint = `/payments/api/v1/subscriptions/${subscriberCode}/cancel`;
                        method = 'POST';
                        const sendMail = this.getNodeParameter('sendMail', i, true);
                        qs.send_mail = sendMail;
                    }
                    else if (operation === 'reactivate') {
                        const subscriberCode = this.getNodeParameter('subscriberCode', i);
                        endpoint = `/payments/api/v1/subscriptions/${subscriberCode}/reactivate`;
                        method = 'POST';
                    }
                    else if (operation === 'changeBillingDate') {
                        const subscriberCode = this.getNodeParameter('subscriberCode', i);
                        endpoint = `/payments/api/v1/subscriptions/${subscriberCode}/charge-date`;
                        method = 'PATCH';
                        const dueDay = this.getNodeParameter('dueDay', i);
                        body = { due_day: dueDay };
                    }
                    if (['getAll', 'getSummary', 'getPurchases'].includes(operation)) {
                        const filters = this.getNodeParameter('filters', i, {});
                        Object.assign(qs, filters);
                        const returnAll = this.getNodeParameter('returnAll', i, false);
                        if (!returnAll && operation !== 'getSummary') {
                            const limit = this.getNodeParameter('limit', i, 50);
                            qs.max_results = limit;
                        }
                    }
                }
                if (resource === 'products') {
                    if (operation === 'getAll') {
                        endpoint = '/products/api/v1/products';
                        const filters = this.getNodeParameter('filters', i, {});
                        Object.assign(qs, filters);
                        const returnAll = this.getNodeParameter('returnAll', i, false);
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', i, 50);
                            qs.max_results = limit;
                        }
                    }
                }
                if (resource === 'members') {
                    const subdomain = this.getNodeParameter('subdomain', i);
                    if (operation === 'getStudents') {
                        endpoint = `/club/api/v2/${subdomain}/users`;
                    }
                    else if (operation === 'getModules') {
                        endpoint = `/club/api/v2/${subdomain}/modules`;
                    }
                    else if (operation === 'getPages') {
                        const moduleId = this.getNodeParameter('moduleId', i);
                        endpoint = `/club/api/v2/${subdomain}/modules/${moduleId}/pages`;
                    }
                    else if (operation === 'getStudentProgress') {
                        const userId = this.getNodeParameter('userId', i);
                        endpoint = `/club/api/v2/${subdomain}/users/${userId}/progress`;
                    }
                    if (['getStudents', 'getModules', 'getPages'].includes(operation)) {
                        if (operation === 'getStudents') {
                            const filters = this.getNodeParameter('filters', i, {});
                            Object.assign(qs, filters);
                        }
                        const returnAll = this.getNodeParameter('returnAll', i, false);
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', i, 50);
                            qs.max_results = limit;
                        }
                    }
                }
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
                if (response.items && Array.isArray(response.items)) {
                    for (const item of response.items) {
                        returnData.push({ json: item });
                    }
                }
                else {
                    returnData.push({ json: response });
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.Hotmart = Hotmart;
