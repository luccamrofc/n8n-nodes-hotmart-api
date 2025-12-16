# n8n-nodes-hotmart-api

This is an n8n community node for the [Hotmart](https://www.hotmart.com) API.

Hotmart is a digital products platform that allows creators to sell online courses, ebooks, software, and other digital products. This node allows you to interact with the Hotmart API directly from your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Using npm

```bash
npm install n8n-nodes-hotmart-api
```

### Using n8n UI

1. Go to **Settings > Community Nodes**
2. Search for `n8n-nodes-hotmart-api`
3. Click **Install**

## Operations

This node supports the following resources and operations:

### Sales

| Operation | Description |
|-----------|-------------|
| Get Many | Get sales history with filters |
| Get Summary | Get sales summary |
| Get Commissions | Get sales commissions |
| Get Price Details | Get price details of sales |

### Subscriptions

| Operation | Description |
|-----------|-------------|
| Get Many | Get all subscriptions |
| Get Summary | Get subscriptions summary |
| Get Purchases | Get subscription purchases |
| Cancel | Cancel a subscription |
| Reactivate | Reactivate a subscription |
| Change Billing Date | Change subscription billing date |

### Products

| Operation | Description |
|-----------|-------------|
| Get Many | Get all products |

### Member Area

| Operation | Description |
|-----------|-------------|
| Get Students | Get students from member area |
| Get Modules | Get modules from member area |
| Get Pages | Get pages from a module |
| Get Student Progress | Get student progress |

## Trigger Node

The **Hotmart Trigger** node allows you to receive webhooks from Hotmart for the following events:

- Purchase Approved
- Purchase Complete
- Purchase Canceled
- Purchase Refunded
- Purchase Chargeback
- Purchase Protest
- Subscription Cancellation
- Switch Plan
- And more...

## Credentials

To use this node, you need to obtain API credentials from Hotmart:

1. Log in to your Hotmart account
2. Go to **Tools > Developer Credentials**
3. Create a new credential
4. Copy the **Client ID**, **Client Secret**, and **Basic Token**

### Environment

You can choose between:
- **Production**: Uses the live Hotmart API
- **Sandbox**: Uses the Hotmart sandbox environment for testing

## Resources

- [Hotmart API Documentation](https://developers.hotmart.com/docs/en/)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
