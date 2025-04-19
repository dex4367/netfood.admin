'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase, ConfiguracaoLoja, atualizarConfiguracaoLoja } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Componente para exibir opções de cartão de crédito/débito
interface CreditCardOptionProps {
  id: string;
  brand: string;
  logo?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function CreditCardOption({ id, brand, logo, checked, onChange }: CreditCardOptionProps) {
  return (
    <div className={`border rounded-lg p-4 ${checked ? 'bg-green-50 border-green-300' : 'bg-gray-50 hover:bg-white'} transition-colors`}>
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <div className="ml-3 flex items-center">
          {logo ? (
            <div className="h-6 w-10 mr-2 relative flex items-center justify-center bg-white rounded border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          ) : null}
          <span className="text-sm font-medium text-gray-700">{brand}</span>
        </div>
      </label>
    </div>
  );
}

export default function ConfiguracaoLojaPage() {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoLoja>({
    id: '1',
    nome_loja: 'NetFood',
    descricao_loja: 'Seu cardápio digital completo',
    logo_url: null,
    imagem_capa_url: null,
    cor_primaria: '#16a34a',
    cor_secundaria: '#15803d',
    created_at: new Date().toISOString(),
    
    // Informações da loja
    endereco: null,
    cnpj: null,
    horario_funcionamento: null,
    dias_funcionamento: null,
    mostrar_endereco: false,
    mostrar_cnpj: false,
    mostrar_horario: false,
    mostrar_dias: false,
    
    // Opções de pagamento
    pagamento_carteira: false,
    pagamento_credito_mastercard: false,
    pagamento_credito_visa: false,
    pagamento_credito_elo: false,
    pagamento_credito_amex: false,
    pagamento_credito_hipercard: false,
    pagamento_debito_mastercard: false,
    pagamento_debito_visa: false,
    pagamento_debito_elo: false,
    pagamento_pix: false,
    pagamento_dinheiro: false
  });
  
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [capaPreview, setCapaPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('geral');
  
  // Array de abas para facilitar a navegação
  const tabs = [
    { id: 'geral', nome: 'Geral', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'informacoes', nome: 'Informações da Loja', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'pagamentos', nome: 'Métodos de Pagamento', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  ];
  
  useEffect(() => {
    async function carregarConfiguracao() {
      setLoading(true);
      try {
        // Modificando para buscar todos os registros e usar o primeiro
        const { data, error } = await supabase
          .from('configuracao_loja')
          .select('*')
          .limit(1); // Limita a um resultado

        if (error) {
          console.error('Erro ao buscar configuração da loja:', error);
          setLoading(false);
          return;
        }

        // Se não existir configuração, usa a padrão (já definida no state)
        if (data && data.length > 0) {
          setConfiguracao(data[0]);
          if (data[0].logo_url) {
            setLogoPreview(data[0].logo_url);
          }
          if (data[0].imagem_capa_url) {
            setCapaPreview(data[0].imagem_capa_url);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar configuração da loja:', err);
      }
      setLoading(false);
    }
    
    carregarConfiguracao();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfiguracao(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verifica se é uma imagem
    if (!file.type.startsWith('image/')) {
      setErro(true);
      setMensagem('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Limite de tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErro(true);
      setMensagem('A imagem deve ter no máximo 2MB.');
      return;
    }

    // Criar uma URL temporária para preview
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);

    // Preparar para upload
    try {
      setSalvando(true);
      
      // Nome do arquivo único usando timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Gerar URL pública
      const { data: urlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      // Atualizar configuração com URL da logo
      setConfiguracao(prev => ({
        ...prev,
        logo_url: urlData.publicUrl
      }));
      
      setMensagem('Logo carregada com sucesso!');
      setErro(false);
    } catch (error) {
      console.error('Erro ao fazer upload da logo:', error);
      setErro(true);
      setMensagem('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };
  
  const handleCapaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErro(true);
      setMensagem('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // Limite de 5MB para capa
      setErro(true);
      setMensagem('A imagem da capa deve ter no máximo 5MB.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCapaPreview(objectUrl);

    try {
      setSalvando(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `capa_${Date.now()}.${fileExt}`;
      const filePath = `capas/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('public') // Bucket público
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      setConfiguracao(prev => ({
        ...prev,
        imagem_capa_url: urlData.publicUrl
      }));
      
      setMensagem('Imagem de capa carregada com sucesso!');
      setErro(false);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem de capa:', error);
      setErro(true);
      setMensagem('Erro ao fazer upload da imagem de capa. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro(false);
    setMensagem('');
    
    try {
      // Enviar configuração para o servidor
      const sucesso = await atualizarConfiguracaoLoja({
        ...configuracao
      });
      
      if (sucesso) {
        setMensagem('Configurações salvas com sucesso!');
      } else {
        setErro(true);
        setMensagem('Erro ao salvar as configurações. Verifique se a tabela configuracao_loja existe no Supabase.');
      }
    } catch (error: any) {
      // Melhor log do erro
      console.error('Erro detalhado ao salvar:', error);
      setErro(true);
      // Exibir mensagem de erro mais específica se possível
      setMensagem(`Erro ao processar a requisição: ${error instanceof Error ? error.message : String(error)}`);
      
      // Mostrar na interface que o usuário precisa criar a tabela no Supabase
      const errorElement = document.createElement('div');
      errorElement.className = 'mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-md';
      errorElement.innerHTML = `
        <p class="font-bold">Você precisa criar a tabela no Supabase:</p>
        <p class="mt-2">1. Acesse o painel de administração do Supabase</p>
        <p>2. Vá para a seção SQL Editor</p>
        <p>3. Cole e execute o seguinte código SQL:</p>
        <pre class="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
CREATE TABLE IF NOT EXISTS configuracao_loja (
  id text primary key,
  nome_loja text not null,
  descricao_loja text,
  logo_url text,
  imagem_capa_url text,
  cor_primaria text,
  cor_secundaria text,
  endereco text,
  cnpj text,
  horario_funcionamento text,
  dias_funcionamento text,
  mostrar_endereco boolean default false,
  mostrar_cnpj boolean default false,
  mostrar_horario boolean default false,
  mostrar_dias boolean default false,
  pagamento_carteira boolean default false,
  pagamento_credito_mastercard boolean default false,
  pagamento_credito_visa boolean default false,
  pagamento_credito_elo boolean default false,
  pagamento_credito_amex boolean default false,
  pagamento_credito_hipercard boolean default false,
  pagamento_debito_mastercard boolean default false,
  pagamento_debito_visa boolean default false,
  pagamento_debito_elo boolean default false,
  pagamento_pix boolean default false,
  pagamento_dinheiro boolean default false,
  created_at timestamp with time zone default now()
);
        </pre>
      `;
      
      // Inserir elemento após a mensagem de erro
      setTimeout(() => {
        const mensagemElement = document.querySelector('[role="alert"]');
        if (mensagemElement && mensagemElement.parentNode) {
          mensagemElement.parentNode.insertBefore(errorElement, mensagemElement.nextSibling);
        }
      }, 100);
    } finally {
      setSalvando(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header com gradiente e navegação */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Configurações da Loja</h1>
              <p className="text-green-100 mt-1">Personalize a aparência e as informações do seu estabelecimento</p>
            </div>
            <Link href="/admin" className="flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
              Voltar para o Dashboard
        </Link>
          </div>
        </div>
      </div>
      
      {/* Mensagem de status */}
      {mensagem && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div 
            role="alert"
            className={`p-4 rounded-lg shadow-sm ${
              erro ? 'bg-red-100 text-red-700 border-l-4 border-red-500' : 'bg-green-100 text-green-700 border-l-4 border-green-500'
            }`}
          >
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 mr-3 ${erro ? 'text-red-500' : 'text-green-500'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={erro ? 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : 'M5 13l4 4L19 7'} 
                />
              </svg>
              <span className="font-medium">{mensagem}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-3"></div>
            <p className="text-gray-500">Carregando configurações...</p>
              </div>
          </div>
        ) : (
            <form onSubmit={handleSubmit}>
              {/* Cabeçalho com navegação de abas */}
            <div className="border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8">
                  <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                <button
                        key={tab.id}
                  type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                          ${activeTab === tab.id 
                      ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                          transition-colors duration-200
                        `}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`mr-2 h-5 w-5 ${activeTab === tab.id ? 'text-green-500' : 'text-gray-400'}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                        </svg>
                        {tab.nome}
                </button>
                    ))}
              </nav>
                </div>
            </div>

              {/* Conteúdo das abas */}
              <div className="px-4 py-6 sm:px-6 lg:px-8">
                {/* Aba de configurações gerais */}
            {activeTab === 'geral' && (
                  <div className="space-y-8">
                    {/* Identidade da loja */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
                        <h3 className="text-lg font-medium text-white">Identidade da Loja</h3>
                      </div>
                      
                      <div className="p-5 divide-y divide-gray-200">
                        {/* Nome da loja */}
                        <div className="pb-5">
                  <label htmlFor="nome_loja" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Loja
                  </label>
                  <input
                    type="text"
                    id="nome_loja"
                    name="nome_loja"
                    value={configuracao.nome_loja}
                    onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Este nome aparecerá no cabeçalho e no rodapé do site.</p>
                </div>
                
                        {/* Descrição da loja */}
                        <div className="py-5">
                  <label htmlFor="descricao_loja" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição da Loja
                  </label>
                  <textarea
                    id="descricao_loja"
                    name="descricao_loja"
                    value={configuracao.descricao_loja || ''}
                    onChange={handleChange}
                    rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                  <p className="mt-1 text-xs text-gray-500">Uma breve descrição que aparecerá no cabeçalho do site.</p>
                        </div>
                      </div>
                </div>
                
                    {/* Logo e imagem de capa */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3">
                        <h3 className="text-lg font-medium text-white">Identidade Visual</h3>
                      </div>
                      
                      <div className="p-5 space-y-6">
                        {/* Logo da loja */}
                <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                    Logo da Loja
                  </label>
                  
                          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                    <div className="flex-shrink-0">
                              <div className="relative w-40 h-40 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
                        {logoPreview ? (
                          <Image 
                            src={logoPreview} 
                            alt="Logo preview" 
                            fill 
                            className="object-contain" 
                          />
                        ) : (
                                  <div className="text-center p-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-400 text-sm block">
                                      Nenhuma logo<br/>selecionada
                          </span>
                                  </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo"
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
                      >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                                </svg>
                                Selecionar Logo
                      </label>
                      
                              <p className="mt-2 text-sm text-gray-500">
                                Tamanho recomendado: 200x60 pixels.<br/>
                                Formatos aceitos: JPG, PNG, SVG. Tamanho máximo: 2MB.
                      </p>
                      
                      {logoPreview && configuracao.logo_url && (
                        <button
                          type="button"
                          onClick={() => {
                            setLogoPreview(null);
                            setConfiguracao(prev => ({ ...prev, logo_url: null }));
                          }}
                                  className="mt-3 inline-flex items-center px-3 py-1 border border-red-200 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                          Remover Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                        {/* Imagem de capa */}
                        <div className="pt-6 border-t border-gray-200">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Imagem de Capa (Banner do Cabeçalho)
                          </label>
                          
                          <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50 mb-4">
                            <div className="aspect-[3/1] w-full relative">
                              {capaPreview ? (
                                <Image 
                                  src={capaPreview} 
                                  alt="Capa preview" 
                                  fill 
                                  className="object-cover" 
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center p-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-400 text-sm block">
                                      Nenhuma imagem de capa selecionada
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-3">
                            <input
                              type="file"
                              id="imagem_capa"
                              accept="image/*"
                              onChange={handleCapaChange}
                              className="hidden"
                            />
                            <label
                              htmlFor="imagem_capa"
                              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                              </svg>
                              Selecionar Imagem de Capa
                            </label>
                            
                            {capaPreview && configuracao.imagem_capa_url && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCapaPreview(null);
                                  setConfiguracao(prev => ({ ...prev, imagem_capa_url: null }));
                                }}
                                className="inline-flex items-center px-3 py-2 border border-red-200 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remover Imagem de Capa
                              </button>
                            )}
                          </div>
                          
                          <p className="mt-2 text-sm text-gray-500">
                            Tamanho recomendado: 1200x400 pixels. Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Cores do tema */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3">
                        <h3 className="text-lg font-medium text-white">Cores do Tema</h3>
                      </div>
                      
                      <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                            <label htmlFor="cor_primaria" className="block text-sm font-medium text-gray-700 mb-2">
                      Cor Primária
                    </label>
                            <div className="flex items-center gap-3">
                              <div className="relative">
                      <input
                        type="color"
                        id="cor_primaria"
                        name="cor_primaria"
                        value={configuracao.cor_primaria}
                        onChange={handleChange}
                                  className="sr-only"
                                />
                                <div 
                                  className="h-10 w-10 rounded-md cursor-pointer border border-gray-300 shadow-sm overflow-hidden"
                                  style={{ backgroundColor: configuracao.cor_primaria }}
                                  onClick={() => document.getElementById('cor_primaria')?.click()}
                                ></div>
                              </div>
                      <input
                        type="text"
                        value={configuracao.cor_primaria}
                        onChange={handleChange}
                        name="cor_primaria"
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      />
                    </div>
                            <p className="mt-1 text-xs text-gray-500">Cor principal do tema (cabeçalho, botões, links).</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {['#16a34a', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#64748b'].map(color => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => setConfiguracao(prev => ({ ...prev, cor_primaria: color }))}
                                  className="h-6 w-6 rounded-full overflow-hidden border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                  </div>
                  
                  <div>
                            <label htmlFor="cor_secundaria" className="block text-sm font-medium text-gray-700 mb-2">
                      Cor Secundária
                    </label>
                            <div className="flex items-center gap-3">
                              <div className="relative">
                      <input
                        type="color"
                        id="cor_secundaria"
                        name="cor_secundaria"
                        value={configuracao.cor_secundaria}
                        onChange={handleChange}
                                  className="sr-only"
                                />
                                <div 
                                  className="h-10 w-10 rounded-md cursor-pointer border border-gray-300 shadow-sm overflow-hidden"
                                  style={{ backgroundColor: configuracao.cor_secundaria }}
                                  onClick={() => document.getElementById('cor_secundaria')?.click()}
                                ></div>
                              </div>
                      <input
                        type="text"
                        value={configuracao.cor_secundaria}
                        onChange={handleChange}
                        name="cor_secundaria"
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      />
                    </div>
                            <p className="mt-1 text-xs text-gray-500">Cor secundária (botões hover, detalhes, destaques).</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {['#15803d', '#0369a1', '#7c3aed', '#d97706', '#dc2626', '#475569'].map(color => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => setConfiguracao(prev => ({ ...prev, cor_secundaria: color }))}
                                  className="h-6 w-6 rounded-full overflow-hidden border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Previsualização das cores */}
                        <div className="mt-6 border rounded-md overflow-hidden">
                          <div className="text-sm font-medium text-gray-500 border-b px-3 py-2 bg-gray-50">
                            Pré-visualização
                          </div>
                          <div className="p-4 space-y-3">
                            <div 
                              className="rounded-md p-3 text-white flex items-center justify-between"
                              style={{ backgroundColor: configuracao.cor_primaria }}
                            >
                              <span>Cabeçalho e elementos principais</span>
                              <button 
                                className="px-3 py-1 rounded-md text-sm font-medium"
                                style={{ backgroundColor: configuracao.cor_secundaria }}
                              >
                                Botão
                              </button>
                            </div>
                            <div className="p-3 border rounded-md">
                              <div className="flex items-center mb-2">
                                <div 
                                  className="h-5 w-5 rounded-full mr-2"
                                  style={{ backgroundColor: configuracao.cor_primaria }}
                                ></div>
                                <span 
                                  className="font-medium"
                                  style={{ color: configuracao.cor_primaria }}
                                >
                                  Nome do produto
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">Descrição do produto</div>
                              <div 
                                className="mt-2 text-sm font-medium"
                                style={{ color: configuracao.cor_secundaria }}
                              >
                                Mais detalhes
                              </div>
                            </div>
                          </div>
                        </div>
                  </div>
                </div>
              </div>
            )}

                {/* Aba de informações da loja */}
            {activeTab === 'informacoes' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">
                        Endereço da Loja
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="mostrar_endereco"
                          name="mostrar_endereco"
                          checked={configuracao.mostrar_endereco}
                          onChange={(e) => 
                            setConfiguracao(prev => ({ 
                              ...prev, 
                              mostrar_endereco: e.target.checked 
                            }))
                          }
                          className="h-4 w-4 text-green-600 rounded border-gray-300"
                        />
                        <label htmlFor="mostrar_endereco" className="ml-2 text-xs text-gray-500">
                          Mostrar no site
                        </label>
                      </div>
                    </div>
                    <textarea
                      id="endereco"
                      name="endereco"
                      value={configuracao.endereco || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
                        CNPJ
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="mostrar_cnpj"
                          name="mostrar_cnpj"
                          checked={configuracao.mostrar_cnpj}
                          onChange={(e) => 
                            setConfiguracao(prev => ({ 
                              ...prev, 
                              mostrar_cnpj: e.target.checked 
                            }))
                          }
                          className="h-4 w-4 text-green-600 rounded border-gray-300"
                        />
                        <label htmlFor="mostrar_cnpj" className="ml-2 text-xs text-gray-500">
                          Mostrar no site
                        </label>
                      </div>
                    </div>
                    <input
                      type="text"
                      id="cnpj"
                      name="cnpj"
                      value={configuracao.cnpj || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="horario_funcionamento" className="block text-sm font-medium text-gray-700 mb-1">
                        Horário de Funcionamento
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="mostrar_horario"
                          name="mostrar_horario"
                          checked={configuracao.mostrar_horario}
                          onChange={(e) => 
                            setConfiguracao(prev => ({ 
                              ...prev, 
                              mostrar_horario: e.target.checked 
                            }))
                          }
                          className="h-4 w-4 text-green-600 rounded border-gray-300"
                        />
                        <label htmlFor="mostrar_horario" className="ml-2 text-xs text-gray-500">
                          Mostrar no site
                        </label>
                      </div>
                    </div>
                    <input
                      type="text"
                      id="horario_funcionamento"
                      name="horario_funcionamento"
                      value={configuracao.horario_funcionamento || ''}
                      onChange={handleChange}
                          placeholder="Ex: 18:00 - 23:00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                        <p className="mt-1 text-xs text-gray-500">
                          Use o formato "HH:MM - HH:MM" (ex: 18:00 - 23:00) para que o status de aberto/fechado funcione corretamente.
                        </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="dias_funcionamento" className="block text-sm font-medium text-gray-700 mb-1">
                        Dias de Funcionamento
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="mostrar_dias"
                          name="mostrar_dias"
                          checked={configuracao.mostrar_dias}
                          onChange={(e) => 
                            setConfiguracao(prev => ({ 
                              ...prev, 
                              mostrar_dias: e.target.checked 
                            }))
                          }
                          className="h-4 w-4 text-green-600 rounded border-gray-300"
                        />
                        <label htmlFor="mostrar_dias" className="ml-2 text-xs text-gray-500">
                          Mostrar no site
                        </label>
                      </div>
                    </div>
                    <input
                      type="text"
                      id="dias_funcionamento"
                      name="dias_funcionamento"
                      value={configuracao.dias_funcionamento || ''}
                      onChange={handleChange}
                          placeholder="Ex: Seg, Ter, Qua, Qui, Sex, Sab, Dom"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                        <p className="mt-1 text-xs text-gray-500">
                          Use as abreviações Seg, Ter, Qua, Qui, Sex, Sab, Dom, separadas por vírgula.
                        </p>
                  </div>
                </div>
              </div>
            )}

                {/* Aba de métodos de pagamento */}
            {activeTab === 'pagamentos' && (
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-md shadow-sm text-white p-5">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold">Métodos de Pagamento</h3>
                          <p className="mt-1 text-sm text-indigo-100">
                            Selecione quais métodos de pagamento seu estabelecimento aceita. Estes serão exibidos para o cliente no checkout.
                          </p>
                        </div>
                      </div>
                    </div>

                {/* Carteira Digital */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="flex items-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <h3 className="text-md font-medium text-white">Saldo da Carteira</h3>
                      </div>
                      <div className="p-5">
                        <label className="relative flex items-start cursor-pointer">
                          <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="pagamento_carteira"
                      name="pagamento_carteira"
                      checked={configuracao.pagamento_carteira}
                              onChange={(e) => setConfiguracao(prev => ({ ...prev, pagamento_carteira: e.target.checked }))}
                              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <span className="font-medium text-gray-700">Aceitar pagamento com saldo da carteira</span>
                            <p className="text-gray-500 mt-1">Os clientes poderão utilizar o saldo de créditos em sua carteira digital para realizar pagamentos.</p>
                          </div>
                    </label>
                  </div>
                </div>

                {/* Cartões de Crédito */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="flex items-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <h3 className="text-md font-medium text-white">Cartões de Crédito</h3>
                      </div>
                      
                      <div className="p-5">
                        <p className="text-sm text-gray-500 mb-4">Selecione as bandeiras de cartão de crédito aceitas pela sua loja.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <CreditCardOption
                        id="pagamento_credito_mastercard"
                            brand="Mastercard"
                            logo="/images/mastercard.svg"
                        checked={configuracao.pagamento_credito_mastercard}
                            onChange={(checked) => setConfiguracao(prev => ({ ...prev, pagamento_credito_mastercard: checked }))}
                          />
                          
                          <CreditCardOption
                        id="pagamento_credito_visa"
                            brand="Visa"
                            logo="/images/visa.svg"
                        checked={configuracao.pagamento_credito_visa}
                            onChange={(checked) => setConfiguracao(prev => ({ ...prev, pagamento_credito_visa: checked }))}
                          />
                          
                          <CreditCardOption
                        id="pagamento_credito_elo"
                            brand="Elo"
                            logo="/images/elo.svg"
                        checked={configuracao.pagamento_credito_elo}
                            onChange={(checked) => setConfiguracao(prev => ({ ...prev, pagamento_credito_elo: checked }))}
                          />
                          
                          <CreditCardOption
                        id="pagamento_credito_amex"
                            brand="American Express"
                            logo="/images/amex.svg"
                        checked={configuracao.pagamento_credito_amex}
                            onChange={(checked) => setConfiguracao(prev => ({ ...prev, pagamento_credito_amex: checked }))}
                          />
                          
                          <CreditCardOption
                        id="pagamento_credito_hipercard"
                            brand="Hipercard"
                            logo="/images/hipercard.svg"
                        checked={configuracao.pagamento_credito_hipercard}
                            onChange={(checked) => setConfiguracao(prev => ({ ...prev, pagamento_credito_hipercard: checked }))}
                          />
                    </div>
                  </div>
                </div>

                {/* Cartões de Débito */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="flex items-center px-4 py-3 bg-gradient-to-r from-green-500 to-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <h3 className="text-md font-medium text-white">Cartões de Débito</h3>
                      </div>
                      
                      <div className="p-5">
                        <p className="text-sm text-gray-500 mb-4">Selecione as bandeiras de cartão de débito aceitas pela sua loja.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <CreditCardOption
                        id="pagamento_debito_mastercard"
                            brand="Mastercard Débito"
                            logo="/images/mastercard.svg"
                        checked={configuracao.pagamento_debito_mastercard}
                            onChange={(checked) => setConfiguracao(prev => ({ ...prev, pagamento_debito_mastercard: checked }))}
                          />
                          
                          <CreditCardOption
                        id="pagamento_debito_visa"
                            brand="Visa Débito"
                            logo="/images/visa.svg"
                        checked={configuracao.pagamento_debito_visa}
                            onChange={(checked) => setConfiguracao(prev => ({ ...prev, pagamento_debito_visa: checked }))}
                          />
                          
                          <CreditCardOption
                        id="pagamento_debito_elo"
                            brand="Elo Débito"
                            logo="/images/elo.svg"
                        checked={configuracao.pagamento_debito_elo}
                            onChange={(checked) => setConfiguracao(prev => ({ ...prev, pagamento_debito_elo: checked }))}
                          />
                    </div>
                  </div>
                </div>

                {/* Outros Métodos */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="flex items-center px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-md font-medium text-white">Outros Métodos de Pagamento</h3>
                      </div>
                      
                      <div className="p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="border rounded-lg p-4 bg-gray-50 hover:bg-white transition-colors">
                            <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="pagamento_pix"
                        name="pagamento_pix"
                        checked={configuracao.pagamento_pix}
                                onChange={(e) => setConfiguracao(prev => ({ ...prev, pagamento_pix: e.target.checked }))}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <div className="ml-3">
                                <span className="text-sm font-medium text-gray-700">PIX</span>
                              </div>
                      </label>
                            <p className="mt-2 text-xs text-gray-500 pl-8">
                              Pagamento instantâneo via PIX. Os clientes receberão um QR code para pagamento.
                            </p>
                    </div>
                          
                          <div className="border rounded-lg p-4 bg-gray-50 hover:bg-white transition-colors">
                            <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="pagamento_dinheiro"
                        name="pagamento_dinheiro"
                        checked={configuracao.pagamento_dinheiro}
                                onChange={(e) => setConfiguracao(prev => ({ ...prev, pagamento_dinheiro: e.target.checked }))}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <div className="ml-3">
                                <span className="text-sm font-medium text-gray-700">Dinheiro na entrega</span>
                              </div>
                      </label>
                            <p className="mt-2 text-xs text-gray-500 pl-8">
                              Pagamento em dinheiro no momento da entrega do pedido.
                            </p>
                          </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
                {/* Botão de salvar (sempre visível) */}
                <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={salvando}
                    className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {salvando ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Salvar Alterações
                      </>
                    )}
              </button>
                </div>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
} 