import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

export async function gerarMetadata(): Promise<Metadata> {
  let nomeLoja = 'NetFood';
  let descricaoLoja = 'Cardápio digital com integração ao Supabase';
  
  try {
    // Buscar configuração da loja diretamente
    const { data, error } = await supabase
      .from('configuracao_loja')
      .select('*')
      .limit(1);
      
    if (!error && data && data.length > 0) {
      const configuracao = data[0];
      nomeLoja = configuracao.nome_loja;
      descricaoLoja = configuracao.descricao_loja || 'Cardápio digital com integração ao Supabase';
    }
  } catch (err) {
    console.error('Erro ao buscar configuração para metadata:', err);
  }
  
  return {
    title: `${nomeLoja} - Cardápio Digital`,
    description: descricaoLoja,
  };
} 