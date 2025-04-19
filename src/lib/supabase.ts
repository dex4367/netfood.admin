import { createClient } from '@supabase/supabase-js';

// Valores padrão para desenvolvimento/teste - serão substituídos pelas variáveis de ambiente na produção
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ehkicblprkjeezdawrzk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoa2ljYmxwcmtqZWV6ZGF3cnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjI4MzYsImV4cCI6MjA1OTkzODgzNn0.VanyddVHMf60SPw3Op8l1v7E01ycUoa6lL7Han0wwds';

// Não lançamos erro durante o build, mas registramos um aviso
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Faltam as variáveis de ambiente do Supabase. Usando valores padrão.');
}

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
  preco_original: number | null;
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
  imagem_capa_url: string | null;
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
  try {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) {
      // Verificar se o erro é porque a tabela não existe
      if (error.code === '42P01') {
        console.warn('A tabela categorias ainda não foi criada.');
        return [];
      }
      
      // Melhor log do erro
      console.error('Erro detalhado ao buscar categorias:', JSON.stringify(error, null, 2));
      return [];
    }

    return data || [];
  } catch (err: any) {
    // Melhor log do erro no catch
    console.error('Erro inesperado ao buscar categorias:', err instanceof Error ? err.message : String(err));
    return [];
  }
}

