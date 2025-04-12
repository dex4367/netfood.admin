'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Categoria } from '@/lib/supabase';
import React from 'react';

export default function EditarCategoriaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const categoriaId = params.id;
  const isNovoItem = categoriaId === 'nova';
  
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  
  const [categoria, setCategoria] = useState<Partial<Categoria>>({
    nome: '',
    descricao: '',
    ordem: 0
  });
  
  useEffect(() => {
    async function carregarDados() {
      if (isNovoItem) {
        // Obter a última ordem para sugerir a próxima
        const { data } = await supabase
          .from('categorias')
          .select('ordem')
          .order('ordem', { ascending: false })
          .limit(1);
        
        if (data && data.length > 0) {
          setCategoria(prev => ({ ...prev, ordem: data[0].ordem + 1 }));
        }
        
        setLoading(false);
        return;
      }
      
      // Carregar dados da categoria existente
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('id', categoriaId)
        .single();
      
      if (error) {
        setErro('Categoria não encontrada');
      } else if (data) {
        setCategoria(data);
      }
      
      setLoading(false);
    }
    
    carregarDados();
  }, [categoriaId, isNovoItem]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'ordem' && type === 'number') {
      setCategoria(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setCategoria(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem('');
    setErro('');
    
    try {
      if (isNovoItem) {
        // Criar nova categoria
        const { error } = await supabase
          .from('categorias')
          .insert([categoria]);
        
        if (error) throw error;
        setMensagem('Categoria criada com sucesso!');
      } else {
        // Atualizar categoria existente
        const { error } = await supabase
          .from('categorias')
          .update(categoria)
          .eq('id', categoriaId);
        
        if (error) throw error;
        setMensagem('Categoria atualizada com sucesso!');
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
          {isNovoItem ? 'Adicionar Categoria' : 'Editar Categoria'}
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
              value={categoria.nome || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              rows={3}
              value={categoria.descricao || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label htmlFor="ordem" className="block text-sm font-medium text-gray-700 mb-1">
              Ordem *
            </label>
            <input
              type="number"
              id="ordem"
              name="ordem"
              required
              min="0"
              value={categoria.ordem || 0}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              A ordem define a posição da categoria no menu (menor = primeiro)
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={salvando}
            className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${
              salvando ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {salvando ? 'Salvando...' : 'Salvar Categoria'}
          </button>
        </div>
      </form>
    </div>
  );
} 