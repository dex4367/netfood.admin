'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import type { Banner } from '@/lib/supabase';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoBanner, setNovoBanner] = useState({
    image_url: '',
    link_url: '',
    ordem: 0,
    ativo: true
  });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mensagem, setMensagem] = useState('');
  
  useEffect(() => {
    carregarBanners();
  }, []);
  
  async function carregarBanners() {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('ordem', { ascending: true });
      
      if (error) {
        // Verificar se o erro é porque a tabela não existe
        if (error.code === '42P01') {
          setMensagem('A tabela banners ainda não foi criada. Acesse a página "Configurar Tabela Banners" no painel admin.');
          setBanners([]);
          setLoading(false);
          return;
        }
        throw error;
      }
      
      setBanners(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar banners:', error);
      setMensagem(`Erro ao carregar banners: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  }
  
  async function adicionarBanner(e: React.FormEvent) {
    e.preventDefault();
    
    if (!novoBanner.image_url) {
      setMensagem('A URL da imagem é obrigatória');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('banners')
        .insert([novoBanner]);
      
      if (error) throw error;
      
      setMensagem('Banner adicionado com sucesso!');
      setNovoBanner({ image_url: '', link_url: '', ordem: 0, ativo: true });
      setMostrarForm(false);
      carregarBanners();
    } catch (error) {
      console.error('Erro ao adicionar banner:', error);
      setMensagem('Erro ao adicionar banner');
    }
  }
  
  async function excluirBanner(id: string) {
    if (!confirm('Tem certeza que deseja excluir este banner?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMensagem('Banner excluído com sucesso!');
      carregarBanners();
    } catch (error) {
      console.error('Erro ao excluir banner:', error);
      setMensagem('Erro ao excluir banner');
    }
  }
  
  async function alterarStatus(id: string, ativo: boolean) {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ ativo: !ativo })
        .eq('id', id);
      
      if (error) throw error;
      
      carregarBanners();
    } catch (error) {
      console.error('Erro ao alterar status do banner:', error);
    }
  }
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Banners</h1>
        <Link href="/admin" className="text-green-600 hover:underline flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Admin
        </Link>
      </div>
      
      {mensagem && (
        <div className={`p-4 mb-6 rounded-md ${mensagem.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {mensagem}
        </div>
      )}
      
      <div className="mb-6">
        <button 
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          {mostrarForm ? 'Cancelar' : 'Adicionar Novo Banner'}
        </button>
        
        {mostrarForm && (
          <div className="mt-4 bg-white p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold mb-4">Novo Banner</h2>
            <form onSubmit={adicionarBanner} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Imagem *
                </label>
                <input
                  type="text"
                  required
                  value={novoBanner.image_url}
                  onChange={(e) => setNovoBanner({ ...novoBanner, image_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">URL da imagem do banner (recomendado: 1200x400px)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link de Destino
                </label>
                <input
                  type="text"
                  value={novoBanner.link_url}
                  onChange={(e) => setNovoBanner({ ...novoBanner, link_url: e.target.value })}
                  placeholder="https://exemplo.com/pagina"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">Onde o usuário será redirecionado ao clicar (opcional)</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordem
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={novoBanner.ordem}
                    onChange={(e) => setNovoBanner({ ...novoBanner, ordem: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={novoBanner.ativo}
                    onChange={(e) => setNovoBanner({ ...novoBanner, ativo: e.target.checked })}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded"
                  />
                  <label htmlFor="ativo" className="ml-2 text-sm text-gray-700">
                    Banner ativo
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Salvar Banner
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando banners...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {banners.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Nenhum banner cadastrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-600 text-sm border-b">
                    <th className="py-2 px-4 font-medium">Imagem</th>
                    <th className="py-2 px-4 font-medium">Link</th>
                    <th className="py-2 px-4 font-medium text-center">Ordem</th>
                    <th className="py-2 px-4 font-medium text-center">Status</th>
                    <th className="py-2 px-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((banner) => (
                    <tr key={banner.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-4">
                        <div className="relative w-40 h-16 rounded overflow-hidden">
                          <Image
                            src={banner.image_url}
                            alt="Banner"
                            fill
                            className="object-cover"
                            sizes="160px"
                          />
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        {banner.link_url ? (
                          <span className="text-blue-600 hover:underline text-sm">{banner.link_url}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">Sem link</span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-center">{banner.ordem}</td>
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={() => alterarStatus(banner.id, banner.ativo)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            banner.ativo 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {banner.ativo ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <button
                          onClick={() => excluirBanner(banner.id)}
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
      )}
    </div>
  );
} 