'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaArrowLeft, FaPlus, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Image from 'next/image';
import type { Produto } from '@/lib/supabase';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<{[key: string]: string}>({});
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Redirecionamento se não estiver autenticado
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      carregarDados();
    }
  }, [user, authLoading, router]);
  
  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar categorias primeiro para exibir nomes
      const { data: catData, error: catError } = await supabase
        .from('categorias')
        .select('id, nome');
      
      if (catError) {
        throw catError;
      }
      
      // Criar um objeto de mapeamento id -> nome
      const categoriasMap: {[key: string]: string} = {};
      catData?.forEach(cat => {
        categoriasMap[cat.id] = cat.nome;
      });
      
      setCategorias(categoriasMap);
      
      // Buscar produtos
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome');
      
      if (error) {
        throw error;
      }
      
      setProdutos(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err.message);
      setError('Não foi possível carregar a lista de produtos.');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleDisponibilidade = async (id: string, disponivel: boolean) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('produtos')
        .update({ disponivel: !disponivel })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Atualizar estado local
      setProdutos(produtos.map(p => 
        p.id === id ? { ...p, disponivel: !disponivel } : p
      ));
    } catch (err: any) {
      console.error('Erro ao atualizar disponibilidade:', err.message);
      alert('Erro ao atualizar disponibilidade do produto.');
    } finally {
      setLoading(false);
    }
  };
  
  const excluirProduto = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Remover do estado local
      setProdutos(produtos.filter(p => p.id !== id));
    } catch (err: any) {
      console.error('Erro ao excluir produto:', err.message);
      alert('Não foi possível excluir o produto.');
    } finally {
      setLoading(false);
    }
  };
  
  // Formatar preço para exibição
  const formatarPreco = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Produtos</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/produto/novo" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center">
              <FaPlus className="mr-2" /> Novo Produto
            </Link>
            <Link href="/admin" className="flex items-center text-blue-600 hover:text-blue-800">
              <FaArrowLeft className="mr-2" /> Voltar para o Dashboard
            </Link>
          </div>
        </div>
        
        {/* Lista de produtos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-700">Produtos do Cardápio</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Carregando produtos...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : produtos.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhum produto encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Disponível
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destaque
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {produtos.map((produto) => (
                    <tr key={produto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {produto.imagem_url ? (
                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                              <Image 
                                src={produto.imagem_url} 
                                alt={produto.nome}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full mr-3" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{produto.nome}</div>
                            {produto.descricao && (
                              <div className="text-sm text-gray-500 max-w-md truncate">
                                {produto.descricao.length > 50 
                                  ? `${produto.descricao.substring(0, 50)}...` 
                                  : produto.descricao}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {categorias[produto.categoria_id] || 'Sem categoria'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatarPreco(produto.preco)}
                        </div>
                        {produto.preco_original && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatarPreco(produto.preco_original)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => toggleDisponibilidade(produto.id, produto.disponivel)}
                          className={`text-lg ${produto.disponivel ? 'text-green-500' : 'text-gray-400'}`}
                          title={produto.disponivel ? 'Disponível' : 'Indisponível'}
                        >
                          {produto.disponivel ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${produto.destaque ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {produto.destaque ? 'Sim' : 'Não'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/admin/produto/${produto.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => excluirProduto(produto.id)}
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