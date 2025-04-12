# NetFood - Cardápio Digital

Um cardápio digital moderno e responsivo integrado com Supabase, construído com Next.js.

## Características

- 🍔 Exibição de produtos organizados por categorias
- 🌟 Destaques de produtos especiais
- 🔍 Navegação intuitiva entre categorias
- 📱 Design totalmente responsivo
- 🖼️ Suporte a imagens de produtos
- 💾 Integração com Supabase para armazenamento de dados

## Tecnologias

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Supabase](https://supabase.com/) - Backend e banco de dados
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática

## Configuração do Banco de Dados

No seu projeto Supabase, crie as seguintes tabelas:

### Tabela `categorias`

```sql
create table categorias (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  descricao text,
  ordem integer not null default 0,
  created_at timestamp with time zone default now() not null
);
```

### Tabela `produtos`

```sql
create table produtos (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  descricao text,
  preco decimal(10,2) not null,
  imagem_url text,
  categoria_id uuid references categorias(id) not null,
  disponivel boolean default true not null,
  destaque boolean default false not null,
  created_at timestamp with time zone default now() not null
);
```

## Instruções para Execução

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie o arquivo `.env.local.example` para `.env.local` e preencha suas credenciais do Supabase:
   ```bash
   cp .env.local.example .env.local
   ```
4. No arquivo `next.config.mjs`, atualize o domínio do Supabase para o domínio do seu bucket de armazenamento.
5. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
6. Acesse o cardápio em [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

- `/src/app` - Rotas do Next.js App Router
- `/src/components` - Componentes reutilizáveis
- `/src/lib` - Utilitários e configuração do Supabase

## Licença

Este projeto está licenciado sob a licença MIT.
