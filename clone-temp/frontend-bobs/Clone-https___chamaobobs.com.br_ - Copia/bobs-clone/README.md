This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Hospedagem Local

Para hospedar o site localmente após o build:

1. Execute o build do projeto:
```bash
npm run build
```

2. Sirva os arquivos estáticos usando o serve:
```bash
npx serve out
```

O site estará disponível em http://localhost:3000

### Alternativas para servir os arquivos localmente

Você também pode usar outras ferramentas para servir o site localmente:

#### Usando o http-server
```bash
npx http-server out
```

#### Usando o servidor web embutido do Python (se tiver Python instalado)
```bash
# Python 3
cd out && python -m http.server 3000

# Python 2
cd out && python -m SimpleHTTPServer 3000
```

## Hospedagem na Netlify

Para hospedar o site na Netlify:

1. Faça o build do projeto:
```bash
npm run build
```

2. Faça o upload da pasta `out` para a Netlify através da interface do site ou use o Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=out
```

Os arquivos de configuração já estão prontos para garantir o funcionamento correto do site na Netlify.
