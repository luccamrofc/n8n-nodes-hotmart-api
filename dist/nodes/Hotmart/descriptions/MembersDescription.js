"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.membersFields = exports.membersOperations = void 0;
exports.membersOperations = [
    {
        displayName: 'Operação',
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
                name: 'Listar Alunos',
                value: 'getStudents',
                description: 'Obter lista de alunos da área de membros',
                action: 'Listar alunos da área de membros',
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
                name: 'Listar Módulos',
                value: 'getModules',
                description: 'Obter módulos de uma área de membros',
                action: 'Listar módulos da área de membros',
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
                name: 'Listar Páginas',
                value: 'getPages',
                description: 'Obter páginas de um módulo',
                action: 'Listar páginas de um módulo',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/club/api/v2/{{$parameter.subdomain}}/modules/{{$parameter.moduleId}}/pages',
                    },
                },
            },
            {
                name: 'Progresso do Aluno',
                value: 'getStudentProgress',
                description: 'Obter progresso de um aluno em um produto',
                action: 'Obter progresso do aluno',
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
exports.membersFields = [
    {
        displayName: 'Subdomínio',
        name: 'subdomain',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['members'],
                operation: ['getStudents', 'getModules', 'getPages', 'getStudentProgress'],
            },
        },
        default: '',
        description: 'O subdomínio da sua área de membros (ex: "meuproduto" de meuproduto.club.hotmart.com)',
    },
    {
        displayName: 'ID do Produto',
        name: 'productId',
        type: 'number',
        required: true,
        displayOptions: {
            show: {
                resource: ['members'],
                operation: ['getPages'],
            },
        },
        default: 0,
        description: 'Identificador único (ID) do produto',
        routing: {
            send: {
                type: 'query',
                property: 'product_id',
            },
        },
    },
    {
        displayName: 'ID do Módulo',
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
        description: 'O ID do módulo para obter as páginas',
    },
    {
        displayName: 'ID do Usuário',
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
        description: 'O ID do aluno/usuário',
    },
    {
        displayName: 'Retornar Todos',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['members'],
                operation: ['getStudents', 'getModules', 'getPages'],
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
                resource: ['members'],
                operation: ['getStudents', 'getModules'],
            },
        },
        options: [
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                default: '',
                description: 'Filtrar por email do aluno',
                routing: {
                    send: {
                        type: 'query',
                        property: 'email',
                    },
                },
            },
            {
                displayName: 'Nome',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Filtrar por nome do aluno',
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
                    { name: 'Ativo', value: 'ACTIVE' },
                    { name: 'Inativo', value: 'INACTIVE' },
                ],
                default: 'ACTIVE',
                description: 'Filtrar por status do aluno',
                routing: {
                    send: {
                        type: 'query',
                        property: 'status',
                    },
                },
            },
            {
                displayName: 'Módulos Extras',
                name: 'is_extra',
                type: 'boolean',
                default: false,
                description: 'Se verdadeiro, retorna apenas os módulos extras. Se falso, retorna apenas os módulos principais.',
                routing: {
                    send: {
                        type: 'query',
                        property: 'is_extra',
                    },
                },
            },
        ],
    },
];
