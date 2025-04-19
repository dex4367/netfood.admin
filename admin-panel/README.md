# Painel Administrativo - NetFood

Este painel administrativo é responsável por gerenciar todos os dados do sistema NetFood.

## Requisitos

- Node.js 18+
- npm ou pnpm

## Configuração

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
# ou
pnpm install
```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env.local`
   - Preencha as variáveis com os dados do seu projeto Supabase

```bash
cp .env.example .env.local
```

4. Execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
pnpm dev
```

O painel administrativo estará disponível em [http://localhost:3000](http://localhost:3000).

## Estrutura do Banco de Dados (Supabase)

O sistema utiliza o Supabase como banco de dados. Abaixo estão as tabelas necessárias:

### Tabelas Principais

- **produtos**: Armazena todos os produtos disponíveis para venda
  - id (uuid, primary key)
  - nome (text, not null)
  - descricao (text)
  - preco (numeric, not null)
  - categoria (text, not null)
  - imagem (text)
  - disponivel (boolean, default true)
  - destaque (boolean, default false)
  - created_at (timestamp with time zone, default now())

- **categorias**: Categorias de produtos
  - id (uuid, primary key)
  - nome (text, not null)
  - descricao (text)
  - imagem (text)
  - ordem (integer, not null)
  - created_at (timestamp with time zone, default now())

- **complementos**: Opções adicionais para produtos
  - id (uuid, primary key)
  - nome (text, not null)
  - descricao (text)
  - min_selecionaveis (integer, default 0)
  - max_selecionaveis (integer)
  - obrigatorio (boolean, default false)
  - created_at (timestamp with time zone, default now())

- **itens_complemento**: Itens individuais de cada complemento
  - id (uuid, primary key)
  - complemento_id (uuid, foreign key, references complementos.id)
  - nome (text, not null)
  - preco (numeric, default 0)
  - created_at (timestamp with time zone, default now())

- **produto_complementos**: Relação entre produtos e complementos
  - id (uuid, primary key)
  - produto_id (uuid, foreign key, references produtos.id)
  - complemento_id (uuid, foreign key, references complementos.id)

- **configuracao**: Configurações gerais da loja
  - id (uuid, primary key)
  - nome_loja (text, not null)
  - descricao (text)
  - logo (text)
  - banner (text)
  - cor_primaria (text)
  - cor_secundaria (text)
  - cnpj (text)
  - telefone (text)
  - endereco (text)
  - cidade (text)
  - estado (text)
  - cep (text)
  - horario_funcionamento (jsonb)
  - pedido_minimo (numeric, default 0)
  - taxa_entrega (numeric, default 0)
  - tempo_entrega_min (integer)
  - tempo_entrega_max (integer)
  - raio_entrega (numeric)
  - created_at (timestamp with time zone, default now())

- **pedidos**: Pedidos realizados
  - id (uuid, primary key)
  - cliente_id (uuid, foreign key, references auth.users.id)
  - status (text, not null)
  - forma_pagamento (text, not null)
  - endereco_entrega (jsonb)
  - valor_produtos (numeric, not null)
  - valor_entrega (numeric, not null)
  - valor_total (numeric, not null)
  - observacao (text)
  - created_at (timestamp with time zone, default now())

- **itens_pedido**: Itens individuais de cada pedido
  - id (uuid, primary key)
  - pedido_id (uuid, foreign key, references pedidos.id)
  - produto_id (uuid, foreign key, references produtos.id)
  - quantidade (integer, not null)
  - preco_unitario (numeric, not null)
  - nome_produto (text, not null)
  - complementos (jsonb)
  - observacao (text)
  - created_at (timestamp with time zone, default now())

## Recursos

O painel administrativo inclui os seguintes recursos:

- **Dashboard**: Visão geral com estatísticas e gráficos
- **Produtos**: Gerenciamento de produtos do cardápio
- **Categorias**: Organização das categorias de produtos
- **Complementos**: Gestão de opções adicionais
- **Pedidos**: Acompanhamento e gerenciamento de pedidos
- **Configurações**: Personalização da loja
- **Banners**: Gerenciamento de banners promocionais
- **Métodos de Pagamento**: Configuração de formas de pagamento 