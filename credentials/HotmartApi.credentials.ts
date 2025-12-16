import type {
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
            description: 'Escolha entre ambiente de Produção ou Sandbox. Credenciais de Sandbox só funcionam no ambiente Sandbox e vice-versa.',
        },
        {
            displayName: 'Client ID',
            name: 'clientId',
            type: 'string',
            default: '',
            required: true,
            description: 'O Client ID das Credenciais de Desenvolvedor da Hotmart. Encontrado em Ferramentas > Credenciais Developers.',
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

    // Nota: O teste de credenciais é feito programaticamente no node
    // usando a função testHotmartCredentials() que obtém um access token
    // Não usamos ICredentialTestRequest porque precisamos do fluxo OAuth
}
