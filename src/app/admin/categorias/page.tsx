'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Edit, Trash, ArrowUp, ArrowDown, Plus, Loader2 } from 'lucide-react';
import type { Categoria } from '@/lib/supabase';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Verifica autenticação e carrega dados iniciais
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      carregarCategorias();
    }
  }, [user, authLoading, router]);
  
  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('ordem');
      
      if (error) throw error;
      setCategorias(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar categorias:', err.message);
      setError('Não foi possível carregar a lista de categorias.');
    } finally {
      setLoading(false);
    }
  };
  
  const mudarOrdemCategoria = async (id: string, direcao: 'subir' | 'descer') => {
    const categoriaAtual = categorias.find(c => c.id === id);
    if (!categoriaAtual) return;
    
    const indiceAtual = categorias.findIndex(c => c.id === id);
    const indiceAlvo = direcao === 'subir' ? indiceAtual - 1 : indiceAtual + 1;
    
    if (indiceAlvo < 0 || indiceAlvo >= categorias.length) return;
    
    const categoriaAlvo = categorias[indiceAlvo];
    
    setLoading(true);
    try {
      // Troca otimista na UI primeiro
      const novasCategorias = [...categorias];
      novasCategorias[indiceAtual] = { ...categoriaAlvo, ordem: categoriaAtual.ordem };
      novasCategorias[indiceAlvo] = { ...categoriaAtual, ordem: categoriaAlvo.ordem };
      setCategorias(novasCategorias.sort((a, b) => a.ordem - b.ordem));

      // Atualizar no Supabase
      const { error: error1 } = await supabase
        .from('categorias')
        .update({ ordem: categoriaAlvo.ordem })
        .eq('id', categoriaAtual.id);
      if (error1) throw error1;
      
      const { error: error2 } = await supabase
        .from('categorias')
        .update({ ordem: categoriaAtual.ordem })
        .eq('id', categoriaAlvo.id);
      if (error2) throw error2;

    } catch (err: any) {
      console.error('Erro ao mudar ordem da categoria:', err.message);
      // Reverter a mudança otimista em caso de erro
      carregarCategorias(); 
    } finally {
      setLoading(false);
    }
  };
  
  const excluirCategoria = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria? Os produtos associados ficarão sem categoria.')) {
      return;
    }
    
    setLoading(true);
    try {
      const { count, error: countError } = await supabase
        .from('produtos')
        .select('*', { count: 'exact', head: true })
        .eq('categoria_id', id);
      
      if (countError) throw countError;
      
      if (count && count > 0) {
        if (!confirm(`Esta categoria possui ${count} produto(s). Deseja realmente excluir?`)) {
          setLoading(false);
          return;
        }
      }
      
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCategorias(categorias.filter(c => c.id !== id));

    } catch (err: any) {
      console.error('Erro ao excluir categoria:', err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Estados de Carregamento e Erro
  if (authLoading || (loading && categorias.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error && categorias.length === 0) {
    return (
      <div className="p-6 border border-red-300 rounded-md mt-4 bg-red-50 text-red-800">
        <h2 className="text-xl font-bold mb-2">Erro ao Carregar</h2>
        <p>{error}</p>
        <button 
          onClick={carregarCategorias} 
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
        <Link href="/admin/categoria/novo">
          <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
            <Plus className="mr-2 h-4 w-4" /> Nova Categoria
          </button>
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow">
        <div className="flex flex-col space-y-1.5 p-6 border-b border-gray-100">
          <h3 className="font-semibold leading-none tracking-tight">Lista de Categorias</h3>
        </div>
        <div className="p-6">
          {categorias.length === 0 && !loading ? (
            <p className="text-center text-gray-500 py-4">Nenhuma categoria encontrada.</p>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100">
                    <th className="h-10 px-2 text-left align-middle font-medium text-gray-500">Ordem</th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-gray-500">Nome</th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-gray-500">Descrição</th>
                    <th className="h-10 px-2 text-right align-middle font-medium text-gray-500 w-[100px]">Ações</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {loading && categorias.length > 0 && (
                    <tr>
                      <td colSpan={4} className="p-2 align-middle text-center">
                        <Loader2 className="h-5 w-5 animate-spin inline-block text-gray-400" />
                      </td>
                    </tr>
                  )}
                  {categorias.map((categoria, index) => (
                    <tr key={categoria.id} className="border-b transition-colors hover:bg-gray-100/50">
                      <td className="p-2 align-middle">
                        <div className="flex items-center space-x-1">
                          <button
                            className={`h-7 w-7 flex items-center justify-center rounded-md hover:bg-gray-100 ${index === 0 || loading ? 'opacity-30 cursor-not-allowed' : ''}`}
                            onClick={() => mudarOrdemCategoria(categoria.id, 'subir')}
                            disabled={index === 0 || loading}
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            className={`h-7 w-7 flex items-center justify-center rounded-md hover:bg-gray-100 ${index === categorias.length - 1 || loading ? 'opacity-30 cursor-not-allowed' : ''}`}
                            onClick={() => mudarOrdemCategoria(categoria.id, 'descer')}
                            disabled={index === categorias.length - 1 || loading}
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="p-2 align-middle font-medium">{categoria.nome}</td>
                      <td className="p-2 align-middle">{categoria.descricao || '-'}</td>
                      <td className="p-2 align-middle text-right">
                        <Link href={`/admin/categoria/${categoria.id}`} className="mr-2">
                          <button className="h-8 w-8 rounded-md border border-gray-200 bg-transparent hover:bg-gray-100 flex items-center justify-center">
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button
                          className="h-8 w-8 rounded-md bg-red-500 text-white hover:bg-red-600 flex items-center justify-center"
                          onClick={() => excluirCategoria(categoria.id)}
                          disabled={loading}
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 