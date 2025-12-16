import type {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class HotmartApi implements ICredentialType {
    name = 'hotmartApi';
    displayName = 'Hotmart API';
    documentationUrl = 'https://developers.hotmart.com/docs/pt-BR/';

    properties: INodeProperties[] = [
        {
            displayName: 'Ambiente',
            name: 'environment',
            type: 'options',
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
            description: 'Escolha entre ambiente de Produção ou Sandbox',
        },
        {
            displayName: 'Client ID',
            name: 'clientId',
            type: 'string',
            default: '',
            required: true,
            description: 'O Client ID das Credenciais de Desenvolvedor da Hotmart',
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
            description: 'O Client Secret das Credenciais de Desenvolvedor da Hotmart',
        },
        {
            displayName: 'Token Basic',
            name: 'basicToken',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
            description: 'O Token Basic das Credenciais de Desenvolvedor da Hotmart (usado para autenticação OAuth)',
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
