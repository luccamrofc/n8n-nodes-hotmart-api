import type { INodeProperties } from 'n8n-workflow';

export const productsOperations: INodeProperties[] = [
    {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['products'],
            },
        },
        options: [
            {
                name: 'Listar Produtos',
                value: 'getAll',
                description: 'Obter todos os produtos',
                action: 'Listar todos os produtos',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/products/api/v1/products',
                    },
                    output: {
                        postReceive: [
                            {
                                type: 'rootProperty',
                                properties: {
                                    property: 'items',
                                },
                            },
                        ],
                    },
                },
            },
            {
                name: 'Listar Ofertas do Produto',
                value: 'getOffers',
                description: 'Obter ofertas de um produto',
                action: 'Listar ofertas do produto',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/products/api/v1/products/{{$parameter.productUcode}}/offers',
                    },
                    output: {
                        postReceive: [
                            {
                                type: 'rootProperty',
                                properties: {
                                    property: 'items',
                                },
                            },
                        ],
                    },
                },
            },
            {
                name: 'Listar Planos do Produto',
                value: 'getPlans',
                description: 'Obter planos de assinatura de um produto',
                action: 'Listar planos do produto',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/products/api/v1/products/{{$parameter.productUcode}}/plans',
                    },
                    output: {
                        postReceive: [
                            {
                                type: 'rootProperty',
                                properties: {
                                    property: 'items',
                                },
                            },
                        ],
                    },
                },
            },
        ],
        default: 'getAll',
    },
];

export const productsFields: INodeProperties[] = [
    {
        displayName: 'UUID do Produto',
        name: 'productUcode',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['products'],
                operation: ['getOffers', 'getPlans'],
            },
        },
        default: '',
        placeholder: 'ab907e46-a9aa-4d25-ae4f-cec316d01560',
        description: 'Identificador único (UUID) do produto',
    },
    {
        displayName: 'Retornar Todos',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['products'],
                operation: ['getAll', 'getOffers', 'getPlans'],
            },
        },
        default: false,
        description: 'Se deve retornar todos os resultados ou apenas até um limite',
    },
    {
        displayName: 'Limite',
        name: 'limit',
        type: 'number',
        displayOptions: {
            show: {
                resource: ['products'],
                operation: ['getAll', 'getOffers', 'getPlans'],
                returnAll: [false],
            },
        },
        typeOptions: {
            minValue: 1,
            maxValue: 500,
        },
        default: 50,
        description: 'Número máximo de resultados para retornar',
        routing: {
            send: {
                type: 'query',
                property: 'max_results',
            },
        },
    },
    {
        displayName: 'Filtros',
        name: 'filters',
        type: 'collection',
        placeholder: 'Adicionar Filtro',
        default: {},
        displayOptions: {
            show: {
                resource: ['products'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'ID do Produto',
                name: 'id',
                type: 'number',
                default: 0,
                description: 'Filtrar por ID específico do produto',
                routing: {
                    send: {
                        type: 'query',
                        property: 'id',
                    },
                },
            },
            {
                displayName: 'Status',
                name: 'status',
                type: 'options',
                options: [
                    { name: 'Rascunho', value: 'DRAFT' },
                    { name: 'Ativo', value: 'ACTIVE' },
                    { name: 'Pausado', value: 'PAUSED' },
                    { name: 'Não Aprovado', value: 'NOT_APPROVED' },
                    { name: 'Em Revisão', value: 'IN_REVIEW' },
                    { name: 'Deletado', value: 'DELETED' },
                    { name: 'Alterações Pendentes', value: 'CHANGES_PENDING_ON_PRODUCT' },
                ],
                default: 'ACTIVE',
                description: 'Filtrar por status do produto',
                routing: {
                    send: {
                        type: 'query',
                        property: 'status',
                    },
                },
            },
            {
                displayName: 'Formato',
                name: 'format',
                type: 'options',
                options: [
                    { name: 'Agente', value: 'AGENT' },
                    { name: 'Áudios', value: 'AUDIOS' },
                    { name: 'Bundle', value: 'BUNDLE' },
                    { name: 'Códigos Seriais', value: 'SERIAL_CODES' },
                    { name: 'Comunidade', value: 'COMMUNITY' },
                    { name: 'Curso Online', value: 'ONLINE_COURSE' },
                    { name: 'E-book', value: 'EBOOK' },
                    { name: 'E-ticket', value: 'ETICKET' },
                    { name: 'Evento Online', value: 'ONLINE_EVENT' },
                    { name: 'Imagens', value: 'IMAGES' },
                    { name: 'Mobile Apps', value: 'MOBILE_APPS' },
                    { name: 'Serviço Online', value: 'ONLINE_SERVICE' },
                    { name: 'Software', value: 'SOFTWARE' },
                    { name: 'Templates', value: 'TEMPLATES' },
                    { name: 'Vídeos', value: 'VIDEOS' },
                ],
                default: 'ONLINE_COURSE',
                description: 'Filtrar por formato do produto',
                routing: {
                    send: {
                        type: 'query',
                        property: 'format',
                    },
                },
            },
        ],
    },
];
