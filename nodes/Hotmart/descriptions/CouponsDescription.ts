import type { INodeProperties } from 'n8n-workflow';

export const couponsOperations: INodeProperties[] = [
    {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['coupons'],
            },
        },
        options: [
            {
                name: 'Criar Cupom',
                value: 'create',
                description: 'Criar um novo cupom de desconto para um produto',
                action: 'Criar cupom',
            },
            {
                name: 'Listar Cupons',
                value: 'getAll',
                description: 'Obter cupons de um produto específico',
                action: 'Listar cupons',
            },
            {
                name: 'Excluir Cupom',
                value: 'delete',
                description: 'Excluir um cupom específico',
                action: 'Excluir cupom',
            },
        ],
        default: 'getAll',
    },
];

export const couponsFields: INodeProperties[] = [
    {
        displayName: 'ID do Produto',
        name: 'productId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['coupons'],
                operation: ['create', 'getAll'],
            },
        },
        default: '',
        description: 'Identificador único (ID) do produto (número de 7 dígitos)',
    },

    // Criar Cupom
    {
        displayName: 'Código do Cupom',
        name: 'couponCode',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['coupons'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'Código do cupom que o cliente usará no checkout (máximo 25 caracteres)',
    },
    {
        displayName: 'Desconto (%)',
        name: 'discount',
        type: 'number',
        required: true,
        typeOptions: {
            minValue: 1,
            maxValue: 99,
            numberPrecision: 0,
        },
        displayOptions: {
            show: {
                resource: ['coupons'],
                operation: ['create'],
            },
        },
        default: 10,
        description: 'Percentual de desconto (1-99). Exemplo: 10 para 10% de desconto.',
    },
    {
        displayName: 'Opções Adicionais',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Adicionar opção',
        default: {},
        displayOptions: {
            show: {
                resource: ['coupons'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Data de Início',
                name: 'startDate',
                type: 'dateTime',
                default: '',
                description: 'Data e hora em que o cupom será ativado',
            },
            {
                displayName: 'Data de Fim',
                name: 'endDate',
                type: 'dateTime',
                default: '',
                description: 'Data e hora em que o cupom será desativado',
            },
            {
                displayName: 'ID do Afiliado',
                name: 'affiliateId',
                type: 'string',
                default: '',
                description: 'ID específico do afiliado para compartilhar o cupom exclusivamente',
            },
            {
                displayName: 'IDs das Ofertas',
                name: 'offerIds',
                type: 'string',
                default: '',
                description: 'Códigos das ofertas onde aplicar o cupom (separados por vírgula)',
            },
        ],
    },

    // Listar Cupons
    {
        displayName: 'Filtros',
        name: 'filters',
        type: 'collection',
        placeholder: 'Adicionar filtro',
        default: {},
        displayOptions: {
            show: {
                resource: ['coupons'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Código do Cupom',
                name: 'code',
                type: 'string',
                default: '',
                description: 'Filtrar por código de cupom específico',
            },
        ],
    },
    {
        displayName: 'Retornar Todos',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['coupons'],
                operation: ['getAll'],
            },
        },
        default: false,
        description: 'Se ativado, retorna todos os cupons. Caso contrário, retorna até o limite especificado.',
    },
    {
        displayName: 'Limite',
        name: 'limit',
        type: 'number',
        displayOptions: {
            show: {
                resource: ['coupons'],
                operation: ['getAll'],
                returnAll: [false],
            },
        },
        typeOptions: {
            minValue: 1,
            maxValue: 100,
        },
        default: 50,
        description: 'Número máximo de cupons a retornar',
    },

    // Excluir Cupom
    {
        displayName: 'ID do Cupom',
        name: 'couponId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['coupons'],
                operation: ['delete'],
            },
        },
        default: '',
        description: 'Identificador único (ID) do cupom a ser excluído',
    },
];
