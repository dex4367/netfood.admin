'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase, buscarConfiguracaoLoja, atualizarConfiguracaoLoja, type ConfiguracaoLoja } from '@/lib/supabase';

export default function ConfiguracaoLojaPage() {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoLoja>({
    id: '1',
    nome_loja: 'NetFood',
    descricao_loja: 'Seu cardápio digital completo',
    logo_url: null,
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
  const [activeTab, setActiveTab] = useState('geral');
  
  useEffect(() => {
    async function carregarConfiguracao() {
      setLoading(true);
      const config = await buscarConfiguracaoLoja();
      if (config) {
        setConfiguracao(config);
        if (config.logo_url) {
          setLogoPreview(config.logo_url);
        }
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem('');
    setErro(false);
    
    try {
      const sucesso = await atualizarConfiguracaoLoja(configuracao);
      
      if (sucesso) {
        setMensagem('Configurações salvas com sucesso!');
      } else {
        setErro(true);
        setMensagem('Erro ao salvar as configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setErro(true);
      setMensagem('Erro ao processar a requisição');
    } finally {
      setSalvando(false);
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Configurações da Loja</h1>
        <Link href="/admin" className="text-green-600 hover:underline flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Admin
        </Link>
      </div>
      
      {mensagem && (
        <div className={`p-4 mb-6 rounded-md ${erro ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {mensagem}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Carregando configurações...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Abas de configuração */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px space-x-8">
                <button
                  type="button"
                  onClick={() => setActiveTab('geral')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'geral'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Geral
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('informacoes')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'informacoes'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Informações da Loja
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('pagamentos')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pagamentos'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Métodos de Pagamento
                </button>
              </nav>
            </div>

            {/* Aba Geral */}
            {activeTab === 'geral' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="nome_loja" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Loja
                  </label>
                  <input
                    type="text"
                    id="nome_loja"
                    name="nome_loja"
                    value={configuracao.nome_loja}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Este nome aparecerá no cabeçalho e no rodapé do site.</p>
                </div>
                
                <div>
                  <label htmlFor="descricao_loja" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição da Loja
                  </label>
                  <textarea
                    id="descricao_loja"
                    name="descricao_loja"
                    value={configuracao.descricao_loja || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Uma breve descrição que aparecerá no cabeçalho do site.</p>
                </div>
                
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                    Logo da Loja
                  </label>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="relative w-32 h-32 border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                        {logoPreview ? (
                          <Image 
                            src={logoPreview} 
                            alt="Logo preview" 
                            fill 
                            className="object-contain" 
                          />
                        ) : (
                          <span className="text-gray-400 text-sm text-center p-2">
                            Sem logo
                          </span>
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
                        className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 transition"
                      >
                        Selecionar Imagem
                      </label>
                      
                      <p className="mt-2 text-xs text-gray-500">
                        Tamanho recomendado: 200x60 pixels. Formatos: JPG, PNG. Máximo: 2MB.
                      </p>
                      
                      {logoPreview && configuracao.logo_url && (
                        <button
                          type="button"
                          onClick={() => {
                            setLogoPreview(null);
                            setConfiguracao(prev => ({ ...prev, logo_url: null }));
                          }}
                          className="mt-2 px-4 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                        >
                          Remover Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cor_primaria" className="block text-sm font-medium text-gray-700 mb-1">
                      Cor Primária
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="cor_primaria"
                        name="cor_primaria"
                        value={configuracao.cor_primaria}
                        onChange={handleChange}
                        className="h-10 w-10 rounded overflow-hidden"
                      />
                      <input
                        type="text"
                        value={configuracao.cor_primaria}
                        onChange={handleChange}
                        name="cor_primaria"
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Cor principal do tema (cabeçalho, botões, etc.)</p>
                  </div>
                  
                  <div>
                    <label htmlFor="cor_secundaria" className="block text-sm font-medium text-gray-700 mb-1">
                      Cor Secundária
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="cor_secundaria"
                        name="cor_secundaria"
                        value={configuracao.cor_secundaria}
                        onChange={handleChange}
                        className="h-10 w-10 rounded overflow-hidden"
                      />
                      <input
                        type="text"
                        value={configuracao.cor_secundaria}
                        onChange={handleChange}
                        name="cor_secundaria"
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Cor secundária do tema (botões de hover, detalhes, etc.)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Aba Informações da Loja */}
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
                      placeholder="Ex: 08:00 às 22:00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
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
                      placeholder="Ex: Segunda a Domingo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Aba Métodos de Pagamento */}
            {activeTab === 'pagamentos' && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500 mb-4">
                  Selecione os métodos de pagamento aceitos pelo seu estabelecimento. Estes métodos serão exibidos no site.
                </p>

                {/* Carteira Digital */}
                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Saldo da Carteira</h3>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="pagamento_carteira"
                      name="pagamento_carteira"
                      checked={configuracao.pagamento_carteira}
                      onChange={(e) => 
                        setConfiguracao(prev => ({ 
                          ...prev, 
                          pagamento_carteira: e.target.checked 
                        }))
                      }
                      className="h-5 w-5 text-green-600 rounded border-gray-300"
                    />
                    <label htmlFor="pagamento_carteira" className="ml-2 text-sm text-gray-700">
                      Aceitar pagamento com saldo da carteira
                    </label>
                  </div>
                </div>

                {/* Cartões de Crédito */}
                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Cartões de Crédito</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pagamento_credito_mastercard"
                        name="pagamento_credito_mastercard"
                        checked={configuracao.pagamento_credito_mastercard}
                        onChange={(e) => 
                          setConfiguracao(prev => ({ 
                            ...prev, 
                            pagamento_credito_mastercard: e.target.checked 
                          }))
                        }
                        className="h-5 w-5 text-green-600 rounded border-gray-300"
                      />
                      <label htmlFor="pagamento_credito_mastercard" className="ml-2 text-sm text-gray-700">
                        Mastercard
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pagamento_credito_visa"
                        name="pagamento_credito_visa"
                        checked={configuracao.pagamento_credito_visa}
                        onChange={(e) => 
                          setConfiguracao(prev => ({ 
                            ...prev, 
                            pagamento_credito_visa: e.target.checked 
                          }))
                        }
                        className="h-5 w-5 text-green-600 rounded border-gray-300"
                      />
                      <label htmlFor="pagamento_credito_visa" className="ml-2 text-sm text-gray-700">
                        Visa
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pagamento_credito_elo"
                        name="pagamento_credito_elo"
                        checked={configuracao.pagamento_credito_elo}
                        onChange={(e) => 
                          setConfiguracao(prev => ({ 
                            ...prev, 
                            pagamento_credito_elo: e.target.checked 
                          }))
                        }
                        className="h-5 w-5 text-green-600 rounded border-gray-300"
                      />
                      <label htmlFor="pagamento_credito_elo" className="ml-2 text-sm text-gray-700">
                        Elo
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pagamento_credito_amex"
                        name="pagamento_credito_amex"
                        checked={configuracao.pagamento_credito_amex}
                        onChange={(e) => 
                          setConfiguracao(prev => ({ 
                            ...prev, 
                            pagamento_credito_amex: e.target.checked 
                          }))
                        }
                        className="h-5 w-5 text-green-600 rounded border-gray-300"
                      />
                      <label htmlFor="pagamento_credito_amex" className="ml-2 text-sm text-gray-700">
                        Amex
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pagamento_credito_hipercard"
                        name="pagamento_credito_hipercard"
                        checked={configuracao.pagamento_credito_hipercard}
                        onChange={(e) => 
                          setConfiguracao(prev => ({ 
                            ...prev, 
                            pagamento_credito_hipercard: e.target.checked 
                          }))
                        }
                        className="h-5 w-5 text-green-600 rounded border-gray-300"
                      />
                      <label htmlFor="pagamento_credito_hipercard" className="ml-2 text-sm text-gray-700">
                        Hipercard
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cartões de Débito */}
                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Cartões de Débito</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pagamento_debito_mastercard"
                        name="pagamento_debito_mastercard"
                        checked={configuracao.pagamento_debito_mastercard}
                        onChange={(e) => 
                          setConfiguracao(prev => ({ 
                            ...prev, 
                            pagamento_debito_mastercard: e.target.checked 
                          }))
                        }
                        className="h-5 w-5 text-green-600 rounded border-gray-300"
                      />
                      <label htmlFor="pagamento_debito_mastercard" className="ml-2 text-sm text-gray-700">
                        Mastercard Débito
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pagamento_debito_visa"
                        name="pagamento_debito_visa"
                        checked={configuracao.pagamento_debito_visa}
                        onChange={(e) => 
                          setConfiguracao(prev => ({ 
                            ...prev, 
                            pagamento_debito_visa: e.target.checked 
                          }))
                        }
                        className="h-5 w-5 text-green-600 rounded border-gray-300"
                      />
                      <label htmlFor="pagamento_debito_visa" className="ml-2 text-sm text-gray-700">
                        Visa Débito
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pagamento_debito_elo"
                        name="pagamento_debito_elo"
                        checked={configuracao.pagamento_debito_elo}
                        onChange={(e) => 
                          setConfiguracao(prev => ({ 
                            ...prev, 
                            pagamento_debito_elo: e.target.checked 
                          }))
                        }
                        className="h-5 w-5 text-green-600 rounded border-gray-300"
                      />
                      <label htmlFor="pagamento_debito_elo" className="ml-2 text-sm text-gray-700">
                        Elo Débito
                      </label>
                    </div>
                  </div>
                </div>

                {/* Outros Métodos */}
                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Outros Métodos de Pagamento</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pagamento_pix"
                        name="pagamento_pix"
                        checked={configuracao.pagamento_pix}
                        onChange={(e) => 
                          setConfiguracao(prev => ({ 
                            ...prev, 
                            pagamento_pix: e.target.checked 
                          }))
                        }
                        className="h-5 w-5 text-green-600 rounded border-gray-300"
                      />
                      <label htmlFor="pagamento_pix" className="ml-2 text-sm text-gray-700">
                        PIX
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pagamento_dinheiro"
                        name="pagamento_dinheiro"
                        checked={configuracao.pagamento_dinheiro}
                        onChange={(e) => 
                          setConfiguracao(prev => ({ 
                            ...prev, 
                            pagamento_dinheiro: e.target.checked 
                          }))
                        }
                        className="h-5 w-5 text-green-600 rounded border-gray-300"
                      />
                      <label htmlFor="pagamento_dinheiro" className="ml-2 text-sm text-gray-700">
                        Dinheiro na entrega
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={salvando}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {salvando ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 