"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesFields = exports.salesOperations = void 0;
exports.salesOperations = [
    {
        displayName: 'Operation',
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
                name: 'Get Many',
                value: 'getAll',
                description: 'Get sales history',
                action: 'Get sales history',
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
                name: 'Get Summary',
                value: 'getSummary',
                description: 'Get sales summary',
                action: 'Get sales summary',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/payments/api/v1/sales/summary',
                    },
                },
            },
            {
                name: 'Get Commissions',
                value: 'getCommissions',
                description: 'Get sales commissions',
                action: 'Get sales commissions',
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
                name: 'Get Price Details',
                value: 'getPriceDetails',
                description: 'Get price details of a sale',
                action: 'Get price details of a sale',
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
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['sales'],
                operation: ['getAll', 'getCommissions', 'getPriceDetails'],
            },
        },
        default: false,
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
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
        description: 'Max number of results to return',
        routing: {
            send: {
                type: 'query',
                property: 'max_results',
            },
        },
    },
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
            show: {
                resource: ['sales'],
                operation: ['getAll', 'getCommissions', 'getPriceDetails', 'getSummary'],
            },
        },
        options: [
            {
                displayName: 'Product ID',
                name: 'product_id',
                type: 'number',
                default: 0,
                description: 'Filter by product ID',
                routing: {
                    send: {
                        type: 'query',
                        property: 'product_id',
                    },
                },
            },
            {
                displayName: 'Buyer Email',
                name: 'buyer_email',
                type: 'string',
                default: '',
                description: 'Filter by buyer email',
                routing: {
                    send: {
                        type: 'query',
                        property: 'buyer_email',
                    },
                },
            },
            {
                displayName: 'Start Date',
                name: 'start_date',
                type: 'dateTime',
                default: '',
                description: 'Filter sales from this date (timestamp in milliseconds)',
                routing: {
                    send: {
                        type: 'query',
                        property: 'start_date',
                        value: '={{new Date($value).getTime()}}',
                    },
                },
            },
            {
                displayName: 'End Date',
                name: 'end_date',
                type: 'dateTime',
                default: '',
                description: 'Filter sales until this date (timestamp in milliseconds)',
                routing: {
                    send: {
                        type: 'query',
                        property: 'end_date',
                        value: '={{new Date($value).getTime()}}',
                    },
                },
            },
            {
                displayName: 'Transaction Status',
                name: 'transaction_status',
                type: 'options',
                options: [
                    { name: 'Approved', value: 'APPROVED' },
                    { name: 'Blocked', value: 'BLOCKED' },
                    { name: 'Cancelled', value: 'CANCELLED' },
                    { name: 'Chargeback', value: 'CHARGEBACK' },
                    { name: 'Complete', value: 'COMPLETE' },
                    { name: 'Delayed', value: 'DELAYED' },
                    { name: 'Expired', value: 'EXPIRED' },
                    { name: 'No Funds', value: 'NO_FUNDS' },
                    { name: 'Overdue', value: 'OVERDUE' },
                    { name: 'Partially Refunded', value: 'PARTIALLY_REFUNDED' },
                    { name: 'Pending Payment', value: 'PENDING_PAYMENT' },
                    { name: 'Pre Order', value: 'PRE_ORDER' },
                    { name: 'Printed Billet', value: 'PRINTED_BILLET' },
                    { name: 'Processing Transaction', value: 'PROCESSING_TRANSACTION' },
                    { name: 'Protest', value: 'PROTEST' },
                    { name: 'Refunded', value: 'REFUNDED' },
                    { name: 'Started', value: 'STARTED' },
                    { name: 'Under Analysis', value: 'UNDER_ANALYSIS' },
                    { name: 'Waiting Payment', value: 'WAITING_PAYMENT' },
                ],
                default: 'APPROVED',
                description: 'Filter by transaction status',
                routing: {
                    send: {
                        type: 'query',
                        property: 'transaction_status',
                    },
                },
            },
            {
                displayName: 'Transaction',
                name: 'transaction',
                type: 'string',
                default: '',
                description: 'Filter by transaction code',
                routing: {
                    send: {
                        type: 'query',
                        property: 'transaction',
                    },
                },
            },
            {
                displayName: 'Sales Source',
                name: 'sales_source',
                type: 'options',
                options: [
                    { name: 'Producer', value: 'PRODUCER' },
                    { name: 'Affiliate', value: 'AFFILIATE' },
                ],
                default: 'PRODUCER',
                description: 'Filter by sales source',
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
