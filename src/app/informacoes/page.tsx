'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import InfoLoja from '@/components/InfoLoja';
import { useEffect, useState } from 'react';
import { buscarConfiguracaoLoja } from '@/lib/supabase';
import { ConfiguracaoLoja } from '@/lib/supabase';

export default function InformacoesPage() {
  const [configLoja, setConfigLoja] = useState<ConfiguracaoLoja | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarConfiguracoes = async () => {
      setIsLoading(true);
      try {
        const configuracoes = await buscarConfiguracaoLoja();
        setConfigLoja(configuracoes);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarConfiguracoes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-t-2 border-r-2 border-red-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cabeçalho */}
      <div className="bg-white shadow-md border-b">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center">
          <Link 
            href="/" 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={22} className="text-gray-700" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-800 ml-2">
            Informações da Loja
          </h1>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {configLoja ? (
          <InfoLoja configuracao={configLoja} />
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            Nenhuma informação disponível sobre esta loja.
          </div>
        )}
      </div>
    </div>
  );
} 