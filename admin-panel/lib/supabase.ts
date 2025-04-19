import { createClient } from '@supabase/supabase-js';

// Essas variáveis de ambiente devem ser definidas no arquivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Falta configuração do Supabase. Verifique as variáveis de ambiente.');
}

// Criar cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funções de autenticação
export async function fazerLogin(email: string, senha: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });
  
  if (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
  
  return data;
}

export async function fazerLogout() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
  
  return true;
}

export async function verificarSessao() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function obterUsuarioAtual() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Funções auxiliares para produtos
export async function getProdutos() {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('nome');
  
  if (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
  
  return data || [];
}

export async function getProduto(id: string) {
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

export async function saveProduto(produto: any) {
  const { id, ...produtoData } = produto;
  
  if (id) {
    // Atualizar produto existente
    const { error } = await supabase
      .from('produtos')
      .update(produtoData)
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
    
    return id;
  } else {
    // Criar novo produto
    const { data, error } = await supabase
      .from('produtos')
      .insert(produtoData)
      .select();
    
    if (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
    
    return data?.[0]?.id;
  }
}

export async function deleteProduto(id: string) {
  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Erro ao excluir produto:', error);
    throw error;
  }
  
  return true;
}

// Funções auxiliares para categorias
export async function getCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('ordem');
  
  if (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
  
  return data || [];
}

// Funções auxiliares para complementos
export async function getComplementos() {
  const { data, error } = await supabase
    .from('complementos')
    .select('*')
    .order('nome');
  
  if (error) {
    console.error('Erro ao buscar complementos:', error);
    return [];
  }
  
  return data || [];
}

// Funções auxiliares para pedidos
export async function getPedidos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar pedidos:', error);
    return [];
  }
  
  return data || [];
}

// Funções auxiliares para configurações
export async function getConfiguracao() {
  const { data, error } = await supabase
    .from('configuracao')
    .select('*')
    .single();
  
  if (error) {
    console.error('Erro ao buscar configuração:', error);
    return null;
  }
  
  return data;
}

export async function saveConfiguracao(config: any) {
  const { id, ...configData } = config;
  
  // Verificar se já existe uma configuração
  const { data } = await supabase
    .from('configuracao')
    .select('id')
    .limit(1);
  
  if (data && data.length > 0) {
    // Atualizar configuração existente
    const { error } = await supabase
      .from('configuracao')
      .update(configData)
      .eq('id', data[0].id);
    
    if (error) {
      console.error('Erro ao atualizar configuração:', error);
      throw error;
    }
    
    return data[0].id;
  } else {
    // Criar nova configuração
    const { data: newData, error } = await supabase
      .from('configuracao')
      .insert(configData)
      .select();
    
    if (error) {
      console.error('Erro ao criar configuração:', error);
      throw error;
    }
    
    return newData?.[0]?.id;
  }
} 