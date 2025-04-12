import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam as variáveis de ambiente do Supabase');
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