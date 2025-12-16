# n8n-nodes-hotmart-api

Este é um community node do n8n para a API da [Hotmart](https://www.hotmart.com).

A Hotmart é uma plataforma de produtos digitais que permite criadores venderem cursos online, ebooks, softwares e outros produtos digitais. Este node permite que você interaja com a API da Hotmart diretamente dos seus workflows n8n.

[n8n](https://n8n.io/) é uma plataforma de automação de workflows com [licença fair-code](https://docs.n8n.io/reference/license/).

## 🌟 Funcionalidades Principais

- **Modo Dual de Autenticação**: Suporta tanto credenciais estáticas (uso pessoal) quanto tokens dinâmicos (aplicações SaaS/multi-tenant)
- **Cobertura Completa da API**: Vendas, Assinaturas, Produtos e Área de Membros
- **Webhook Trigger**: Receba notificações em tempo real para compras, cancelamentos e mais
- **Retry Automático**: Se o token expirar durante a execução, o node renova automaticamente

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
- Integrações dinâmicas onde cada usuário tem suas próprias credenciais

O Modo SaaS oferece **duas opções** de autenticação:

#### Token Direto (Já Autenticado)
Use quando você já possui um access token OAuth válido:
1. Selecione "Token Dinâmico (Modo SaaS)" no Modo de Autenticação
2. Selecione "Token Direto (Já Autenticado)" no Tipo de Autenticação SaaS
3. Passe o `accessToken` de um node anterior (ex: do seu banco de dados ou requisição HTTP)

> ⚠️ **Nota**: Neste modo, você é responsável por gerenciar a expiração e renovação do token.

#### Credenciais Dinâmicas (Auto-Refresh) ✨ **NOVO**
Use quando você quer que o node gerencie automaticamente o access token:
1. Selecione "Token Dinâmico (Modo SaaS)" no Modo de Autenticação
2. Selecione "Credenciais Dinâmicas (Auto-Refresh)" no Tipo de Autenticação SaaS
3. Passe `Client ID`, `Client Secret` e `Token Basic` (podem vir de um node anterior, como do banco de dados)
4. O node obtém e cacheia o access token automaticamente!

**Vantagens do Auto-Refresh:**
- 🔄 **Token gerenciado automaticamente**: O node obtém e renova tokens conforme necessário
- ⚡ **Cache inteligente**: Tokens são cacheados e renovados 5 minutos antes de expirar
- 🔁 **Retry automático**: Se um token expirar durante a execução, o node tenta novamente
- 📦 **Batch processing**: Cada item no fluxo pode usar credenciais diferentes

## Operações

### Vendas

| Operação | Descrição |
|----------|-----------|
| Listar Vendas | Obter histórico de vendas com filtros |
| Resumo de Vendas | Obter resumo das vendas |
| Listar Comissões | Obter comissões de vendas |
| Detalhes de Preço | Obter detalhes de preço das vendas |

### Assinaturas

| Operação | Descrição |
|----------|-----------|
| Listar Assinaturas | Obter todas as assinaturas |
| Resumo de Assinaturas | Obter resumo das assinaturas |
| Compras de Assinatura | Obter compras da assinatura |
| Cancelar | Cancelar uma assinatura |
| Reativar | Reativar uma assinatura |
| Alterar Data de Cobrança | Alterar data de cobrança da assinatura |

### Produtos

| Operação | Descrição |
|----------|-----------|
| Listar Produtos | Obter todos os produtos |

### Área de Membros

| Operação | Descrição |
|----------|-----------|
| Listar Alunos | Obter alunos da área de membros |
| Listar Módulos | Obter módulos da área de membros |
| Listar Páginas | Obter páginas de um módulo |
| Progresso do Aluno | Obter progresso do aluno |

## Node Trigger

O node **Hotmart Trigger** permite receber webhooks da Hotmart para os seguintes eventos:

- Compra Aprovada
- Compra Completa
- Compra Cancelada
- Compra Reembolsada
- Chargeback
- Disputa Aberta
- Cancelamento de Assinatura
- Troca de Plano
- E mais...

## Configuração de Credenciais

Para usar este node no **Modo Credenciais**, obtenha as credenciais da API na Hotmart:

1. Faça login na sua conta Hotmart
2. Vá para **Ferramentas > Credenciais Developers**
3. Crie uma nova credencial
4. Copie o **Client ID**, **Client Secret** e **Token Basic**

### Ambiente

Você pode escolher entre:
- **Produção**: Usa a API de produção da Hotmart
- **Sandbox**: Usa o ambiente sandbox da Hotmart para testes

> ⚠️ **Importante**: Credenciais de Sandbox só funcionam no ambiente Sandbox e vice-versa. Você precisa criar credenciais separadas para cada ambiente.

## Recursos

- [Documentação da API Hotmart](https://developers.hotmart.com/docs/pt-BR/)
- [Documentação de Community Nodes n8n](https://docs.n8n.io/integrations/community-nodes/)

## Licença

[MIT](LICENSE.md)
