"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotmartTrigger = void 0;
const FLOW_EVENT_MAP = {
    'PURCHASE_APPROVED': 0,
    'PURCHASE_COMPLETE': 1,
    'PURCHASE_CANCELED': 2,
    'PURCHASE_REFUNDED': 3,
    'PURCHASE_CHARGEBACK': 4,
    'PURCHASE_BILLET_PRINTED': 5,
    'PURCHASE_DELAYED': 6,
    'PURCHASE_EXPIRED': 7,
    'PURCHASE_OUT_OF_SHOPPING_CART': 8,
    'PURCHASE_PROTEST': 9,
    'SUBSCRIPTION_CANCELLATION': 10,
    'SWITCH_PLAN': 11,
};
const FLOW_OUTPUT_NAMES = [
    { type: 'main', displayName: 'Compra Aprovada' },
    { type: 'main', displayName: 'Compra Completa' },
    { type: 'main', displayName: 'Compra Cancelada' },
    { type: 'main', displayName: 'Compra Reembolsada' },
    { type: 'main', displayName: 'Chargeback' },
    { type: 'main', displayName: 'Boleto Impresso' },
    { type: 'main', displayName: 'Compra Atrasada' },
    { type: 'main', displayName: 'Compra Expirada' },
    { type: 'main', displayName: 'Abandono Carrinho' },
    { type: 'main', displayName: 'Disputa Aberta' },
    { type: 'main', displayName: 'Cancel. Assinatura' },
    { type: 'main', displayName: 'Troca de Plano' },
    { type: 'main', displayName: 'Outros' },
];
const SUPER_FLOW_OUTPUT_NAMES = [
    { type: 'main', displayName: 'Compra Única' },
    { type: 'main', displayName: 'Nova Assinatura' },
    { type: 'main', displayName: 'Renovação' },
    { type: 'main', displayName: 'Cancelamento' },
    { type: 'main', displayName: 'Problema Pagamento' },
    { type: 'main', displayName: 'Outros' },
];
function getFlowOutputIndex(eventType) {
    var _a;
    return (_a = FLOW_EVENT_MAP[eventType]) !== null && _a !== void 0 ? _a : 12;
}
function getSuperFlowOutputIndex(eventType, bodyData) {
    const data = bodyData.data || {};
    const purchase = data.purchase || {};
    const subscription = data.subscription;
    const recurrencyNumber = purchase.recurrency_number || 0;
    if (eventType === 'PURCHASE_APPROVED' || eventType === 'PURCHASE_COMPLETE') {
        if (!subscription) {
            return 0;
        }
        if (recurrencyNumber === 1) {
            return 1;
        }
        return 2;
    }
    if (['PURCHASE_CANCELED', 'SUBSCRIPTION_CANCELLATION', 'PURCHASE_REFUNDED'].includes(eventType)) {
        return 3;
    }
    if (['PURCHASE_CHARGEBACK', 'PURCHASE_PROTEST', 'PURCHASE_DELAYED', 'PURCHASE_EXPIRED'].includes(eventType)) {
        return 4;
    }
    return 5;
}
function parseWebhookData(bodyData) {
    const eventType = bodyData.event;
    const webhookData = {
        event: eventType,
        data: bodyData.data || bodyData,
        creation_date: bodyData.creation_date,
        id: bodyData.id,
    };
    if (bodyData.data && typeof bodyData.data === 'object') {
        const data = bodyData.data;
        if (data.buyer) {
            webhookData.buyer = data.buyer;
        }
        if (data.product) {
            webhookData.product = data.product;
        }
        if (data.purchase) {
            webhookData.purchase = data.purchase;
        }
        if (data.subscription) {
            webhookData.subscription = data.subscription;
        }
        if (data.producer) {
            webhookData.producer = data.producer;
        }
        if (data.affiliate) {
            webhookData.affiliate = data.affiliate;
        }
        if (data.subscriber) {
            webhookData.subscriber = data.subscriber;
        }
        if (data.plans) {
            webhookData.plans = data.plans;
        }
        if (data.offer) {
            webhookData.offer = data.offer;
        }
        if (data.checkout_country) {
            webhookData.checkout_country = data.checkout_country;
        }
        if (data.affiliates) {
            webhookData.affiliates = data.affiliates;
        }
        if (data.commissions) {
            webhookData.commissions = data.commissions;
        }
        if (data.plan) {
            webhookData.plan = data.plan;
        }
        if (data.user) {
            webhookData.user = data.user;
        }
        if (data.module) {
            webhookData.module = data.module;
        }
    }
    return webhookData;
}
function createMultiOutputResponse(totalOutputs, activeIndex, webhookData, context) {
    const workflowData = [];
    for (let i = 0; i < totalOutputs; i++) {
        if (i === activeIndex) {
            workflowData.push(context.helpers.returnJsonArray([webhookData]));
        }
        else {
            workflowData.push([]);
        }
    }
    return { workflowData };
}
class HotmartTrigger {
    constructor() {
        this.description = {
            displayName: 'Hotmart Trigger',
            name: 'hotmartTrigger',
            icon: 'file:hotmart.png',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["webhookMode"] === "flow" ? "Flow: " + "13 saídas" : $parameter["webhookMode"] === "superFlow" ? "Super Flow: 6 saídas" : $parameter["event"]}}',
            description: 'Inicia o workflow quando um evento webhook da Hotmart ocorre',
            defaults: {
                name: 'Hotmart Trigger',
            },
            inputs: [],
            outputs: `={{
            $parameter["webhookMode"] === "flow" 
                ? [
                    { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_flow_approved"] : "Compra Aprovada" },
                    { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_flow_complete"] : "Compra Completa" },
                    { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_flow_canceled"] : "Compra Cancelada" },
                    { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_flow_refunded"] : "Compra Reembolsada" },
                    { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_flow_chargeback"] : "Chargeback" },
                    { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_flow_billet"] : "Boleto Impresso" },
                    { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_flow_delayed"] : "Compra Atrasada" },
                    { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_flow_expired"] : "Compra Expirada" },
                    { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_flow_abandoned"] : "Abandono Carrinho" },
                    { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_flow_dispute"] : "Disputa Aberta" },
                    { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_flow_sub_cancel"] : "Cancel. Assinatura" },
                    { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_flow_plan_switch"] : "Troca de Plano" },
                    { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_flow_other"] : "Outros" },
                ]
                : $parameter["webhookMode"] === "superFlow"
                    ? [
                        { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_super_single"] : "Compra Única" },
                        { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_super_new_sub"] : "Nova Assinatura" },
                        { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_super_renewal"] : "Renovação" },
                        { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_super_cancellation"] : "Cancelamento" },
                        { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_super_payment"] : "Problema Pagamento" },
                        { type: 'main', displayName: $parameter["customizeOutputs"] ? $parameter["output_super_other"] : "Outros" },
                    ]
                    : ["main"]
        }}`,
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: '={{ $parameter["path"] ? $parameter["path"] : "webhook" }}',
                },
            ],
            properties: [
                {
                    displayName: 'Modo do Webhook',
                    name: 'webhookMode',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Padrão',
                            value: 'standard',
                            description: 'Uma única saída para todos os eventos',
                        },
                        {
                            name: 'Flow',
                            value: 'flow',
                            description: 'Saídas separadas por tipo de evento (13 saídas)',
                        },
                        {
                            name: 'Super Flow',
                            value: 'superFlow',
                            description: 'Saídas granulares por contexto (6 saídas: Compra Única, Nova Assinatura, Renovação, etc.)',
                        },
                    ],
                    default: 'standard',
                    description: 'Define como os eventos são roteados para as saídas do workflow',
                },
                {
                    displayName: 'Evento',
                    name: 'event',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            webhookMode: ['standard'],
                        },
                    },
                    options: [
                        {
                            name: 'Todos os Eventos',
                            value: 'all',
                            description: 'Disparar em qualquer evento webhook da Hotmart',
                        },
                        {
                            name: 'Compra Aprovada',
                            value: 'PURCHASE_APPROVED',
                            description: 'Disparar quando uma compra é aprovada',
                        },
                        {
                            name: 'Boleto Impresso',
                            value: 'PURCHASE_BILLET_PRINTED',
                            description: 'Disparar quando um boleto é impresso',
                        },
                        {
                            name: 'Compra Cancelada',
                            value: 'PURCHASE_CANCELED',
                            description: 'Disparar quando uma compra é cancelada',
                        },
                        {
                            name: 'Chargeback',
                            value: 'PURCHASE_CHARGEBACK',
                            description: 'Disparar quando ocorre um chargeback',
                        },
                        {
                            name: 'Compra Completa',
                            value: 'PURCHASE_COMPLETE',
                            description: 'Disparar quando uma compra é completada',
                        },
                        {
                            name: 'Compra Atrasada',
                            value: 'PURCHASE_DELAYED',
                            description: 'Disparar quando uma compra está atrasada',
                        },
                        {
                            name: 'Compra Expirada',
                            value: 'PURCHASE_EXPIRED',
                            description: 'Disparar quando uma compra expira',
                        },
                        {
                            name: 'Abandono de Carrinho',
                            value: 'PURCHASE_OUT_OF_SHOPPING_CART',
                            description: 'Disparar quando há abandono de carrinho',
                        },
                        {
                            name: 'Disputa Aberta',
                            value: 'PURCHASE_PROTEST',
                            description: 'Disparar quando uma disputa é aberta',
                        },
                        {
                            name: 'Compra Reembolsada',
                            value: 'PURCHASE_REFUNDED',
                            description: 'Disparar quando uma compra é reembolsada',
                        },
                        {
                            name: 'Cancelamento de Assinatura',
                            value: 'SUBSCRIPTION_CANCELLATION',
                            description: 'Disparar quando uma assinatura é cancelada',
                        },
                        {
                            name: 'Troca de Plano',
                            value: 'SWITCH_PLAN',
                            description: 'Disparar quando um plano de assinatura muda',
                        },
                        {
                            name: 'Troca de Dia de Cobrança',
                            value: 'UPDATE_SUBSCRIPTION_CHARGE_DATE',
                            description: 'Disparar quando o dia de cobrança da assinatura é alterado',
                        },
                        {
                            name: 'Primeiro Acesso (Club)',
                            value: 'CLUB_FIRST_ACCESS',
                            description: 'Disparar quando um aluno acessa o curso pela primeira vez',
                        },
                        {
                            name: 'Módulo Completo (Club)',
                            value: 'CLUB_MODULE_COMPLETED',
                            description: 'Disparar quando um aluno completa um módulo do curso',
                        },
                    ],
                    default: 'all',
                    description: 'O evento para escutar',
                },
                {
                    displayName: 'Hottok (Segredo)',
                    name: 'hottok',
                    type: 'string',
                    typeOptions: {
                        password: true,
                    },
                    default: '',
                    description: 'Opcional: O segredo Hottok das configurações de webhook da Hotmart. Se configurado, requisições sem um hottok válido serão rejeitadas.',
                },
                {
                    displayName: 'Path Customizado',
                    name: 'path',
                    type: 'string',
                    default: 'webhook',
                    placeholder: 'webhook',
                    description: 'O caminho da URL do webhook. Padrão é "webhook".',
                },
                {
                    displayName: 'Personalizar Nomes das Saídas',
                    name: 'customizeOutputs',
                    type: 'boolean',
                    default: false,
                    description: 'Ative para renomear as saídas dos modos Flow e Super Flow',
                },
                {
                    displayName: 'Nome alternativo para: Compra Única',
                    name: 'output_super_single',
                    type: 'string',
                    default: 'Compra Única',
                    displayOptions: {
                        show: {
                            webhookMode: ['superFlow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Nova Assinatura',
                    name: 'output_super_new_sub',
                    type: 'string',
                    default: 'Nova Assinatura',
                    displayOptions: {
                        show: {
                            webhookMode: ['superFlow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Renovação',
                    name: 'output_super_renewal',
                    type: 'string',
                    default: 'Renovação',
                    displayOptions: {
                        show: {
                            webhookMode: ['superFlow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Cancelamento',
                    name: 'output_super_cancellation',
                    type: 'string',
                    default: 'Cancelamento',
                    displayOptions: {
                        show: {
                            webhookMode: ['superFlow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Problema Pagamento',
                    name: 'output_super_payment',
                    type: 'string',
                    default: 'Problema Pagamento',
                    displayOptions: {
                        show: {
                            webhookMode: ['superFlow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Outros',
                    name: 'output_super_other',
                    type: 'string',
                    default: 'Outros',
                    displayOptions: {
                        show: {
                            webhookMode: ['superFlow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Compra Aprovada',
                    name: 'output_flow_approved',
                    type: 'string',
                    default: 'Compra Aprovada',
                    displayOptions: {
                        show: {
                            webhookMode: ['flow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Compra Completa',
                    name: 'output_flow_complete',
                    type: 'string',
                    default: 'Compra Completa',
                    displayOptions: {
                        show: {
                            webhookMode: ['flow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Compra Cancelada',
                    name: 'output_flow_canceled',
                    type: 'string',
                    default: 'Compra Cancelada',
                    displayOptions: {
                        show: {
                            webhookMode: ['flow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Compra Reembolsada',
                    name: 'output_flow_refunded',
                    type: 'string',
                    default: 'Compra Reembolsada',
                    displayOptions: {
                        show: {
                            webhookMode: ['flow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Chargeback',
                    name: 'output_flow_chargeback',
                    type: 'string',
                    default: 'Chargeback',
                    displayOptions: {
                        show: {
                            webhookMode: ['flow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Boleto Impresso',
                    name: 'output_flow_billet',
                    type: 'string',
                    default: 'Boleto Impresso',
                    displayOptions: {
                        show: {
                            webhookMode: ['flow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Compra Atrasada',
                    name: 'output_flow_delayed',
                    type: 'string',
                    default: 'Compra Atrasada',
                    displayOptions: {
                        show: {
                            webhookMode: ['flow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Compra Expirada',
                    name: 'output_flow_expired',
                    type: 'string',
                    default: 'Compra Expirada',
                    displayOptions: {
                        show: {
                            webhookMode: ['flow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Abandono Carrinho',
                    name: 'output_flow_abandoned',
                    type: 'string',
                    default: 'Abandono Carrinho',
                    displayOptions: {
                        show: {
                            webhookMode: ['flow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Disputa Aberta',
                    name: 'output_flow_dispute',
                    type: 'string',
                    default: 'Disputa Aberta',
                    displayOptions: {
                        show: {
                            webhookMode: ['flow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Cancel. Assinatura',
                    name: 'output_flow_sub_cancel',
                    type: 'string',
                    default: 'Cancel. Assinatura',
                    displayOptions: {
                        show: {
                            webhookMode: ['flow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Troca de Plano',
                    name: 'output_flow_plan_switch',
                    type: 'string',
                    default: 'Troca de Plano',
                    displayOptions: {
                        show: {
                            webhookMode: ['flow'],
                            customizeOutputs: [true],
                        },
                    },
                },
                {
                    displayName: 'Nome alternativo para: Outros',
                    name: 'output_flow_other',
                    type: 'string',
                    default: 'Outros',
                    displayOptions: {
                        show: {
                            webhookMode: ['flow'],
                            customizeOutputs: [true],
                        },
                    },
                },
            ],
        };
    }
    async webhook() {
        const bodyData = this.getBodyData();
        const webhookMode = this.getNodeParameter('webhookMode', 'standard');
        const hottok = this.getNodeParameter('hottok');
        if (hottok) {
            const requestHottok = bodyData.hottok;
            if (requestHottok !== hottok) {
                return {
                    webhookResponse: {
                        status: 401,
                        body: 'Não autorizado: Hottok inválido',
                    },
                };
            }
        }
        const eventType = bodyData.event;
        const webhookData = parseWebhookData(bodyData);
        if (webhookMode === 'standard') {
            const event = this.getNodeParameter('event');
            if (event !== 'all' && eventType !== event) {
                return {
                    webhookResponse: {
                        status: 200,
                        body: 'Evento ignorado',
                    },
                };
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray([webhookData]),
                ],
            };
        }
        if (webhookMode === 'flow') {
            const outputIndex = getFlowOutputIndex(eventType);
            return createMultiOutputResponse(FLOW_OUTPUT_NAMES.length, outputIndex, webhookData, this);
        }
        if (webhookMode === 'superFlow') {
            const outputIndex = getSuperFlowOutputIndex(eventType, bodyData);
            return createMultiOutputResponse(SUPER_FLOW_OUTPUT_NAMES.length, outputIndex, webhookData, this);
        }
        return {
            workflowData: [
                this.helpers.returnJsonArray([webhookData]),
            ],
        };
    }
}
exports.HotmartTrigger = HotmartTrigger;
