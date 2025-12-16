import type { INodeProperties } from 'n8n-workflow';

export const eventsOperations: INodeProperties[] = [
    {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['events'],
            },
        },
        options: [
            {
                name: 'Informações do Evento',
                value: 'getInfo',
                description: 'Obter informações de um evento',
                action: 'Obter informações do evento',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/events/api/v1/{{$parameter.eventId}}/info',
                    },
                },
            },
            {
                name: 'Listar Participantes',
                value: 'getParticipants',
                description: 'Obter lista de ingressos e participantes do evento',
                action: 'Listar participantes do evento',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/events/api/v1/{{$parameter.eventId}}/participants',
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
        default: 'getInfo',
    },
];

export const eventsFields: INodeProperties[] = [
    {
        displayName: 'ID do Evento',
        name: 'eventId',
        type: 'number',
        required: true,
        displayOptions: {
            show: {
                resource: ['events'],
            },
        },
        default: 0,
        description: 'ID do produto (produto no formato Ingresso para Eventos)',
    },
    {
        displayName: 'Retornar Todos',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['events'],
                operation: ['getParticipants'],
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
                resource: ['events'],
                operation: ['getParticipants'],
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
                resource: ['events'],
                operation: ['getParticipants'],
            },
        },
        options: [
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
                displayName: 'Email do Participante',
                name: 'participant_email',
                type: 'string',
                default: '',
                description: 'Filtrar por email do participante',
                routing: {
                    send: {
                        type: 'query',
                        property: 'participant_email',
                    },
                },
            },
            {
                displayName: 'Última Atualização',
                name: 'last_update',
                type: 'number',
                default: 0,
                description: 'Data da última atualização (em milissegundos desde 1970-01-01)',
                routing: {
                    send: {
                        type: 'query',
                        property: 'last_update',
                    },
                },
            },
            {
                displayName: 'ID do Lote',
                name: 'id_lot',
                type: 'number',
                default: 0,
                description: 'ID do lote/categoria do ingresso',
                routing: {
                    send: {
                        type: 'query',
                        property: 'id_lot',
                    },
                },
            },
            {
                displayName: 'Status do Ingresso',
                name: 'ticket_status',
                type: 'options',
                options: [
                    { name: 'Vendido', value: 'SOLD' },
                    { name: 'Convite', value: 'INVITE' },
                    { name: 'Convite Cancelado', value: 'INVITE_CANCELED' },
                    { name: 'Reembolsado', value: 'REFUNDED' },
                    { name: 'Chargeback', value: 'CHARGEBACK' },
                    { name: 'Excluído', value: 'EXCLUDED' },
                    { name: 'Disponível', value: 'AVAILABLE' },
                    { name: 'Reservado', value: 'RESERVED' },
                ],
                default: 'SOLD',
                description: 'Filtrar por status do ingresso',
                routing: {
                    send: {
                        type: 'query',
                        property: 'ticket_status',
                    },
                },
            },
            {
                displayName: 'Tipo do Ingresso',
                name: 'ticket_type',
                type: 'options',
                options: [
                    { name: 'Pago', value: 'PAID' },
                    { name: 'Gratuito', value: 'FREE' },
                    { name: 'Todos', value: 'ALL' },
                ],
                default: 'ALL',
                description: 'Filtrar por tipo do ingresso',
                routing: {
                    send: {
                        type: 'query',
                        property: 'ticket_type',
                    },
                },
            },
            {
                displayName: 'Status do Check-in',
                name: 'checkin_status',
                type: 'options',
                options: [
                    { name: 'Pendente', value: 'PENDING' },
                    { name: 'Parcial', value: 'PARTIAL' },
                    { name: 'Concluído', value: 'CONCLUDED' },
                    { name: 'Todos', value: 'ALL' },
                ],
                default: 'ALL',
                description: 'Filtrar por status de preenchimento dos dados',
                routing: {
                    send: {
                        type: 'query',
                        property: 'checkin_status',
                    },
                },
            },
            {
                displayName: 'ID do Ingresso',
                name: 'id_eticket',
                type: 'number',
                default: 0,
                description: 'ID sequencial do ingresso',
                routing: {
                    send: {
                        type: 'query',
                        property: 'id_eticket',
                    },
                },
            },
            {
                displayName: 'QR Code do Ingresso',
                name: 'ticket_qr_code',
                type: 'string',
                default: '',
                description: 'Código único do ingresso (QR Code)',
                routing: {
                    send: {
                        type: 'query',
                        property: 'ticket_qr_code',
                    },
                },
            },
        ],
    },
];
