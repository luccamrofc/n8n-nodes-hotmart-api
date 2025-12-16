"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionsFields = exports.subscriptionsOperations = void 0;
exports.subscriptionsOperations = [
    {
        displayName: 'Operation',
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
                name: 'Get Many',
                value: 'getAll',
                description: 'Get all subscriptions',
                action: 'Get all subscriptions',
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
                name: 'Get Summary',
                value: 'getSummary',
                description: 'Get subscriptions summary',
                action: 'Get subscriptions summary',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/payments/api/v1/subscriptions/summary',
                    },
                },
            },
            {
                name: 'Get Purchases',
                value: 'getPurchases',
                description: 'Get subscription purchases',
                action: 'Get subscription purchases',
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
                name: 'Cancel',
                value: 'cancel',
                description: 'Cancel a subscription',
                action: 'Cancel a subscription',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/payments/api/v1/subscriptions/{{$parameter.subscriberCode}}/cancel',
                    },
                },
            },
            {
                name: 'Reactivate',
                value: 'reactivate',
                description: 'Reactivate a subscription',
                action: 'Reactivate a subscription',
                routing: {
                    request: {
                        method: 'POST',
                        url: '=/payments/api/v1/subscriptions/{{$parameter.subscriberCode}}/reactivate',
                    },
                },
            },
            {
                name: 'Change Billing Date',
                value: 'changeBillingDate',
                description: 'Change subscription billing date',
                action: 'Change subscription billing date',
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
exports.subscriptionsFields = [
    {
        displayName: 'Subscriber Code',
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
        description: 'The subscriber code to operate on',
    },
    {
        displayName: 'Due Day',
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
        description: 'The new due day for billing (1-28)',
    },
    {
        displayName: 'Send Email',
        name: 'sendMail',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['subscriptions'],
                operation: ['cancel'],
            },
        },
        default: true,
        description: 'Whether to send email notification to the subscriber',
        routing: {
            send: {
                type: 'query',
                property: 'send_mail',
            },
        },
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['subscriptions'],
                operation: ['getAll', 'getPurchases'],
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
                resource: ['subscriptions'],
                operation: ['getAll', 'getPurchases', 'getSummary'],
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
                displayName: 'Plan',
                name: 'plan',
                type: 'string',
                default: '',
                description: 'Filter by subscription plan',
                routing: {
                    send: {
                        type: 'query',
                        property: 'plan',
                    },
                },
            },
            {
                displayName: 'Subscriber Code',
                name: 'subscriber_code',
                type: 'string',
                default: '',
                description: 'Filter by subscriber code',
                routing: {
                    send: {
                        type: 'query',
                        property: 'subscriber_code',
                    },
                },
            },
            {
                displayName: 'Subscriber Email',
                name: 'subscriber_email',
                type: 'string',
                default: '',
                description: 'Filter by subscriber email',
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
                    { name: 'Active', value: 'ACTIVE' },
                    { name: 'Cancelled By Admin', value: 'CANCELLED_BY_ADMIN' },
                    { name: 'Cancelled By Customer', value: 'CANCELLED_BY_CUSTOMER' },
                    { name: 'Cancelled By Seller', value: 'CANCELLED_BY_SELLER' },
                    { name: 'Delayed', value: 'DELAYED' },
                    { name: 'Expired', value: 'EXPIRED' },
                    { name: 'Inactive', value: 'INACTIVE' },
                    { name: 'Overdue', value: 'OVERDUE' },
                    { name: 'Started', value: 'STARTED' },
                    { name: 'Trial', value: 'TRIAL' },
                ],
                default: 'ACTIVE',
                description: 'Filter by subscription status',
                routing: {
                    send: {
                        type: 'query',
                        property: 'status',
                    },
                },
            },
            {
                displayName: 'Start Date',
                name: 'accession_date',
                type: 'dateTime',
                default: '',
                description: 'Filter subscriptions from this date',
                routing: {
                    send: {
                        type: 'query',
                        property: 'accession_date',
                        value: '={{new Date($value).getTime()}}',
                    },
                },
            },
            {
                displayName: 'End Date',
                name: 'end_accession_date',
                type: 'dateTime',
                default: '',
                description: 'Filter subscriptions until this date',
                routing: {
                    send: {
                        type: 'query',
                        property: 'end_accession_date',
                        value: '={{new Date($value).getTime()}}',
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
        ],
    },
];
