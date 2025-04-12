'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Produto, Categoria } from '@/lib/supabase';
import React from 'react';

export default function EditarProdutoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const produtoId = params.id;
  const isNovoItem = produtoId === 'novo';
  
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  
  const [produto, setProduto] = useState<Partial<Produto>>({
    nome: '',
    descricao: '',
    preco: 0,
    preco_original: null,
    imagem_url: '',
    categoria_id: '',
    disponivel: true,
    destaque: false
  });
  
  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      
      // Carregar categorias para o select
      const { data: categoriasData } = await supabase
        .from('categorias')
        .select('*')
        .order('ordem');
      
      if (categoriasData) {
        setCategorias(categoriasData);
        
        // Definir categoria padrão
        if (!produto.categoria_id && categoriasData.length > 0) {
          setProduto(prev => ({ ...prev, categoria_id: categoriasData[0].id }));
        }
      }
      
      // Se não for novo item, carregar dados do produto
      if (!isNovoItem) {
        const { data: produtoData, error } = await supabase
          .from('produtos')
          .select('*')
          .eq('id', produtoId)
          .single();
        
        if (error) {
          setErro('Produto não encontrado');
        } else if (produtoData) {
          setProduto(produtoData);
        }
      }
      
      setLoading(false);
    }
    
    carregarDados();
  }, [produtoId, isNovoItem]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setProduto(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'preco') {
      // Converter para número
      setProduto(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else if (name === 'preco_original') {
      // Converter para número ou null se vazio
      setProduto(prev => ({ 
        ...prev, 
        [name]: value ? parseFloat(value) : null 
      }));
    } else {
      setProduto(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem('');
    setErro('');
    
    try {
      if (isNovoItem) {
        // Criar novo produto
        const { error } = await supabase
          .from('produtos')
          .insert([produto]);
        
        if (error) throw error;
        setMensagem('Produto criado com sucesso!');
      } else {
        // Atualizar produto existente
        const { error } = await supabase
          .from('produtos')
          .update(produto)
          .eq('id', produtoId);
        
        if (error) throw error;
        setMensagem('Produto atualizado com sucesso!');
      }
      
      // Redirecionar após salvar
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
      
    } catch (error: any) {
      setErro(`Erro ao salvar: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {isNovoItem ? 'Adicionar Produto' : 'Editar Produto'}
        </h1>
        <Link href="/admin" className="text-green-600 hover:underline">
          ← Voltar para o painel
        </Link>
      </div>
      
      {mensagem && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {mensagem}
        </div>
      )}
      
      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {erro}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                required
                value={produto.nome || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$) *
              </label>
              <input
                type="number"
                id="preco"
                name="preco"
                required
                step="0.01"
                min="0"
                value={produto.preco || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="preco_original" className="block text-sm font-medium text-gray-700 mb-1">
                Preço Original (R$) <span className="text-gray-500 text-xs">(para mostrar desconto)</span>
              </label>
              <input
                type="number"
                id="preco_original"
                name="preco_original"
                step="0.01"
                min="0"
                value={produto.preco_original || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                id="categoria_id"
                name="categoria_id"
                required
                value={produto.categoria_id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="imagem_url" className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem
              </label>
              <input
                type="text"
                id="imagem_url"
                name="imagem_url"
                value={produto.imagem_url || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                rows={5}
                value={produto.descricao || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="disponivel"
                name="disponivel"
                checked={produto.disponivel}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="disponivel" className="ml-2 block text-sm text-gray-900">
                Disponível para venda
              </label>
            </div>
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="destaque"
                name="destaque"
                checked={produto.destaque}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="destaque" className="ml-2 block text-sm text-gray-900">
                Produto em destaque
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
          <Link 
            href="/admin"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </Link>
          
          <div className="flex gap-2">
            {!isNovoItem && (
              <Link 
                href={`/admin/produto/${produtoId}/complementos`}
                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50"
              >
                Gerenciar Complementos
              </Link>
            )}
            <button 
              type="submit"
              disabled={salvando}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {salvando ? 'Salvando...' : (isNovoItem ? 'Criar Produto' : 'Salvar Alterações')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 