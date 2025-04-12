import { Metadata } from 'next';
import { buscarConfiguracaoLoja } from '@/lib/supabase';

export async function gerarMetadata(): Promise<Metadata> {
  const configuracao = await buscarConfiguracaoLoja();
  const nomeLoja = configuracao?.nome_loja || 'NetFood';
  
  return {
    title: `${nomeLoja} - Cardápio Digital`,
    description: configuracao?.descricao_loja || 'Cardápio digital com integração ao Supabase',
  };
} 