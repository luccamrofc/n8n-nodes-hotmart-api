# n8n-nodes-hotmart-api

Este é um community node do n8n para a API da [Hotmart](https://www.hotmart.com).

A Hotmart é uma plataforma de produtos digitais que permite criadores venderem cursos online, ebooks, softwares e outros produtos digitais. Este node permite que você interaja com a API da Hotmart diretamente dos seus workflows n8n.

[n8n](https://n8n.io/) é uma plataforma de automação de workflows com [licença fair-code](https://docs.n8n.io/reference/license/).

## 🌟 Funcionalidades Principais

- **Modo Dual de Autenticação**: Suporta tanto credenciais estáticas (uso pessoal) quanto tokens dinâmicos (aplicações SaaS/multi-tenant)
- **Operação de Autenticação**: Obtenha access tokens diretamente no workflow
- **Cobertura Completa da API**: Vendas, Assinaturas, Produtos, Área de Membros, Cupons e Negociação de Parcelas
- **Webhook Trigger com 3 Modos**: Padrão, Flow (13 saídas) e Super Flow (6 saídas) para roteamento automático de eventos
- **Suporte a Sandbox**: Teste seus workflows no ambiente sandbox da Hotmart

## Instalação

Siga o [guia de instalação](https://docs.n8n.io/integrations/community-nodes/installation/) na documentação de community nodes do n8n.

### Usando npm

```bash
npm install n8n-nodes-hotmart-api
```

### Usando a Interface do n8n

1. Vá para **Settings > Community Nodes**
2. Busque por `n8n-nodes-hotmart-api`
3. Clique em **Install**

## Modos de Autenticação

### 🔒 Modo Credenciais (Uso Pessoal)

Usa o sistema de credenciais nativo do n8n. Ideal para:
- Projetos pessoais
- Aplicações single-tenant
- Integração com conta Hotmart fixa

### 🚀 Modo Token Dinâmico (Modo SaaS)

Passa autenticação dinamicamente por execução. Ideal para:
- Aplicações SaaS multi-tenant
- Soluções white-label
- Plataformas que gerenciam múltiplas contas Hotmart

**Fluxo recomendado:**

1. Use a operação **Autenticação > Obter Access Token** para obter o token
2. Passe o `{{ $json.access_token }}` para os outros nodes Hotmart

## Operações

### 🔐 Autenticação

| Operação | Descrição |
|----------|-----------|
| Obter Access Token | Obter token OAuth usando Client ID, Client Secret e Token Basic |

### 💰 Vendas

| Operação | Descrição |
|----------|-----------|
| Listar Vendas | Obter histórico de vendas com filtros |
| Resumo de Vendas | Obter resumo das vendas |
| Listar Comissões | Obter comissões de vendas |
| Detalhes de Preço | Obter detalhes de preço das vendas |

### 📅 Assinaturas

| Operação | Descrição |
|----------|-----------|
| Listar Assinaturas | Obter todas as assinaturas |
| Resumo de Assinaturas | Obter resumo das assinaturas |
| Compras de Assinatura | Obter compras da assinatura |
| Cancelar | Cancelar uma assinatura |
| Reativar | Reativar uma assinatura |
| Alterar Data de Cobrança | Alterar data de cobrança da assinatura |

### 📦 Produtos

| Operação | Descrição |
|----------|-----------|
| Listar Produtos | Obter todos os produtos |

### 🎓 Área de Membros

| Operação | Descrição |
|----------|-----------|
| Listar Alunos | Obter alunos da área de membros |
| Listar Módulos | Obter módulos da área de membros |
| Listar Páginas | Obter páginas de um módulo |
| Progresso do Aluno | Obter progresso do aluno |

### 🏷️ Cupons

| Operação | Descrição |
|----------|-----------|
| Criar Cupom | Criar cupom de desconto para um produto |
| Listar Cupons | Obter cupons de um produto |
| Excluir Cupom | Excluir um cupom |

### 💳 Negociação de Parcelas

| Operação | Descrição |
|----------|-----------|
| Gerar Negociação | Gerar PIX ou Boleto para negociar parcelas em atraso de inadimplentes |

## Node Trigger

O node **Hotmart Trigger** permite receber webhooks da Hotmart com **3 modos de operação**:

> ⚠️ **Segurança**: Configure sempre o campo **Hottok** no trigger para validar que as requisições vêm realmente da Hotmart. Sem o Hottok configurado, qualquer pessoa que descobrir a URL do webhook pode enviar dados falsos ao seu workflow.

### 📡 Modos de Webhook

#### Modo Padrão
Uma única saída para todos os eventos. Você pode filtrar por evento específico ou receber todos.

#### Modo Flow (13 saídas)
Cada tipo de evento é roteado automaticamente para uma saída específica. Elimina a necessidade de nodes IF/Switch no seu workflow.

```
┌─────────────────────────┐
│    Hotmart Trigger      │
│    (Modo: Flow)         │
├─────────────────────────┤
│ ● Compra Aprovada      →│─── [Enviar Email Boas-Vindas]
│ ● Compra Completa      →│─── [Liberar Acesso]
│ ● Compra Cancelada     →│─── [Revogar Acesso]
│ ● Compra Reembolsada   →│─── [Processar Reembolso]
│ ● Chargeback           →│─── [Alerta Urgente]
│ ● Boleto Impresso      →│─── [Email Lembrete]
│ ● Compra Atrasada      →│─── [Cobrança]
│ ● Compra Expirada      →│─── [Noop]
│ ● Abandono Carrinho    →│─── [Remarketing]
│ ● Disputa Aberta       →│─── [Suporte]
│ ● Cancel. Assinatura   →│─── [Winback]
│ ● Troca de Plano       →│─── [Atualizar Permissões]
│ ● Outros               →│─── [Log]
└─────────────────────────┘
```

#### Modo Super Flow (6 saídas)
Saídas granulares baseadas no contexto da compra. Ideal para diferenciar compras únicas de assinaturas.

| Saída | Descrição | Eventos |
|-------|-----------|---------|
| **Compra Única** | Produto vendido sem recorrência | `PURCHASE_APPROVED` sem subscription |
| **Nova Assinatura** | Primeira cobrança de assinatura | `PURCHASE_APPROVED` com `recurrency_number = 1` |
| **Renovação** | Cobranças recorrentes | `PURCHASE_APPROVED` com `recurrency_number > 1` |
| **Cancelamento** | Cancelamentos e reembolsos | `PURCHASE_CANCELED`, `REFUNDED`, `SUBSCRIPTION_CANCELLATION` |
| **Problema Pagamento** | Issues de cobrança | `CHARGEBACK`, `PROTEST`, `DELAYED`, `EXPIRED` |
| **Outros** | Demais eventos | Qualquer outro evento |

```
┌─────────────────────────┐
│    Hotmart Trigger      │
│    (Modo: Super Flow)   │
├─────────────────────────┤
│ ● Compra Única         →│─── [Entregar Produto]
│ ● Nova Assinatura      →│─── [Onboarding Completo]
│ ● Renovação            →│─── [Email Agradecimento]
│ ● Cancelamento         →│─── [Campanha Winback]
│ ● Problema Pagamento   →│─── [Recuperação de Venda]
│ ● Outros               →│─── [Log para Debug]
└─────────────────────────┘
```

### Eventos Suportados

- Compra Aprovada
- Compra Completa
- Compra Cancelada
- Compra Reembolsada
- Chargeback
- Disputa Aberta
- Cancelamento de Assinatura
- Troca de Plano
- Boleto Impresso
- Compra Atrasada
- Compra Expirada
- Abandono de Carrinho

## Configuração de Credenciais

Para usar este node no **Modo Credenciais**, obtenha as credenciais da API na Hotmart:

1. Faça login na sua conta Hotmart
2. Vá para **Ferramentas > Credenciais Developers**
3. Crie uma nova credencial
4. Copie o **Client ID**, **Client Secret** e **Token Basic**

### Ambiente

Você pode escolher entre:
- **Produção**: Usa a API de produção da Hotmart (`https://developers.hotmart.com`)
- **Sandbox**: Usa o ambiente sandbox da Hotmart (`https://sandbox.hotmart.com`)

> ⚠️ **Importante**: Credenciais de Sandbox só funcionam no ambiente Sandbox e vice-versa. Você precisa criar credenciais separadas para cada ambiente.

## Exemplo de Uso (Modo SaaS)

```
┌─────────────────────┐     ┌─────────────────────┐
│   Hotmart Node      │────▶│   Hotmart Node      │
│   (Autenticação)    │     │   (Vendas/etc)      │
│                     │     │                     │
│ • Client ID         │     │ • Token: $json.     │
│ • Client Secret     │     │   access_token      │
│ • Token Basic       │     │                     │
└─────────────────────┘     └─────────────────────┘
```

## Recursos

- [Documentação da API Hotmart](https://developers.hotmart.com/docs/pt-BR/)
- [Documentação de Community Nodes n8n](https://docs.n8n.io/integrations/community-nodes/)

## ☕ Apoie o Projeto

Se este node foi útil para você, considere fazer uma doação para apoiar o desenvolvimento, um cafézinho é sempre bem-vindo!

**Chave Pix:** `2858d3fb-4256-4e31-a58c-84d6c3ffde25`

Qualquer valor é bem-vindo e ajuda a manter o projeto ativo. Obrigado pelo apoio! 💜

## Licença

[MIT](LICENSE.md)
