# n8n-nodes-hotmart-api

This is an n8n community node for the [Hotmart](https://www.hotmart.com) API.

Hotmart is a digital products platform that allows creators to sell online courses, ebooks, software, and other digital products. This node allows you to interact with the Hotmart API directly from your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## 🌟 Key Features

- **Dual Authentication Mode**: Supports both static credentials (personal use) and dynamic tokens (SaaS/multi-tenant applications)
- **Complete API Coverage**: Sales, Subscriptions, Products, and Members Area
- **Webhook Trigger**: Receive real-time notifications for purchases, cancellations, and more

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

## Authentication Modes

### 🔒 Credentials Mode (Personal Use)

Use n8n's built-in credential system. Ideal for:
- Personal projects
- Single-tenant applications
- Fixed Hotmart account integration

### 🚀 Dynamic Token Mode (SaaS Mode)

Pass access tokens dynamically per execution. Ideal for:
- Multi-tenant SaaS applications
- White-label solutions
- Platforms managing multiple Hotmart accounts
- Dynamic integrations where each user has their own Hotmart credentials

**How to use SaaS Mode:**
1. Select "Dynamic Token (SaaS Mode)" in Authentication Mode
2. Pass the `accessToken` from a previous node (e.g., from your database, OAuth flow, or HTTP request)
3. Each workflow execution can use a different Hotmart account!

## Operations

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

## Credentials Setup

To use this node in **Credentials Mode**, obtain API credentials from Hotmart:

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
