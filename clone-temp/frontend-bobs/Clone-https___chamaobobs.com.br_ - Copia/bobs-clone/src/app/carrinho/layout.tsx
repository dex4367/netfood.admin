import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import "../globals.css";

export const metadata: Metadata = {
  title: "Carrinho | Bob's",
  description: "Seu carrinho de compras",
};

// Esta página usa um layout específico sem o cabeçalho ou rodapé globais
export default function CarrinhoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="bg-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 