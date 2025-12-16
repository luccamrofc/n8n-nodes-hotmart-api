import type { INodeProperties } from 'n8n-workflow';

export const subscriptionsOperations: INodeProperties[] = [
    {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['subscriptions'],
            },
        },
        options: [
            {
                name: 'Listar Assinaturas',
                value: 'getAll',
                description: 'Obter todas as assinaturas',
                action: 'Listar todas as assinaturas',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/payments/api/v1/subscriptions',
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
                name: 'Resumo de Assinaturas',
                value: 'getSummary',
                description: 'Obter resumo das assinaturas',
                action: 'Obter resumo das assinaturas',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/payments/api/v1/subscriptions/summary',
                    },
                },
            },
            {
                name: 'Compras de Assinatura',
                value: 'getPurchases',
                description: 'Obter compras de assinatura',
                action: 'Listar compras de assinatura',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/payments/api/v1/subscriptions/purchases',
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
                name: 'Compras do Assinante',
                value: 'getSubscriberPurchases',
                description: 'Obter compras de um assinante específico',
                action: 'Listar compras do assinante',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/payments/api/v1/subscriptions/{{$parameter.subscriberCode}}/purchases',
                    },
                },
            },
            {
                name: 'Cancelar Assinatura',
                value: 'cancel',
                description: 'Cancelar uma assinatura',
                action: 'Cancelar uma assinatura',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/payments/api/v1/subscriptions/{{$parameter.subscriberCode}}/cancel',
                    },
                },
            },
            {
                name: 'Cancelar Lista de Assinaturas',
                value: 'cancelBatch',
                description: 'Cancelar múltiplas assinaturas de uma vez',
                action: 'Cancelar lista de assinaturas',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/payments/api/v1/subscriptions/cancel',
                    },
                },
            },
            {
                name: 'Reativar Assinatura',
                value: 'reactivate',
                description: 'Reativar uma assinatura',
                action: 'Reativar uma assinatura',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/payments/api/v1/subscriptions/{{$parameter.subscriberCode}}/reactivate',
                    },
                },
            },
            {
                name: 'Reativar Lista de Assinaturas',
                value: 'reactivateBatch',
                description: 'Reativar múltiplas assinaturas de uma vez',
                action: 'Reativar lista de assinaturas',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/payments/api/v1/subscriptions/reactivate',
                    },
                },
            },
            {
                name: 'Alterar Data de Cobrança',
                value: 'changeBillingDate',
                description: 'Alterar data de cobrança da assinatura',
                action: 'Alterar data de cobrança',
                routing: {
                    request: {
                        method: 'PATCH',
                        url: '=/payments/api/v1/subscriptions/{{$parameter.subscriberCode}}',
                        body: {
                            due_day: '={{$parameter.dueDay}}',
                        },
                    },
                },
            },
            {
                name: 'Transações de Assinatura',
                value: 'getTransactions',
                description: 'Obter transações detalhadas das assinaturas',
                action: 'Listar transações de assinatura',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/payments/api/v1/subscriptions/transactions',
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

export const subscriptionsFields: INodeProperties[] = [
    // ----------------------------------
    //         Cancelar / Reativar / Alterar Data
    // ----------------------------------
    {
        displayName: 'Código do Assinante',
        name: 'subscriberCode',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['subscriptions'],
                operation: ['cancel', 'reactivate', 'changeBillingDate', 'getSubscriberPurchases'],
            },
        },
        default: '',
        description: 'O código do assinante para operar',
    },
    {
        displayName: 'Dia de Vencimento',
        name: 'dueDay',
        type: 'number',
        required: true,
        displayOptions: {
            show: {
                resource: ['subscriptions'],
                operation: ['changeBillingDate'],
            },
        },
        typeOptions: {
            minValue: 1,
            maxValue: 31,
        },
        default: 1,
        description: 'O novo dia de vencimento para cobrança (1-31)',
    },
    {
        displayName: 'Enviar Email',
        name: 'sendMail',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['subscriptions'],
                operation: ['cancel', 'cancelBatch'],
            },
        },
        default: true,
        description: 'Se deve enviar notificação por email ao assinante',
        routing: {
            send: {
                type: 'body',
                property: 'send_mail',
            },
        },
    },
    {
        displayName: 'Códigos dos Assinantes',
        name: 'subscriberCodes',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['subscriptions'],
                operation: ['cancelBatch', 'reactivateBatch'],
            },
        },
        default: '',
        placeholder: 'ABC123, DEF456, GHI789',
        description: 'Lista de códigos de assinantes separados por vírgula',
        routing: {
            send: {
                type: 'body',
                property: 'subscriber_code',
                value: '={{ $value.split(",").map(s => s.trim()) }}',
            },
        },
    },
    {
        displayName: 'Gerar Nova Cobrança',
        name: 'charge',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['subscriptions'],
                operation: ['reactivate', 'reactivateBatch'],
            },
        },
        default: false,
        description: 'Se deve gerar uma nova cobrança ao reativar a assinatura',
        routing: {
            send: {
                type: 'body',
                property: 'charge',
            },
        },
    },
    // ----------------------------------
    //         Listar
    // ----------------------------------
    {
        displayName: 'Retornar Todos',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['subscriptions'],
                operation: ['getAll', 'getPurchases', 'getSummary', 'getTransactions'],
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
                resource: ['subscriptions'],
                operation: ['getAll', 'getPurchases', 'getSummary', 'getTransactions'],
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
                resource: ['subscriptions'],
                operation: ['getAll', 'getPurchases', 'getSummary', 'getTransactions'],
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
                displayName: 'Plano',
                name: 'plan',
                type: 'string',
                default: '',
                description: 'Filtrar por plano de assinatura',
                routing: {
                    send: {
                        type: 'query',
                        property: 'plan',
                    },
                },
            },
            {
                displayName: 'Código do Assinante',
                name: 'subscriber_code',
                type: 'string',
                default: '',
                description: 'Filtrar por código do assinante',
                routing: {
                    send: {
                        type: 'query',
                        property: 'subscriber_code',
                    },
                },
            },
            {
                displayName: 'Email do Assinante',
                name: 'subscriber_email',
                type: 'string',
                default: '',
                description: 'Filtrar por email do assinante',
                routing: {
                    send: {
                        type: 'query',
                        property: 'subscriber_email',
                    },
                },
            },
            {
                displayName: 'Status',
                name: 'status',
                type: 'options',
                options: [
                    { name: 'Ativa', value: 'ACTIVE' },
                    { name: 'Cancelada pelo Admin', value: 'CANCELLED_BY_ADMIN' },
                    { name: 'Cancelada pelo Cliente', value: 'CANCELLED_BY_CUSTOMER' },
                    { name: 'Cancelada pelo Vendedor', value: 'CANCELLED_BY_SELLER' },
                    { name: 'Atrasada', value: 'DELAYED' },
                    { name: 'Expirada', value: 'EXPIRED' },
                    { name: 'Inativa', value: 'INACTIVE' },
                    { name: 'Vencida', value: 'OVERDUE' },
                    { name: 'Iniciada', value: 'STARTED' },
                    { name: 'Trial', value: 'TRIAL' },
                ],
                default: 'ACTIVE',
                description: 'Filtrar por status da assinatura',
                routing: {
                    send: {
                        type: 'query',
                        property: 'status',
                    },
                },
            },
            {
                displayName: 'Data Inicial',
                name: 'accession_date',
                type: 'dateTime',
                default: '',
                description: 'Filtrar assinaturas a partir desta data',
                routing: {
                    send: {
                        type: 'query',
                        property: 'accession_date',
                        value: '={{new Date($value).getTime()}}',
                    },
                },
            },
            {
                displayName: 'Data Final',
                name: 'end_accession_date',
                type: 'dateTime',
                default: '',
                description: 'Filtrar assinaturas até esta data',
                routing: {
                    send: {
                        type: 'query',
                        property: 'end_accession_date',
                        value: '={{new Date($value).getTime()}}',
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
                displayName: 'ID do Plano',
                name: 'plan_id',
                type: 'number',
                default: 0,
                description: 'Identificador único do plano de assinatura',
                routing: {
                    send: {
                        type: 'query',
                        property: 'plan_id',
                    },
                },
            },
            {
                displayName: 'Período de Teste',
                name: 'trial',
                type: 'boolean',
                default: false,
                description: 'Filtrar assinaturas que têm ou não período de teste',
                routing: {
                    send: {
                        type: 'query',
                        property: 'trial',
                    },
                },
            },
            {
                displayName: 'Data Cancelamento (Início)',
                name: 'cancelation_date',
                type: 'dateTime',
                default: '',
                description: 'Assinaturas canceladas a partir desta data',
                routing: {
                    send: {
                        type: 'query',
                        property: 'cancelation_date',
                        value: '={{new Date($value).getTime()}}',
                    },
                },
            },
            {
                displayName: 'Data Cancelamento (Fim)',
                name: 'end_cancelation_date',
                type: 'dateTime',
                default: '',
                description: 'Assinaturas canceladas até esta data',
                routing: {
                    send: {
                        type: 'query',
                        property: 'end_cancelation_date',
                        value: '={{new Date($value).getTime()}}',
                    },
                },
            },
            {
                displayName: 'Próxima Cobrança (Início)',
                name: 'date_next_charge',
                type: 'dateTime',
                default: '',
                description: 'Assinaturas com próxima cobrança a partir desta data',
                routing: {
                    send: {
                        type: 'query',
                        property: 'date_next_charge',
                        value: '={{new Date($value).getTime()}}',
                    },
                },
            },
            {
                displayName: 'Próxima Cobrança (Fim)',
                name: 'end_date_next_charge',
                type: 'dateTime',
                default: '',
                description: 'Assinaturas com próxima cobrança até esta data',
                routing: {
                    send: {
                        type: 'query',
                        property: 'end_date_next_charge',
                        value: '={{new Date($value).getTime()}}',
                    },
                },
            },
            {
                displayName: 'Nome do Assinante',
                name: 'subscriber_name',
                type: 'string',
                default: '',
                description: 'Filtrar por nome do assinante',
                routing: {
                    send: {
                        type: 'query',
                        property: 'subscriber_name',
                    },
                },
            },
            {
                displayName: 'Tipo de Cobrança',
                name: 'billing_type',
                type: 'options',
                options: [
                    { name: 'Assinatura', value: 'SUBSCRIPTION' },
                    { name: 'Smart Installment', value: 'SMART_INSTALLMENT' },
                    { name: 'Smart Recovery', value: 'SMART_RECOVERY' },
                ],
                default: 'SUBSCRIPTION',
                description: 'Filtrar por tipo de cobrança recorrente',
                routing: {
                    send: {
                        type: 'query',
                        property: 'billing_type',
                    },
                },
            },
            {
                displayName: 'Status da Assinatura',
                name: 'subscription_status',
                type: 'options',
                options: [
                    { name: 'Ativa', value: 'ACTIVE' },
                    { name: 'Atrasada', value: 'DELAYED' },
                    { name: 'Cancelada pelo Admin', value: 'CANCELLED_BY_ADMIN' },
                    { name: 'Cancelada pelo Cliente', value: 'CANCELLED_BY_CUSTOMER' },
                    { name: 'Cancelada pelo Vendedor', value: 'CANCELLED_BY_SELLER' },
                    { name: 'Inativa', value: 'INACTIVE' },
                    { name: 'Iniciada', value: 'STARTED' },
                    { name: 'Vencida', value: 'OVERDUE' },
                ],
                default: 'ACTIVE',
                description: 'Filtrar por status da assinatura',
                routing: {
                    send: {
                        type: 'query',
                        property: 'subscription_status',
                    },
                },
            },
            {
                displayName: 'Status da Recorrência',
                name: 'recurrency_status',
                type: 'options',
                options: [
                    { name: 'Pago', value: 'PAID' },
                    { name: 'Não Pago', value: 'NOT_PAID' },
                    { name: 'Reclamado', value: 'CLAIMED' },
                    { name: 'Reembolsado', value: 'REFUNDED' },
                    { name: 'Chargeback', value: 'CHARGEBACK' },
                ],
                default: 'PAID',
                description: 'Filtrar por status do pagamento da recorrência',
                routing: {
                    send: {
                        type: 'query',
                        property: 'recurrency_status',
                    },
                },
            },
            {
                displayName: 'Status da Compra',
                name: 'purchase_status',
                type: 'string',
                default: '',
                description: 'Filtrar por status da transação de compra',
                routing: {
                    send: {
                        type: 'query',
                        property: 'purchase_status',
                    },
                },
            },
            {
                displayName: 'Data Transação (Início)',
                name: 'transaction_date',
                type: 'dateTime',
                default: '',
                description: 'Transações a partir desta data',
                routing: {
                    send: {
                        type: 'query',
                        property: 'transaction_date',
                        value: '={{new Date($value).getTime()}}',
                    },
                },
            },
            {
                displayName: 'Data Transação (Fim)',
                name: 'end_transaction_date',
                type: 'dateTime',
                default: '',
                description: 'Transações até esta data',
                routing: {
                    send: {
                        type: 'query',
                        property: 'end_transaction_date',
                        value: '={{new Date($value).getTime()}}',
                    },
                },
            },
            {
                displayName: 'Código da Oferta',
                name: 'offer_code',
                type: 'string',
                default: '',
                description: 'Filtrar por código da oferta',
                routing: {
                    send: {
                        type: 'query',
                        property: 'offer_code',
                    },
                },
            },
            {
                displayName: 'Tipo de Pagamento',
                name: 'purchase_payment_type',
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
                        property: 'purchase_payment_type',
                    },
                },
            },
        ],
    },
];
