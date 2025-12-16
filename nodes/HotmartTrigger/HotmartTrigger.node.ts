import type {
    IWebhookFunctions,
    INodeType,
    INodeTypeDescription,
    IWebhookResponseData,
    IDataObject,
    INodeExecutionData,
} from 'n8n-workflow';

// Mapeamento de eventos para índices de saída no modo Flow
const FLOW_EVENT_MAP: Record<string, number> = {
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

// Nomes das saídas para modo Flow (13 saídas)
const FLOW_OUTPUT_NAMES = [
    'Compra Aprovada',
    'Compra Completa',
    'Compra Cancelada',
    'Compra Reembolsada',
    'Chargeback',
    'Boleto Impresso',
    'Compra Atrasada',
    'Compra Expirada',
    'Abandono Carrinho',
    'Disputa Aberta',
    'Cancel. Assinatura',
    'Troca de Plano',
    'Outros',
];

// Nomes das saídas para modo Super Flow (6 saídas)
const SUPER_FLOW_OUTPUT_NAMES = [
    'Compra Única',
    'Nova Assinatura',
    'Renovação',
    'Cancelamento',
    'Problema Pagamento',
    'Outros',
];

/**
 * Obtém o índice de saída para o modo Flow
 */
function getFlowOutputIndex(eventType: string): number {
    return FLOW_EVENT_MAP[eventType] ?? 12; // 12 = Outros
}

/**
 * Obtém o índice de saída para o modo Super Flow
 * Analisa o payload para diferenciar tipos de compra
 */
function getSuperFlowOutputIndex(eventType: string, bodyData: IDataObject): number {
    const data = bodyData.data as IDataObject || {};
    const purchase = data.purchase as IDataObject || {};
    const subscription = data.subscription as IDataObject | undefined;
    const recurrencyNumber = purchase.recurrency_number as number || 0;

    // Compra Aprovada ou Completa - diferenciar tipos
    if (eventType === 'PURCHASE_APPROVED' || eventType === 'PURCHASE_COMPLETE') {
        // Se não tem subscription, é compra única
        if (!subscription) {
            return 0; // Compra Única
        }
        // Se recurrency_number é 1, é nova assinatura
        if (recurrencyNumber === 1) {
            return 1; // Nova Assinatura
        }
        // Se recurrency_number > 1, é renovação
        return 2; // Renovação
    }

    // Cancelamentos
    if (['PURCHASE_CANCELED', 'SUBSCRIPTION_CANCELLATION', 'PURCHASE_REFUNDED'].includes(eventType)) {
        return 3; // Cancelamento
    }

    // Problemas de Pagamento
    if (['PURCHASE_CHARGEBACK', 'PURCHASE_PROTEST', 'PURCHASE_DELAYED', 'PURCHASE_EXPIRED'].includes(eventType)) {
        return 4; // Problema Pagamento
    }

    return 5; // Outros
}

/**
 * Processa os dados do webhook para formato padronizado
 */
function parseWebhookData(bodyData: IDataObject): IDataObject {
    const eventType = bodyData.event as string;

    const webhookData: IDataObject = {
        event: eventType,
        data: bodyData.data || bodyData,
        creation_date: bodyData.creation_date,
        id: bodyData.id,
    };

    // Extrai campos comuns para acesso mais fácil
    if (bodyData.data && typeof bodyData.data === 'object') {
        const data = bodyData.data as IDataObject;

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

/**
 * Cria resposta com múltiplas saídas, ativando apenas a saída especificada
 */
function createMultiOutputResponse(
    totalOutputs: number,
    activeIndex: number,
    webhookData: IDataObject,
    context: IWebhookFunctions
): IWebhookResponseData {
    // Cria array com arrays vazios para todas as saídas
    const workflowData: INodeExecutionData[][] = [];

    for (let i = 0; i < totalOutputs; i++) {
        if (i === activeIndex) {
            workflowData.push(context.helpers.returnJsonArray([webhookData]));
        } else {
            workflowData.push([]);
        }
    }

    return { workflowData };
}

export class HotmartTrigger implements INodeType {
    description: INodeTypeDescription = {
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
                ? ${JSON.stringify(FLOW_OUTPUT_NAMES)}
                : $parameter["webhookMode"] === "superFlow"
                    ? ${JSON.stringify(SUPER_FLOW_OUTPUT_NAMES)}
                    : ["main"]
        }}`,
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
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
        ],
    };

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const bodyData = this.getBodyData() as IDataObject;
        const webhookMode = this.getNodeParameter('webhookMode', 'standard') as string;
        const hottok = this.getNodeParameter('hottok') as string;

        // Valida hottok se configurado
        if (hottok) {
            const requestHottok = bodyData.hottok as string;
            if (requestHottok !== hottok) {
                return {
                    webhookResponse: {
                        status: 401,
                        body: 'Não autorizado: Hottok inválido',
                    },
                };
            }
        }

        const eventType = bodyData.event as string;
        const webhookData = parseWebhookData(bodyData);

        // Modo Padrão - comportamento original
        if (webhookMode === 'standard') {
            const event = this.getNodeParameter('event') as string;

            // Filtra por evento se não for "all"
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

        // Modo Flow - 13 saídas por tipo de evento
        if (webhookMode === 'flow') {
            const outputIndex = getFlowOutputIndex(eventType);
            return createMultiOutputResponse(FLOW_OUTPUT_NAMES.length, outputIndex, webhookData, this);
        }

        // Modo Super Flow - 6 saídas granulares
        if (webhookMode === 'superFlow') {
            const outputIndex = getSuperFlowOutputIndex(eventType, bodyData);
            return createMultiOutputResponse(SUPER_FLOW_OUTPUT_NAMES.length, outputIndex, webhookData, this);
        }

        // Fallback
        return {
            workflowData: [
                this.helpers.returnJsonArray([webhookData]),
            ],
        };
    }
}
