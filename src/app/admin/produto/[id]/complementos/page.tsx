'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Produto, GrupoComplemento } from '@/lib/supabase';
import React from 'react';

export default function ProdutoComplementosPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const produtoId = params.id;
  
  const [produto, setProduto] = useState<Produto | null>(null);
  const [gruposDisponiveis, setGruposDisponiveis] = useState<GrupoComplemento[]>([]);
  const [gruposAssociados, setGruposAssociados] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  
  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      
      // Carregar dados do produto
      const { data: produtoData, error: produtoError } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', produtoId)
        .single();
      
      if (produtoError) {
        console.error('Erro ao carregar produto:', produtoError);
        setLoading(false);
        return;
      }
      
      setProduto(produtoData);
      
      // Carregar todos os grupos de complementos
      const { data: gruposData, error: gruposError } = await supabase
        .from('grupos_complementos')
        .select('*')
        .order('nome');
      
      if (gruposError) {
        console.error('Erro ao carregar grupos:', gruposError);
        setLoading(false);
        return;
      }
      
      setGruposDisponiveis(gruposData || []);
      
      // Carregar grupos já associados ao produto
      const { data: associacoesData, error: associacoesError } = await supabase
        .from('produtos_grupos_complementos')
        .select('grupo_id')
        .eq('produto_id', produtoId);
      
      if (associacoesError) {
        console.error('Erro ao carregar associações:', associacoesError);
        setLoading(false);
        return;
      }
      
      const idsAssociados = associacoesData.map(item => item.grupo_id);
      setGruposAssociados(idsAssociados);
      
      setLoading(false);
    }
    
    carregarDados();
  }, [produtoId]);
  
  const handleToggleGrupo = (grupoId: string) => {
    setGruposAssociados(prev => {
      if (prev.includes(grupoId)) {
        return prev.filter(id => id !== grupoId);
      } else {
        return [...prev, grupoId];
      }
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem('');
    
    try {
      // Primeiro remover todas as associações existentes
      const { error: deleteError } = await supabase
        .from('produtos_grupos_complementos')
        .delete()
        .eq('produto_id', produtoId);
      
      if (deleteError) throw deleteError;
      
      // Adicionar as novas associações
      if (gruposAssociados.length > 0) {
        const novasAssociacoes = gruposAssociados.map(grupoId => ({
          produto_id: produtoId,
          grupo_id: grupoId
        }));
        
        const { error: insertError } = await supabase
          .from('produtos_grupos_complementos')
          .insert(novasAssociacoes);
        
        if (insertError) throw insertError;
      }
      
      setMensagem('Complementos associados com sucesso!');
      setTimeout(() => {
        router.push(`/admin/produto/${produtoId}`);
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar associações:', error);
      setMensagem('Erro ao salvar as associações.');
    } finally {
      setSalvando(false);
    }
  };
  
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!produto) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <p className="text-red-500">Produto não encontrado</p>
          <Link href="/admin" className="text-green-600 hover:underline mt-2 inline-block">
            Voltar para o painel administrativo
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Complementos: {produto.nome}
        </h1>
        <Link 
          href={`/admin/produto/${produtoId}`}
          className="text-green-600 hover:underline flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para o produto
        </Link>
      </div>
      
      {mensagem && (
        <div className={`p-4 mb-6 rounded-md ${mensagem.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {mensagem}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Selecione os grupos de complementos</h2>
          
          {gruposDisponiveis.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-md">
              <p className="text-gray-500">Nenhum grupo de complementos disponível</p>
              <Link 
                href="/admin/complementos" 
                className="text-green-600 hover:underline mt-2 inline-block"
              >
                Criar grupos de complementos
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {gruposDisponiveis.map(grupo => (
                <div 
                  key={grupo.id} 
                  className={`p-4 border rounded-md cursor-pointer transition-colors ${
                    gruposAssociados.includes(grupo.id) 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleToggleGrupo(grupo.id)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={gruposAssociados.includes(grupo.id)}
                      onChange={() => {}}
                      className="h-5 w-5 text-green-600 rounded"
                    />
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-800">{grupo.nome}</h3>
                      {grupo.descricao && (
                        <p className="text-sm text-gray-600 mt-1">{grupo.descricao}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Escolhas: {grupo.min_escolhas} a {grupo.max_escolhas}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <Link
            href={`/admin/produto/${produtoId}`}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={salvando}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            {salvando ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
} 