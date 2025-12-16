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
                name: 'Alterar Data de Cobrança',
                value: 'changeBillingDate',
                description: 'Alterar data de cobrança da assinatura',
                action: 'Alterar data de cobrança',
                routing: {
                    request: {
                        method: 'PATCH',
                        url: '=/payments/api/v1/subscriptions/{{$parameter.subscriberCode}}/charge-date',
                        body: {
                            due_day: '={{$parameter.dueDay}}',
                        },
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
                operation: ['cancel', 'reactivate', 'changeBillingDate'],
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
            maxValue: 28,
        },
        default: 1,
        description: 'O novo dia de vencimento para cobrança (1-28)',
    },
    {
        displayName: 'Enviar Email',
        name: 'sendMail',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['subscriptions'],
                operation: ['cancel'],
            },
        },
        default: true,
        description: 'Se deve enviar notificação por email ao assinante',
        routing: {
            send: {
                type: 'query',
                property: 'send_mail',
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
                operation: ['getAll', 'getPurchases'],
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
                operation: ['getAll', 'getPurchases'],
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
                operation: ['getAll', 'getPurchases', 'getSummary'],
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
        ],
    },
];
