import type { INodeProperties } from 'n8n-workflow';

export const authOperations: INodeProperties[] = [
    {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['auth'],
            },
        },
        options: [
            {
                name: 'Obter Access Token',
                value: 'getAccessToken',
                description: 'Obter um access token usando suas credenciais OAuth. Use este token nas operações subsequentes do modo SaaS.',
                action: 'Obter access token',
            },
        ],
        default: 'getAccessToken',
    },
];

export const authFields: INodeProperties[] = [
    // ----------------------------------
    //         Obter Access Token
    // ----------------------------------
    {
        displayName: 'Client ID',
        name: 'authClientId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['auth'],
                operation: ['getAccessToken'],
            },
        },
        default: '',
        description: 'O Client ID das suas Credenciais de Desenvolvedor da Hotmart. Encontre em: sua conta Hotmart → Ferramentas → Credenciais Developers.',
    },
    {
        displayName: 'Client Secret',
        name: 'authClientSecret',
        type: 'string',
        typeOptions: {
            password: true,
        },
        required: true,
        displayOptions: {
            show: {
                resource: ['auth'],
                operation: ['getAccessToken'],
            },
        },
        default: '',
        description: 'O Client Secret das suas Credenciais de Desenvolvedor da Hotmart. Mantenha este valor seguro e nunca compartilhe.',
    },
    {
        displayName: 'Token Basic',
        name: 'authBasicToken',
        type: 'string',
        typeOptions: {
            password: true,
        },
        required: true,
        displayOptions: {
            show: {
                resource: ['auth'],
                operation: ['getAccessToken'],
            },
        },
        default: '',
        description: 'O Token Basic para autenticação OAuth. IMPORTANTE: Não inclua o prefixo "Basic " - apenas o token em si. Este é o valor Base64 da string client_id:client_secret.',
    },
    {
        displayName: 'Ambiente',
        name: 'authEnvironment',
        type: 'options',
        required: true,
        displayOptions: {
            show: {
                resource: ['auth'],
                operation: ['getAccessToken'],
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
        description: 'O ambiente da Hotmart. IMPORTANTE: Credenciais de Produção só funcionam em Produção. Credenciais de Sandbox só funcionam em Sandbox.',
    },
];