export async function buscarProdutos(categoriaId?: string): Promise<Produto[]> {
  try {
    let query = supabase.from('produtos').select('*');
    
    if (categoriaId) {
      query = query.eq('categoria_id', categoriaId);
    }
    
    const { data, error } = await query.order('nome');

    if (error) {
      // Verificar se o erro é porque a tabela não existe
      if (error.code === '42P01') {
        console.warn('A tabela produtos ainda não foi criada.');
        return [];
      }
      
      console.error('Erro ao buscar produtos:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    return [];
  }
}

export async function buscarProdutosPorId(id: string): Promise<Produto | null> {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Verificar se o erro é porque a tabela não existe
      if (error.code === '42P01') {
        console.warn('A tabela produtos ainda não foi criada.');
        return null;
      }
      
      // Verificar se o erro é porque o produto não existe
      if (error.code === 'PGRST116') {
        console.warn(`Produto com ID ${id} não encontrado`);
        return null;
      }
      
      console.error('Erro ao buscar produto:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    return null;
  }
}

export async function buscarProdutosDestaque(): Promise<Produto[]> {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('destaque', true)
      .eq('disponivel', true);

    if (error) {
      // Verificar se o erro é porque a tabela não existe
      if (error.code === '42P01') {
        console.warn('A tabela produtos ainda não foi criada.');
        return [];
      }
      
      console.error('Erro ao buscar produtos em destaque:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Erro ao buscar produtos em destaque:', err);
    return [];
  }
}

/**
 * Busca produtos por termo de pesquisa
 * @param searchQuery Termo a ser pesquisado no nome e descrição dos produtos
 * @returns Lista de produtos que correspondem à pesquisa
 */
export async function buscarProdutosPorQuery(searchQuery: string): Promise<Produto[]> {
  try {
    if (!searchQuery || searchQuery.trim() === '') {
      // Se não houver termo de busca, retorna todos os produtos
      return buscarProdutos();
    }

    const query = searchQuery.trim().toLowerCase();
    
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .or(`nome.ilike.%${query}%,descricao.ilike.%${query}%`)
      .order('nome');

    if (error) {
      // Verificar se o erro é porque a tabela não existe
      if (error.code === '42P01') {
        console.warn('A tabela produtos ainda não foi criada.');
        return [];
      }
      
      console.error('Erro ao buscar produtos por query:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Erro ao buscar produtos por query:', err);
    return [];
  }
}

export async function buscarGruposComplementosPorProduto(produtoId: string): Promise<GrupoComplemento[]> {
  try {
    // Primeiro busca os IDs de grupos associados ao produto
    const { data: gruposIds, error: gruposError } = await supabase
      .from('produtos_grupos_complementos')
      .select('grupo_id')
      .eq('produto_id', produtoId);

    if (gruposError) {
      // Verificar se o erro é porque a tabela não existe
      if (gruposError.code === '42P01') {
        console.warn('A tabela produtos_grupos_complementos ainda não foi criada.');
        return [];
      }
      
      console.error('Erro ao buscar grupos de complementos:', gruposError);
      return [];
    }

    if (!gruposIds?.length) {
      return [];
    }

    // Extrai apenas os IDs para usar na consulta
    const ids = gruposIds.map(item => item.grupo_id);

    // Busca os detalhes dos grupos
    const { data: grupos, error: gruposDetalhesError } = await supabase
      .from('grupos_complementos')
      .select('*')
      .in('id', ids);

    if (gruposDetalhesError) {
      // Verificar se o erro é porque a tabela não existe
      if (gruposDetalhesError.code === '42P01') {
        console.warn('A tabela grupos_complementos ainda não foi criada.');
        return [];
      }
      
      console.error('Erro ao buscar detalhes dos grupos de complementos:', gruposDetalhesError);
      return [];
    }

    if (!grupos || grupos.length === 0) {
      return [];
    }

    // Para cada grupo, busca seus complementos
    const gruposComComplementos = await Promise.all(
      grupos.map(async (grupo) => {
        try {
          const { data: complementos, error: complementosError } = await supabase
            .from('complementos')
            .select('*')
            .eq('grupo_id', grupo.id)
            .eq('disponivel', true);

          if (complementosError) {
            // Verificar se o erro é porque a tabela não existe
            if (complementosError.code === '42P01') {
              console.warn('A tabela complementos ainda não foi criada.');
              return { ...grupo, complementos: [] };
            }
            
            console.error(`Erro ao buscar complementos do grupo ${grupo.nome}:`, complementosError);
            return { ...grupo, complementos: [] };
          }

          return { ...grupo, complementos: complementos || [] };
        } catch (err) {
          console.error(`Erro ao processar grupo ${grupo.nome}:`, err);
          return { ...grupo, complementos: [] };
        }
      })
    );

    return gruposComComplementos;
  } catch (err) {
    console.error('Erro ao buscar grupos de complementos:', err);
    return [];
  }
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

    // Configuração padrão a ser retornada
    const configPadrao: ConfiguracaoLoja = {
      id: '1',
      nome_loja: 'NetFood',
      descricao_loja: 'Seu cardápio digital completo',
      logo_url: null,
      imagem_capa_url: null,
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

    if (error) {
      // Verificar se o erro é porque a tabela não existe
      if (error.code === '42P01') {
        console.warn('A tabela configuracao_loja ainda não foi criada.');
        return configPadrao;
      }
      
      console.error('Erro ao buscar configuração da loja:', error);
      return configPadrao;
    }

    // Se não existir configuração, retorna uma configuração padrão
    if (!data || data.length === 0) {
      return configPadrao;
    }

    return data[0];
  } catch (err) {
    console.error('Erro ao buscar configuração da loja:', err);
    
    // Retorna uma configuração padrão em caso de erro
    return {
      id: '1',
      nome_loja: 'NetFood',
      descricao_loja: 'Seu cardápio digital completo',
      logo_url: null,
      imagem_capa_url: null,
      cor_primaria: '#16a34a',
      cor_secundaria: '#15803d',
      created_at: new Date().toISOString(),
      endereco: null,
      cnpj: null,
      horario_funcionamento: null,
      dias_funcionamento: null,
      mostrar_endereco: false,
      mostrar_cnpj: false,
      mostrar_horario: false,
      mostrar_dias: false,
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
}

// Função para inicializar o banco de dados automaticamente
export async function inicializarBancoDados(): Promise<void> {
  try {
    console.log('Verificando banco de dados...');
    
    // Verificar se a tabela configuracao_loja existe
    const { error: checkError } = await supabase.from('configuracao_loja').select('id').limit(1);
    
    if (checkError && checkError.code === '42P01') {
      // Tabela não existe, mas não podemos criá-la sem funções SQL
      console.log('A tabela configuracao_loja não existe. Usando valores padrão.');
      
      // Não temos permissão para criar tabelas, então apenas usaremos valores padrão
      // Você precisará criar a tabela pelo painel do Supabase ou via migração
      console.log('ATENÇÃO: Para criar a tabela, acesse o painel de administração do Supabase');
    } else if (!checkError) {
      // Tabela existe, verificar se já tem dados
      const { data } = await supabase.from('configuracao_loja').select('id').limit(1);
      
      if (!data || data.length === 0) {
        // Tabela existe mas não tem dados, inserir configuração padrão
        const configPadrao = {
          id: '1',
          nome_loja: 'NetFood',
          descricao_loja: 'Seu cardápio digital completo',
          logo_url: null,
          imagem_capa_url: null,
          cor_primaria: '#16a34a',
          cor_secundaria: '#15803d',
          endereco: null,
          cnpj: null,
          horario_funcionamento: null,
          dias_funcionamento: null,
          mostrar_endereco: false,
          mostrar_cnpj: false,
          mostrar_horario: false,
          mostrar_dias: false,
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
        
        // Inserir configuração padrão
        const { error: insertError } = await supabase.from('configuracao_loja').insert([configPadrao]);
        
        if (insertError) {
          console.log('Erro ao inserir configuração padrão:', insertError);
        } else {
          console.log('Configuração padrão inserida com sucesso!');
        }
      } else {
        console.log('Banco de dados já inicializado!');
      }
    }
  } catch (error) {
    console.error('Erro ao verificar banco de dados:', error);
  }
}

// Verificar se a tabela já existe (para casos em que não temos acesso SQL direto)
export async function verificarTabelaConfiguracaoLoja(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('configuracao_loja').select('id').limit(1);
    
    if (error && error.code === '42P01') {
      return false; // Tabela não existe
    }
    
    return true; // Tabela existe
  } catch (error) {
    console.error('Erro ao verificar tabela:', error);
    return false;
  }
}

// Verificar se precisa adicionar coluna imagem_capa_url
export async function adicionarColunaImagemCapa(): Promise<boolean> {
  try {
    // Tentativa simples para verificar se a coluna existe
    const { error: checkError } = await supabase
      .from('configuracao_loja')
      .select('imagem_capa_url')
      .limit(1);
    
    if (checkError && checkError.message.includes('column "imagem_capa_url" does not exist')) {
      console.log('Coluna imagem_capa_url não existe, tentando adicionar...');
      
      // Precisa usar SQL direto, mas isso geralmente requer permissões admin
      const sqlCommand = `
        ALTER TABLE configuracao_loja 
        ADD COLUMN IF NOT EXISTS imagem_capa_url TEXT;
      `;
      
      console.log('Execute o comando SQL abaixo no editor SQL do Supabase:');
      console.log(sqlCommand);
      
      return false;
    }
    
    console.log('Coluna imagem_capa_url já existe ou erro desconhecido.');
    return true;
  } catch (error) {
    console.error('Erro ao verificar/adicionar coluna:', error);
    return false;
  }
}

export async function atualizarConfiguracaoLoja(config: Partial<ConfiguracaoLoja>): Promise<boolean> {
  try {
    // Verificar se já existe uma configuração
    const { data, error: selectError } = await supabase
      .from('configuracao_loja')
      .select('id')
      .limit(1);
    
    if (selectError) {
      // Se a tabela não existir, retorne falso para que a página administração possa mostrar um erro adequado
      if (selectError.code === '42P01') {
        console.error('A tabela configuracao_loja não existe. Acesse o painel do Supabase para criá-la.');
        return false;
      }
      
      console.error('Erro ao verificar configuração existente:', selectError);
      return false;
    }
    
    if (!data || data.length === 0) {
      // Inserir nova configuração
      const { error: insertError } = await supabase
        .from('configuracao_loja')
        .insert([{
          id: '1', // ID fixo para a única configuração
          nome_loja: config.nome_loja || 'NetFood',
          descricao_loja: config.descricao_loja || 'Seu cardápio digital completo',
          logo_url: config.logo_url || null,
          imagem_capa_url: config.imagem_capa_url || null,
          cor_primaria: config.cor_primaria || '#16a34a',
          cor_secundaria: config.cor_secundaria || '#15803d',
          endereco: config.endereco || null,
          cnpj: config.cnpj || null,
          horario_funcionamento: config.horario_funcionamento || null,
          dias_funcionamento: config.dias_funcionamento || null,
          mostrar_endereco: config.mostrar_endereco !== undefined ? config.mostrar_endereco : false,
          mostrar_cnpj: config.mostrar_cnpj !== undefined ? config.mostrar_cnpj : false,
          mostrar_horario: config.mostrar_horario !== undefined ? config.mostrar_horario : false,
          mostrar_dias: config.mostrar_dias !== undefined ? config.mostrar_dias : false,
          pagamento_carteira: config.pagamento_carteira !== undefined ? config.pagamento_carteira : false,
          pagamento_credito_mastercard: config.pagamento_credito_mastercard !== undefined ? config.pagamento_credito_mastercard : false,
          pagamento_credito_visa: config.pagamento_credito_visa !== undefined ? config.pagamento_credito_visa : false,
          pagamento_credito_elo: config.pagamento_credito_elo !== undefined ? config.pagamento_credito_elo : false,
          pagamento_credito_amex: config.pagamento_credito_amex !== undefined ? config.pagamento_credito_amex : false,
          pagamento_credito_hipercard: config.pagamento_credito_hipercard !== undefined ? config.pagamento_credito_hipercard : false,
          pagamento_debito_mastercard: config.pagamento_debito_mastercard !== undefined ? config.pagamento_debito_mastercard : false,
          pagamento_debito_visa: config.pagamento_debito_visa !== undefined ? config.pagamento_debito_visa : false,
          pagamento_debito_elo: config.pagamento_debito_elo !== undefined ? config.pagamento_debito_elo : false,
          pagamento_pix: config.pagamento_pix !== undefined ? config.pagamento_pix : false,
          pagamento_dinheiro: config.pagamento_dinheiro !== undefined ? config.pagamento_dinheiro : false,
          created_at: new Date().toISOString()
        }]);
      
      if (insertError) {
        console.error('Erro ao inserir nova configuração:', insertError);
        return false;
      }
    } else {
      // Certifique-se de que todos os booleanos estejam definidos corretamente para evitar problemas de tipagem
      const updateData: Partial<ConfiguracaoLoja> = {
        ...config
      };
      
      // Garantir que todos os campos booleanos sejam explicitamente boolean
      if (updateData.mostrar_endereco !== undefined) updateData.mostrar_endereco = !!updateData.mostrar_endereco;
      if (updateData.mostrar_cnpj !== undefined) updateData.mostrar_cnpj = !!updateData.mostrar_cnpj;
      if (updateData.mostrar_horario !== undefined) updateData.mostrar_horario = !!updateData.mostrar_horario;
      if (updateData.mostrar_dias !== undefined) updateData.mostrar_dias = !!updateData.mostrar_dias;
      if (updateData.pagamento_carteira !== undefined) updateData.pagamento_carteira = !!updateData.pagamento_carteira;
      if (updateData.pagamento_credito_mastercard !== undefined) updateData.pagamento_credito_mastercard = !!updateData.pagamento_credito_mastercard;
      if (updateData.pagamento_credito_visa !== undefined) updateData.pagamento_credito_visa = !!updateData.pagamento_credito_visa;
      if (updateData.pagamento_credito_elo !== undefined) updateData.pagamento_credito_elo = !!updateData.pagamento_credito_elo;
      if (updateData.pagamento_credito_amex !== undefined) updateData.pagamento_credito_amex = !!updateData.pagamento_credito_amex;
      if (updateData.pagamento_credito_hipercard !== undefined) updateData.pagamento_credito_hipercard = !!updateData.pagamento_credito_hipercard;
      if (updateData.pagamento_debito_mastercard !== undefined) updateData.pagamento_debito_mastercard = !!updateData.pagamento_debito_mastercard;
      if (updateData.pagamento_debito_visa !== undefined) updateData.pagamento_debito_visa = !!updateData.pagamento_debito_visa;
      if (updateData.pagamento_debito_elo !== undefined) updateData.pagamento_debito_elo = !!updateData.pagamento_debito_elo;
      if (updateData.pagamento_pix !== undefined) updateData.pagamento_pix = !!updateData.pagamento_pix;
      if (updateData.pagamento_dinheiro !== undefined) updateData.pagamento_dinheiro = !!updateData.pagamento_dinheiro;
      
      // Atualizar configuração existente
      const { error: updateError } = await supabase
        .from('configuracao_loja')
        .update(updateData)
        .eq('id', data[0].id);
      
      if (updateError) {
        console.error('Erro ao atualizar configuração:', updateError);
        return false;
      }
    }
    
    return true;
  } catch (err: any) {
    console.error('Erro inesperado ao atualizar configuração da loja:', err instanceof Error ? err.message : String(err));
    return false;
  }
}

// Fim do arquivo 