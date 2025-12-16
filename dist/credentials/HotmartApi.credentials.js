"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotmartApi = void 0;
class HotmartApi {
    constructor() {
        this.name = 'hotmartApi';
        this.displayName = 'Hotmart API';
        this.documentationUrl = 'https://developers.hotmart.com/docs/pt-BR/';
        this.properties = [
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
    }
}
exports.HotmartApi = HotmartApi;
