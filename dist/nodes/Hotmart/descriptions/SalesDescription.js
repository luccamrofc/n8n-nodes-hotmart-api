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
            {
                name: 'Participantes de Vendas',
                value: 'getUsers',
                description: 'Obter informações dos participantes das vendas',
                action: 'Listar participantes de vendas',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/payments/api/v1/sales/users',
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
                name: 'Reembolsar Venda',
                value: 'refund',
                description: 'Solicitar reembolso de uma venda',
                action: 'Reembolsar venda',
                routing: {
                    request: {
                        method: 'PUT',
                        url: '=/payments/api/v1/sales/{{$parameter.transactionCode}}/refund',
                    },
                },
            },
        ],
        default: 'getAll',
    },
];
exports.salesFields = [
    {
        displayName: 'Código da Transação',
        name: 'transactionCode',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['sales'],
                operation: ['refund'],
            },
        },
        default: '',
        placeholder: 'HP17715690036014',
        description: 'Código único de referência da transação a ser reembolsada',
    },
    {
        displayName: 'Retornar Todos',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['sales'],
                operation: ['getAll', 'getCommissions', 'getPriceDetails', 'getSummary', 'getUsers'],
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
                operation: ['getAll', 'getCommissions', 'getPriceDetails', 'getSummary', 'getUsers'],
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
                operation: ['getAll', 'getCommissions', 'getPriceDetails', 'getSummary', 'getUsers'],
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
                displayName: 'Nome do Comprador',
                name: 'buyer_name',
                type: 'string',
                default: '',
                description: 'Filtrar por nome da pessoa compradora',
                routing: {
                    send: {
                        type: 'query',
                        property: 'buyer_name',
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
                    { name: 'Expirada', value: 'EXPIRED' },
                    { name: 'Sem Fundos', value: 'NO_FUNDS' },
                    { name: 'Vencida', value: 'OVERDUE' },
                    { name: 'Parcialmente Reembolsada', value: 'PARTIALLY_REFUNDED' },
                    { name: 'Pré-venda', value: 'PRE_ORDER' },
                    { name: 'Boleto Impresso', value: 'PRINTED_BILLET' },
                    { name: 'Processando', value: 'PROCESSING_TRANSACTION' },
                    { name: 'Em Disputa', value: 'PROTESTED' },
                    { name: 'Reembolsada', value: 'REFUNDED' },
                    { name: 'Iniciada', value: 'STARTED' },
                    { name: 'Em Análise', value: 'UNDER_ANALISYS' },
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
                displayName: 'Origem (SRC)',
                name: 'sales_source',
                type: 'string',
                default: '',
                placeholder: 'nomedacampanha',
                description: 'Código SRC utilizado no link da página de pagamento',
                routing: {
                    send: {
                        type: 'query',
                        property: 'sales_source',
                    },
                },
            },
            {
                displayName: 'Nome do Afiliado',
                name: 'affiliate_name',
                type: 'string',
                default: '',
                description: 'Nome da pessoa Afiliada responsável pela venda',
                routing: {
                    send: {
                        type: 'query',
                        property: 'affiliate_name',
                    },
                },
            },
            {
                displayName: 'Tipo de Pagamento',
                name: 'payment_type',
                type: 'options',
                options: [
                    { name: 'Boleto', value: 'BILLET' },
                    { name: 'Cartão de Crédito', value: 'CREDIT_CARD' },
                    { name: 'Débito Direto', value: 'DIRECT_DEBIT' },
                    { name: 'Google Pay', value: 'GOOGLE_PAY' },
                    { name: 'PayPal', value: 'PAYPAL' },
                    { name: 'PayPal Internacional', value: 'PAYPAL_INTERNACIONAL' },
                    { name: 'PicPay', value: 'PICPAY' },
                    { name: 'Pix', value: 'PIX' },
                    { name: 'Samsung Pay', value: 'SAMSUNG_PAY' },
                    { name: 'Transferência Bancária', value: 'DIRECT_BANK_TRANSFER' },
                    { name: 'Wallet', value: 'WALLET' },
                ],
                default: 'CREDIT_CARD',
                description: 'Filtrar por tipo de pagamento',
                routing: {
                    send: {
                        type: 'query',
                        property: 'payment_type',
                    },
                },
            },
            {
                displayName: 'Código da Oferta',
                name: 'offer_code',
                type: 'string',
                default: '',
                description: 'Filtrar por código de oferta do produto',
                routing: {
                    send: {
                        type: 'query',
                        property: 'offer_code',
                    },
                },
            },
            {
                displayName: 'Comissionado Como',
                name: 'commission_as',
                type: 'options',
                options: [
                    { name: 'Produtor', value: 'PRODUCER' },
                    { name: 'Coprodutor', value: 'COPRODUCER' },
                    { name: 'Afiliado', value: 'AFFILIATE' },
                ],
                default: 'PRODUCER',
                description: 'Como o usuário foi comissionado pela venda',
                routing: {
                    send: {
                        type: 'query',
                        property: 'commission_as',
                    },
                },
            },
        ],
    },
];
