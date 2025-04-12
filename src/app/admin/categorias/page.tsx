'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaArrowLeft, FaPlus, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import type { Categoria } from '@/lib/supabase';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Redirecionamento se não estiver autenticado
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
      
      if (error) {
        throw error;
      }
      
      setCategorias(data || []);
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
    
    try {
      setLoading(true);
      
      // Encontrar a categoria adjacente
      const indiceAtual = categorias.findIndex(c => c.id === id);
      const indiceAlvo = direcao === 'subir' ? indiceAtual - 1 : indiceAtual + 1;
      
      // Verificar se o índice é válido
      if (indiceAlvo < 0 || indiceAlvo >= categorias.length) {
        return;
      }
      
      const categoriaAlvo = categorias[indiceAlvo];
      
      // Trocar as ordens
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
      
      // Recarregar as categorias para atualizar a ordem
      await carregarCategorias();
    } catch (err: any) {
      console.error('Erro ao mudar ordem da categoria:', err.message);
      alert('Erro ao alterar a ordem da categoria.');
    } finally {
      setLoading(false);
    }
  };
  
  const excluirCategoria = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria? Todos os produtos associados ficarão sem categoria.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Verificar se há produtos nesta categoria
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
      
      if (error) {
        throw error;
      }
      
      // Remover do estado local
      setCategorias(categorias.filter(c => c.id !== id));
    } catch (err: any) {
      console.error('Erro ao excluir categoria:', err.message);
      alert('Não foi possível excluir a categoria.');
    } finally {
      setLoading(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Categorias</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/categoria/novo" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center">
              <FaPlus className="mr-2" /> Nova Categoria
            </Link>
            <Link href="/admin" className="flex items-center text-teal-600 hover:text-teal-800">
              <FaArrowLeft className="mr-2" /> Voltar para o Dashboard
            </Link>
          </div>
        </div>
        
        {/* Lista de categorias */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-700">Categorias do Cardápio</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              <p className="mt-2 text-gray-500">Carregando categorias...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : categorias.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhuma categoria encontrada
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ordem
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categorias.map((categoria, index) => (
                    <tr key={categoria.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-gray-900 mr-3">{categoria.ordem}</span>
                          <div className="flex flex-col">
                            <button 
                              onClick={() => mudarOrdemCategoria(categoria.id, 'subir')}
                              disabled={index === 0}
                              className={`text-sm ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                              <FaArrowUp />
                            </button>
                            <button 
                              onClick={() => mudarOrdemCategoria(categoria.id, 'descer')}
                              disabled={index === categorias.length - 1}
                              className={`text-sm mt-1 ${index === categorias.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                              <FaArrowDown />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{categoria.nome}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-md">
                          {categoria.descricao || 'Sem descrição'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/admin/categoria/${categoria.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => excluirCategoria(categoria.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
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