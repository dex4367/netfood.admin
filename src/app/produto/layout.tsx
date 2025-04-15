import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { supabase } from "@/lib/supabase";
import { Providers } from "@/app/providers";
import Header from "@/components/Header";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default async function ProdutoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Buscar configurações da loja
  let nomeLoja = 'NetFood';
  
  try {
    // Buscar configuração da loja diretamente
    const { data, error } = await supabase
      .from('configuracao_loja')
      .select('nome_loja')
      .limit(1);
      
    if (!error && data && data.length > 0) {
      nomeLoja = data[0].nome_loja;
    }
  } catch (err) {
    console.error('Erro ao buscar configuração:', err);
  }
  
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} min-h-screen bg-white`}>
        <Providers>
          {/* O cabeçalho será gerenciado por cada página */}
          <main className="container mx-auto px-0 sm:px-4 py-0 max-w-md">
            {children}
          </main>
          
          {/* Rodapé removido intencionalmente para página de produto */}
        </Providers>
      </body>
    </html>
  );
} 