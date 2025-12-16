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
        ],
        default: 'getAll',
    },
];

export const productsFields: INodeProperties[] = [
    {
        displayName: 'Retornar Todos',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['products'],
                operation: ['getAll'],
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
                operation: ['getAll'],
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
                displayName: 'Nome do Produto',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Filtrar por nome do produto',
                routing: {
                    send: {
                        type: 'query',
                        property: 'name',
                    },
                },
            },
        ],
    },
];
