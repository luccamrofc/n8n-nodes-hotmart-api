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
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const credentials = await this.getCredentials('hotmartApi');
        const accessToken = await (0, GenericFunctions_1.getAccessToken)({
            environment: credentials.environment,
            clientId: credentials.clientId,
            clientSecret: credentials.clientSecret,
            basicToken: credentials.basicToken,
        });
        const baseUrl = (0, GenericFunctions_1.getBaseUrl)(credentials.environment);
        for (let i = 0; i < items.length; i++) {
            try {
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
