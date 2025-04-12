import { createClient } from '@supabase/supabase-js';

// Valores padrão para desenvolvimento/teste - serão substituídos pelas variáveis de ambiente na produção
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ehkicblprkjeezdawrzk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoa2ljYmxwcmtqZWV6ZGF3cnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjI4MzYsImV4cCI6MjA1OTkzODgzNn0.VanyddVHMf60SPw3Op8l1v7E01ycUoa6lL7Han0wwds';

// Remova essa verificação para evitar erros durante o build
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Faltam as variáveis de ambiente do Supabase');
// }

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para nosso cardápio
export type Categoria = {
  id: string;
  nome: string;
  descricao: string | null;
  ordem: number;
  created_at: string;
};

export type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  preco_original?: number | null;
  imagem_url: string | null;
  categoria_id: string;
  disponivel: boolean;
  destaque: boolean;
  created_at: string;
};

export type GrupoComplemento = {
  id: string;
  nome: string;
  descricao: string | null;
  min_escolhas: number;
  max_escolhas: number;
  created_at: string;
  complementos?: Complemento[];
};

export type Complemento = {
  id: string;
  nome: string;
  preco: number;
  grupo_id: string;
  disponivel: boolean;
  imagem_url: string | null;
  created_at: string;
};

export type Banner = {
  id: string;
  image_url: string;
  link_url: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
};

export type ConfiguracaoLoja = {
  id: string;
  nome_loja: string;
  descricao_loja: string | null;
  logo_url: string | null;
  cor_primaria: string;
  cor_secundaria: string;
  created_at: string;
  
  // Informações da loja
  endereco: string | null;
  cnpj: string | null;
  horario_funcionamento: string | null;
  dias_funcionamento: string | null;
  mostrar_endereco: boolean;
  mostrar_cnpj: boolean;
  mostrar_horario: boolean;
  mostrar_dias: boolean;
  
  // Opções de pagamento
  pagamento_carteira: boolean;
  pagamento_credito_mastercard: boolean;
  pagamento_credito_visa: boolean;
  pagamento_credito_elo: boolean;
  pagamento_credito_amex: boolean;
  pagamento_credito_hipercard: boolean;
  pagamento_debito_mastercard: boolean;
  pagamento_debito_visa: boolean;
  pagamento_debito_elo: boolean;
  pagamento_pix: boolean;
  pagamento_dinheiro: boolean;
};

// Funções de API para interagir com o Supabase
export async function buscarCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('ordem', { ascending: true });

  if (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }

  return data || [];
}

export async function buscarProdutos(categoriaId?: string): Promise<Produto[]> {
  let query = supabase.from('produtos').select('*');
  
  if (categoriaId) {
    query = query.eq('categoria_id', categoriaId);
  }
  
  const { data, error } = await query.order('nome');

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }

  return data || [];
}

export async function buscarProdutosPorId(id: string): Promise<Produto | null> {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar produto:', error);
    return null;
  }

  return data;
}

export async function buscarProdutosDestaque(): Promise<Produto[]> {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('destaque', true)
    .eq('disponivel', true);

  if (error) {
    console.error('Erro ao buscar produtos em destaque:', error);
    return [];
  }

  return data || [];
}

export async function buscarGruposComplementosPorProduto(produtoId: string): Promise<GrupoComplemento[]> {
  // Primeiro busca os IDs de grupos associados ao produto
  const { data: gruposIds, error: gruposError } = await supabase
    .from('produtos_grupos_complementos')
    .select('grupo_id')
    .eq('produto_id', produtoId);

  if (gruposError || !gruposIds.length) {
    return [];
  }

  // Extrai apenas os IDs para usar na consulta
  const ids = gruposIds.map(item => item.grupo_id);

  // Busca os detalhes dos grupos
  const { data: grupos, error: gruposDetalhesError } = await supabase
    .from('grupos_complementos')
    .select('*')
    .in('id', ids);

  if (gruposDetalhesError || !grupos) {
    console.error('Erro ao buscar detalhes dos grupos de complementos:', gruposDetalhesError);
    return [];
  }

  // Para cada grupo, busca seus complementos
  const gruposComComplementos = await Promise.all(
    grupos.map(async (grupo) => {
      const { data: complementos, error: complementosError } = await supabase
        .from('complementos')
        .select('*')
        .eq('grupo_id', grupo.id)
        .eq('disponivel', true);

      if (complementosError) {
        console.error(`Erro ao buscar complementos do grupo ${grupo.nome}:`, complementosError);
        return { ...grupo, complementos: [] };
      }

      return { ...grupo, complementos: complementos || [] };
    })
  );

  return gruposComComplementos;
}

export async function buscarBanners(): Promise<Banner[]> {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (error) {
      // Verificar se o erro é porque a tabela não existe
      if (error.code === '42P01') {
        console.warn('A tabela banners ainda não foi criada. Acesse o painel admin para configurá-la.');
        return [];
      }
      
      console.error('Erro ao buscar banners:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Erro ao buscar banners:', err);
    return [];
  }
}

export async function buscarConfiguracaoLoja(): Promise<ConfiguracaoLoja | null> {
  try {
    // Modificando para buscar todos os registros e usar o primeiro
    const { data, error } = await supabase
      .from('configuracao_loja')
      .select('*')
      .limit(1); // Limita a um resultado

    if (error) {
      // Verificar se o erro é porque a tabela não existe
      if (error.code === '42P01') {
        console.warn('A tabela configuracao_loja ainda não foi criada.');
        return {
          id: '1',
          nome_loja: 'NetFood',
          descricao_loja: 'Seu cardápio digital completo',
          logo_url: null,
          cor_primaria: '#16a34a', // green-600
          cor_secundaria: '#15803d', // green-700
          created_at: new Date().toISOString(),
          
          // Informações da loja
          endereco: null,
          cnpj: null,
          horario_funcionamento: null,
          dias_funcionamento: null,
          mostrar_endereco: false,
          mostrar_cnpj: false,
          mostrar_horario: false,
          mostrar_dias: false,
          
          // Opções de pagamento
          pagamento_carteira: false,
          pagamento_credito_mastercard: false,
          pagamento_credito_visa: false,
          pagamento_credito_elo: false,
          pagamento_credito_amex: false,
          pagamento_credito_hipercard: false,
          pagamento_debito_mastercard: false,
          pagamento_debito_visa: false,
          pagamento_debito_elo: false,
          pagamento_pix: false,
          pagamento_dinheiro: false
        };
      }
      
      console.error('Erro ao buscar configuração da loja:', error);
      return null;
    }

    // Se não houver dados, retorne nulo
    if (!data || data.length === 0) {
      return null;
    }

    // Retorna o primeiro registro
    return data[0];
  } catch (err) {
    console.error('Erro ao buscar configuração da loja:', err);
    return null;
  }
}

export async function atualizarConfiguracaoLoja(config: Partial<ConfiguracaoLoja>): Promise<boolean> {
  try {
    // Verificar se já existe configuração
    const { data: existingConfig } = await supabase
      .from('configuracao_loja')
      .select('id')
      .limit(1);
    
    let error;
    
    if (existingConfig && existingConfig.length > 0) {
      // Atualizar o existente
      ({ error } = await supabase
        .from('configuracao_loja')
        .update(config)
        .eq('id', existingConfig[0].id));
    } else {
      // Inserir novo
      ({ error } = await supabase
        .from('configuracao_loja')
        .insert([{ id: '1', ...config }]));
    }

    if (error) {
      console.error('Erro ao atualizar configuração da loja:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Erro ao atualizar configuração da loja:', err);
    return false;
  }
} 