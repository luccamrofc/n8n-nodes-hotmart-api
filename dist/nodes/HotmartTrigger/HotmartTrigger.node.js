"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotmartTrigger = void 0;
class HotmartTrigger {
    constructor() {
        this.description = {
            displayName: 'Hotmart Trigger',
            name: 'hotmartTrigger',
            icon: 'file:hotmart.png',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["event"]}}',
            description: 'Starts the workflow when a Hotmart webhook event occurs',
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
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'All Events',
                            value: 'all',
                            description: 'Trigger on any Hotmart webhook event',
                        },
                        {
                            name: 'Purchase Approved',
                            value: 'PURCHASE_APPROVED',
                            description: 'Trigger when a purchase is approved',
                        },
                        {
                            name: 'Purchase Billet Printed',
                            value: 'PURCHASE_BILLET_PRINTED',
                            description: 'Trigger when a billet is printed',
                        },
                        {
                            name: 'Purchase Canceled',
                            value: 'PURCHASE_CANCELED',
                            description: 'Trigger when a purchase is canceled',
                        },
                        {
                            name: 'Purchase Chargeback',
                            value: 'PURCHASE_CHARGEBACK',
                            description: 'Trigger when a chargeback occurs',
                        },
                        {
                            name: 'Purchase Complete',
                            value: 'PURCHASE_COMPLETE',
                            description: 'Trigger when a purchase is completed',
                        },
                        {
                            name: 'Purchase Delayed',
                            value: 'PURCHASE_DELAYED',
                            description: 'Trigger when a purchase is delayed',
                        },
                        {
                            name: 'Purchase Expired',
                            value: 'PURCHASE_EXPIRED',
                            description: 'Trigger when a purchase expires',
                        },
                        {
                            name: 'Purchase Out of Shopping Cart',
                            value: 'PURCHASE_OUT_OF_SHOPPING_CART',
                            description: 'Trigger when purchase is out of shopping cart',
                        },
                        {
                            name: 'Purchase Protest',
                            value: 'PURCHASE_PROTEST',
                            description: 'Trigger when a dispute is opened',
                        },
                        {
                            name: 'Purchase Refunded',
                            value: 'PURCHASE_REFUNDED',
                            description: 'Trigger when a purchase is refunded',
                        },
                        {
                            name: 'Subscription Cancellation',
                            value: 'SUBSCRIPTION_CANCELLATION',
                            description: 'Trigger when a subscription is cancelled',
                        },
                        {
                            name: 'Switch Plan',
                            value: 'SWITCH_PLAN',
                            description: 'Trigger when a subscription plan changes',
                        },
                    ],
                    default: 'all',
                    description: 'The event to listen for',
                },
                {
                    displayName: 'Hottok (Secret)',
                    name: 'hottok',
                    type: 'string',
                    typeOptions: {
                        password: true,
                    },
                    default: '',
                    description: 'Optional: The Hottok secret from your Hotmart webhook settings. If set, requests without a matching hottok will be rejected.',
                },
            ],
        };
    }
    async webhook() {
        const bodyData = this.getBodyData();
        const event = this.getNodeParameter('event');
        const hottok = this.getNodeParameter('hottok');
        if (hottok) {
            const requestHottok = bodyData.hottok;
            if (requestHottok !== hottok) {
                return {
                    webhookResponse: {
                        status: 401,
                        body: 'Unauthorized: Invalid hottok',
                    },
                };
            }
        }
        const eventType = bodyData.event;
        if (event !== 'all' && eventType !== event) {
            return {
                webhookResponse: {
                    status: 200,
                    body: 'Event ignored',
                },
            };
        }
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
        }
        return {
            workflowData: [
                this.helpers.returnJsonArray([webhookData]),
            ],
        };
    }
}
exports.HotmartTrigger = HotmartTrigger;
