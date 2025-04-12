'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { GrupoComplemento, Complemento } from '@/lib/supabase';

export default function AdminComplementosPage() {
  const [gruposComplementos, setGruposComplementos] = useState<GrupoComplemento[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormGrupo, setMostrarFormGrupo] = useState(false);
  const [mostrarFormComplemento, setMostrarFormComplemento] = useState(false);
  const [grupoSelecionado, setGrupoSelecionado] = useState<string | null>(null);
  
  const [novoGrupo, setNovoGrupo] = useState({
    nome: '',
    descricao: '',
    min_escolhas: 0,
    max_escolhas: 1
  });
  
  const [novoComplemento, setNovoComplemento] = useState({
    nome: '',
    preco: 0,
    grupo_id: '',
    disponivel: true,
    imagem_url: ''
  });
  
  useEffect(() => {
    carregarDados();
  }, []);
  
  async function carregarDados() {
    setLoading(true);
    
    // Carregar grupos de complementos
    const { data: grupos, error: gruposError } = await supabase
      .from('grupos_complementos')
      .select('*')
      .order('nome');
    
    if (gruposError) {
      console.error('Erro ao carregar grupos:', gruposError);
      setLoading(false);
      return;
    }
    
    // Para cada grupo, carregar seus complementos
    const gruposComComplementos = await Promise.all(
      grupos.map(async (grupo) => {
        const { data: complementos, error: complementosError } = await supabase
          .from('complementos')
          .select('*')
          .eq('grupo_id', grupo.id)
          .order('nome');
        
        if (complementosError) {
          console.error(`Erro ao carregar complementos do grupo ${grupo.nome}:`, complementosError);
          return { ...grupo, complementos: [] };
        }
        
        return { ...grupo, complementos: complementos || [] };
      })
    );
    
    setGruposComplementos(gruposComComplementos);
    setLoading(false);
  }
  
  async function adicionarGrupo(e: React.FormEvent) {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from('grupos_complementos')
      .insert([{
        nome: novoGrupo.nome,
        descricao: novoGrupo.descricao || null,
        min_escolhas: novoGrupo.min_escolhas,
        max_escolhas: novoGrupo.max_escolhas
      }]);
    
    if (error) {
      console.error('Erro ao adicionar grupo:', error);
      return;
    }
    
    setNovoGrupo({ nome: '', descricao: '', min_escolhas: 0, max_escolhas: 1 });
    setMostrarFormGrupo(false);
    carregarDados();
  }
  
  async function adicionarComplemento(e: React.FormEvent) {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from('complementos')
      .insert([{
        nome: novoComplemento.nome,
        preco: novoComplemento.preco,
        grupo_id: novoComplemento.grupo_id,
        disponivel: novoComplemento.disponivel,
        imagem_url: novoComplemento.imagem_url || null
      }]);
    
    if (error) {
      console.error('Erro ao adicionar complemento:', error);
      return;
    }
    
    setNovoComplemento({ nome: '', preco: 0, grupo_id: novoComplemento.grupo_id, disponivel: true, imagem_url: '' });
    setMostrarFormComplemento(false);
    carregarDados();
  }
  
  async function excluirGrupo(id: string) {
    if (!confirm('Tem certeza que deseja excluir este grupo de complementos?')) {
      return;
    }
    
    const { error } = await supabase
      .from('grupos_complementos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir grupo:', error);
      return;
    }
    
    carregarDados();
  }
  
  async function excluirComplemento(id: string) {
    if (!confirm('Tem certeza que deseja excluir este complemento?')) {
      return;
    }
    
    const { error } = await supabase
      .from('complementos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir complemento:', error);
      return;
    }
    
    carregarDados();
  }
  
  function iniciarAdicionarComplemento(grupoId: string) {
    setGrupoSelecionado(grupoId);
    setNovoComplemento({ ...novoComplemento, grupo_id: grupoId });
    setMostrarFormComplemento(true);
  }
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Complementos</h1>
        <Link href="/admin" className="text-green-600 hover:underline flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Admin
        </Link>
      </div>
      
      <div className="mb-6">
        <button 
          onClick={() => setMostrarFormGrupo(!mostrarFormGrupo)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          {mostrarFormGrupo ? 'Cancelar' : 'Adicionar Novo Grupo'}
        </button>
        
        {mostrarFormGrupo && (
          <div className="mt-4 bg-white p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold mb-4">Novo Grupo de Complementos</h2>
            <form onSubmit={adicionarGrupo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Grupo *
                </label>
                <input
                  type="text"
                  required
                  value={novoGrupo.nome}
                  onChange={(e) => setNovoGrupo({ ...novoGrupo, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={novoGrupo.descricao}
                  onChange={(e) => setNovoGrupo({ ...novoGrupo, descricao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mínimo de Escolhas
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={novoGrupo.min_escolhas}
                    onChange={(e) => setNovoGrupo({ ...novoGrupo, min_escolhas: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Máximo de Escolhas
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={novoGrupo.max_escolhas}
                    onChange={(e) => setNovoGrupo({ ...novoGrupo, max_escolhas: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Salvar Grupo
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {mostrarFormComplemento && grupoSelecionado && (
        <div className="mb-6 bg-white p-4 rounded-md shadow">
          <h2 className="text-lg font-semibold mb-4">Novo Complemento</h2>
          <form onSubmit={adicionarComplemento} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Complemento *
              </label>
              <input
                type="text"
                required
                value={novoComplemento.nome}
                onChange={(e) => setNovoComplemento({ ...novoComplemento, nome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço Adicional (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={novoComplemento.preco}
                onChange={(e) => setNovoComplemento({ ...novoComplemento, preco: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem
              </label>
              <input
                type="text"
                value={novoComplemento.imagem_url}
                onChange={(e) => setNovoComplemento({ ...novoComplemento, imagem_url: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">Deixe em branco se não houver imagem</p>
            </div>
            
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="disponivel"
                checked={novoComplemento.disponivel}
                onChange={(e) => setNovoComplemento({ ...novoComplemento, disponivel: e.target.checked })}
                className="h-4 w-4 text-green-600 border-gray-300 rounded"
              />
              <label htmlFor="disponivel" className="ml-2 text-sm text-gray-700">
                Disponível
              </label>
            </div>
            
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setMostrarFormComplemento(false)}
                className="text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Adicionar Complemento
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando complementos...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {gruposComplementos.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Nenhum grupo de complementos cadastrado</p>
            </div>
          ) : (
            gruposComplementos.map((grupo) => (
              <div key={grupo.id} className="bg-white rounded-md shadow overflow-hidden">
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{grupo.nome}</h2>
                    {grupo.descricao && <p className="text-sm text-gray-600 mt-1">{grupo.descricao}</p>}
                    <p className="text-sm text-gray-600 mt-1">
                      Escolhas: {grupo.min_escolhas} a {grupo.max_escolhas}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => iniciarAdicionarComplemento(grupo.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Adicionar Complemento
                    </button>
                    <button
                      onClick={() => excluirGrupo(grupo.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Excluir Grupo
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  {!grupo.complementos || grupo.complementos.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Nenhum complemento cadastrado neste grupo
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-gray-600 text-sm border-b">
                            <th className="py-2 px-4 font-medium">Nome</th>
                            <th className="py-2 px-4 font-medium">Preço</th>
                            <th className="py-2 px-4 font-medium text-center">Imagem</th>
                            <th className="py-2 px-4 font-medium text-center">Disponível</th>
                            <th className="py-2 px-4 font-medium text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grupo.complementos.map((complemento) => (
                            <tr key={complemento.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-4">{complemento.nome}</td>
                              <td className="py-2 px-4">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(complemento.preco)}
                              </td>
                              <td className="py-2 px-4 text-center">
                                {complemento.imagem_url ? (
                                  <span className="text-green-600">✓</span>
                                ) : (
                                  <span className="text-gray-400">✗</span>
                                )}
                              </td>
                              <td className="py-2 px-4 text-center">
                                {complemento.disponivel ? 
                                  <span className="text-green-600">✓</span> : 
                                  <span className="text-red-600">✗</span>}
                              </td>
                              <td className="py-2 px-4 text-right">
                                <button
                                  onClick={() => excluirComplemento(complemento.id)}
                                  className="text-red-600 hover:underline text-sm"
                                >
                                  Excluir
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
            ))
          )}
        </div>
      )}
    </div>
  );
} 