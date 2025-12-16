import type { INodeProperties } from 'n8n-workflow';

export const membersOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['members'],
            },
        },
        options: [
            {
                name: 'Get Students',
                value: 'getStudents',
                description: 'Get students list from member area',
                action: 'Get students from member area',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/club/api/v2/{{$parameter.subdomain}}/users',
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
                name: 'Get Modules',
                value: 'getModules',
                description: 'Get modules from a member area',
                action: 'Get modules from member area',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/club/api/v2/{{$parameter.subdomain}}/modules',
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
                name: 'Get Pages',
                value: 'getPages',
                description: 'Get pages from a module',
                action: 'Get pages from a module',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/club/api/v2/{{$parameter.subdomain}}/modules/{{$parameter.moduleId}}/pages',
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
                name: 'Get Student Progress',
                value: 'getStudentProgress',
                description: "Get a student's progress in a product",
                action: 'Get student progress',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/club/api/v2/{{$parameter.subdomain}}/users/{{$parameter.userId}}/progress',
                    },
                },
            },
        ],
        default: 'getStudents',
    },
];

export const membersFields: INodeProperties[] = [
    // ----------------------------------
    //         Common: Subdomain
    // ----------------------------------
    {
        displayName: 'Subdomain',
        name: 'subdomain',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['members'],
            },
        },
        default: '',
        description: 'The subdomain of your member area (e.g., "myproduct" from myproduct.club.hotmart.com)',
    },
    // ----------------------------------
    //         Get Pages
    // ----------------------------------
    {
        displayName: 'Module ID',
        name: 'moduleId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['members'],
                operation: ['getPages'],
            },
        },
        default: '',
        description: 'The ID of the module to get pages from',
    },
    // ----------------------------------
    //         Get Student Progress
    // ----------------------------------
    {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['members'],
                operation: ['getStudentProgress'],
            },
        },
        default: '',
        description: 'The ID of the student/user',
    },
    // ----------------------------------
    //         Get Students / Modules
    // ----------------------------------
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['members'],
                operation: ['getStudents', 'getModules', 'getPages'],
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
                resource: ['members'],
                operation: ['getStudents', 'getModules', 'getPages'],
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
                resource: ['members'],
                operation: ['getStudents'],
            },
        },
        options: [
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                default: '',
                description: "Filter by student's email",
                routing: {
                    send: {
                        type: 'query',
                        property: 'email',
                    },
                },
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: "Filter by student's name",
                routing: {
                    send: {
                        type: 'query',
                        property: 'name',
                    },
                },
            },
            {
                displayName: 'Status',
                name: 'status',
                type: 'options',
                options: [
                    { name: 'Active', value: 'ACTIVE' },
                    { name: 'Inactive', value: 'INACTIVE' },
                ],
                default: 'ACTIVE',
                description: "Filter by student's status",
                routing: {
                    send: {
                        type: 'query',
                        property: 'status',
                    },
                },
            },
        ],
    },
];
