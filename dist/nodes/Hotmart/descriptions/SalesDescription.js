"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesFields = exports.salesOperations = void 0;
exports.salesOperations = [
    {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['sales'],
            },
        },
        options: [
            {
                name: 'Listar Vendas',
                value: 'getAll',
                description: 'Obter histórico de vendas',
                action: 'Listar histórico de vendas',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/payments/api/v1/sales/history',
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
                name: 'Resumo de Vendas',
                value: 'getSummary',
                description: 'Obter resumo de vendas',
                action: 'Obter resumo de vendas',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/payments/api/v1/sales/summary',
                    },
                },
            },
            {
                name: 'Listar Comissões',
                value: 'getCommissions',
                description: 'Obter comissões de vendas',
                action: 'Listar comissões de vendas',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/payments/api/v1/sales/commissions',
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
                name: 'Detalhes de Preço',
                value: 'getPriceDetails',
                description: 'Obter detalhes de preço de uma venda',
                action: 'Obter detalhes de preço',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/payments/api/v1/sales/price/details',
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
exports.salesFields = [
    {
        displayName: 'Retornar Todos',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['sales'],
                operation: ['getAll', 'getCommissions', 'getPriceDetails'],
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
                resource: ['sales'],
                operation: ['getAll', 'getCommissions', 'getPriceDetails'],
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
                resource: ['sales'],
                operation: ['getAll', 'getCommissions', 'getPriceDetails', 'getSummary'],
            },
        },
        options: [
            {
                displayName: 'ID do Produto',
                name: 'product_id',
                type: 'number',
                default: 0,
                description: 'Filtrar por ID do produto',
                routing: {
                    send: {
                        type: 'query',
                        property: 'product_id',
                    },
                },
            },
            {
                displayName: 'Email do Comprador',
                name: 'buyer_email',
                type: 'string',
                default: '',
                description: 'Filtrar por email do comprador',
                routing: {
                    send: {
                        type: 'query',
                        property: 'buyer_email',
                    },
                },
            },
            {
                displayName: 'Data Inicial',
                name: 'start_date',
                type: 'dateTime',
                default: '',
                description: 'Filtrar vendas a partir desta data',
                routing: {
                    send: {
                        type: 'query',
                        property: 'start_date',
                        value: '={{new Date($value).getTime()}}',
                    },
                },
            },
            {
                displayName: 'Data Final',
                name: 'end_date',
                type: 'dateTime',
                default: '',
                description: 'Filtrar vendas até esta data',
                routing: {
                    send: {
                        type: 'query',
                        property: 'end_date',
                        value: '={{new Date($value).getTime()}}',
                    },
                },
            },
            {
                displayName: 'Status da Transação',
                name: 'transaction_status',
                type: 'options',
                options: [
                    { name: 'Aprovada', value: 'APPROVED' },
                    { name: 'Bloqueada', value: 'BLOCKED' },
                    { name: 'Cancelada', value: 'CANCELLED' },
                    { name: 'Chargeback', value: 'CHARGEBACK' },
                    { name: 'Completa', value: 'COMPLETE' },
                    { name: 'Atrasada', value: 'DELAYED' },
                    { name: 'Expirada', value: 'EXPIRED' },
                    { name: 'Sem Fundos', value: 'NO_FUNDS' },
                    { name: 'Vencida', value: 'OVERDUE' },
                    { name: 'Parcialmente Reembolsada', value: 'PARTIALLY_REFUNDED' },
                    { name: 'Aguardando Pagamento', value: 'PENDING_PAYMENT' },
                    { name: 'Pré-venda', value: 'PRE_ORDER' },
                    { name: 'Boleto Impresso', value: 'PRINTED_BILLET' },
                    { name: 'Processando', value: 'PROCESSING_TRANSACTION' },
                    { name: 'Em Disputa', value: 'PROTEST' },
                    { name: 'Reembolsada', value: 'REFUNDED' },
                    { name: 'Iniciada', value: 'STARTED' },
                    { name: 'Em Análise', value: 'UNDER_ANALYSIS' },
                    { name: 'Aguardando Pagamento', value: 'WAITING_PAYMENT' },
                ],
                default: 'APPROVED',
                description: 'Filtrar por status da transação',
                routing: {
                    send: {
                        type: 'query',
                        property: 'transaction_status',
                    },
                },
            },
            {
                displayName: 'Código da Transação',
                name: 'transaction',
                type: 'string',
                default: '',
                description: 'Filtrar por código da transação',
                routing: {
                    send: {
                        type: 'query',
                        property: 'transaction',
                    },
                },
            },
            {
                displayName: 'Origem da Venda',
                name: 'sales_source',
                type: 'options',
                options: [
                    { name: 'Produtor', value: 'PRODUCER' },
                    { name: 'Afiliado', value: 'AFFILIATE' },
                ],
                default: 'PRODUCER',
                description: 'Filtrar por origem da venda',
                routing: {
                    send: {
                        type: 'query',
                        property: 'sales_source',
                    },
                },
            },
        ],
    },
];
