"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotmartApi = void 0;
class HotmartApi {
    constructor() {
        this.name = 'hotmartApi';
        this.displayName = 'Hotmart API';
        this.documentationUrl = 'https://developers.hotmart.com/docs/en/';
        this.properties = [
            {
                displayName: 'Environment',
                name: 'environment',
                type: 'options',
                options: [
                    {
                        name: 'Production',
                        value: 'production',
                    },
                    {
                        name: 'Sandbox',
                        value: 'sandbox',
                    },
                ],
                default: 'production',
                description: 'Choose between Production or Sandbox environment',
            },
            {
                displayName: 'Client ID',
                name: 'clientId',
                type: 'string',
                default: '',
                required: true,
                description: 'The Client ID from Hotmart Developer Credentials',
            },
            {
                displayName: 'Client Secret',
                name: 'clientSecret',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'The Client Secret from Hotmart Developer Credentials',
            },
            {
                displayName: 'Basic Token',
                name: 'basicToken',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'The Basic Token from Hotmart Developer Credentials (used for OAuth authentication)',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.accessToken}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.environment === "sandbox" ? "https://sandbox.hotmart.com" : "https://api-hot-connect.hotmart.com"}}',
                url: '/products/api/v1/products',
                method: 'GET',
                qs: {
                    max_results: 1,
                },
            },
        };
    }
}
exports.HotmartApi = HotmartApi;
