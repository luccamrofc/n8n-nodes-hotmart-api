import type { INodeProperties } from 'n8n-workflow';

export const productsOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
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
                name: 'Get Many',
                value: 'getAll',
                description: 'Get all products',
                action: 'Get all products',
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
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['products'],
                operation: ['getAll'],
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
                resource: ['products'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Product ID',
                name: 'id',
                type: 'number',
                default: 0,
                description: 'Filter by specific product ID',
                routing: {
                    send: {
                        type: 'query',
                        property: 'id',
                    },
                },
            },
            {
                displayName: 'Product Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Filter by product name',
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
