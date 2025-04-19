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
    <>
      {/* Conteúdo da página de produto */}
      <div className="produto-container">
        {children}
      </div>
    </>
  );
} 