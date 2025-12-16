import type {
    IWebhookFunctions,
    INodeType,
    INodeTypeDescription,
    IWebhookResponseData,
    IDataObject,
} from 'n8n-workflow';

export class HotmartTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Hotmart Trigger',
        name: 'hotmartTrigger',
        icon: 'file:hotmart.png',
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["event"]}}',
        description: 'Inicia o workflow quando um evento webhook da Hotmart ocorre',
        defaults: {
            name: 'Hotmart Trigger',
        },
        inputs: [],
        outputs: ['main'],
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
                displayName: 'Evento',
                name: 'event',
                type: 'options',
                noDataExpression: true,
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
        const event = this.getNodeParameter('event') as string;
        const hottok = this.getNodeParameter('hottok') as string;

        // Validate hottok if configured
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

        // Filter by event if not "all"
        const eventType = bodyData.event as string;
        if (event !== 'all' && eventType !== event) {
            return {
                webhookResponse: {
                    status: 200,
                    body: 'Evento ignorado',
                },
            };
        }

        // Parse the webhook data
        const webhookData: IDataObject = {
            event: eventType,
            data: bodyData.data || bodyData,
            creation_date: bodyData.creation_date,
            id: bodyData.id,
        };

        // Extract common fields for easier access
        if (bodyData.data && typeof bodyData.data === 'object') {
            const data = bodyData.data as IDataObject;

            // Buyer information
            if (data.buyer) {
                webhookData.buyer = data.buyer;
            }

            // Product information
            if (data.product) {
                webhookData.product = data.product;
            }

            // Purchase information
            if (data.purchase) {
                webhookData.purchase = data.purchase;
            }

            // Subscription information
            if (data.subscription) {
                webhookData.subscription = data.subscription;
            }

            // Producer information
            if (data.producer) {
                webhookData.producer = data.producer;
            }

            // Affiliate information
            if (data.affiliate) {
                webhookData.affiliate = data.affiliate;
            }
        }

        return {
            workflowData: [
                this.helpers.returnJsonArray([webhookData]),
            ],
        };
    }
}
