import type {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class HotmartApi implements ICredentialType {
    name = 'hotmartApi';
    displayName = 'Hotmart API';
    documentationUrl = 'https://developers.hotmart.com/docs/en/';

    properties: INodeProperties[] = [
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

    // OAuth 2.0 Client Credentials flow
    // The token will be obtained dynamically in the node using pre-request logic
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.accessToken}}',
            },
        },
    };

    test: ICredentialTestRequest = {
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
