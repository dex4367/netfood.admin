'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Produto, Categoria } from '@/lib/supabase';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProdutos: 0,
    produtosDestaque: 0,
    produtosDisponiveis: 0,
    categorias: 0,
    banners: 0,
  });
  const [recentProdutos, setRecentProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      try {
        // Carregar estatísticas
        const { data: produtos, error: produtosError } = await supabase
          .from('produtos')
          .select('*');
        
        if (produtosError) throw produtosError;
        
        const { data: categoriasData, error: categoriasError } = await supabase
          .from('categorias')
          .select('*')
          .order('nome');
        
        if (categoriasError) throw categoriasError;
        setCategorias(categoriasData || []);
        
        const { data: bannersData, error: bannersError } = await supabase
          .from('banners')
          .select('id');
        
        // Produtos recentes
        const { data: recentProducts, error: recentError } = await supabase
          .from('produtos')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (recentError) throw recentError;
        setRecentProdutos(recentProducts || []);
        
        // Calcular estatísticas
        const produtosDestaque = produtos?.filter(p => p.destaque) || [];
        const produtosDisponiveis = produtos?.filter(p => p.disponivel) || [];
        
        setStats({
          totalProdutos: produtos?.length || 0,
          produtosDestaque: produtosDestaque.length,
          produtosDisponiveis: produtosDisponiveis.length,
          categorias: categoriasData?.length || 0,
          banners: bannersData?.length || 0,
        });
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const cards = [
    {
      title: 'Total de Produtos',
      value: stats.totalProdutos,
      icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
      color: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-500',
      link: '/admin/produtos'
    },
    {
      title: 'Produtos em Destaque',
      value: stats.produtosDestaque,
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      color: 'bg-yellow-100 text-yellow-800',
      iconColor: 'text-yellow-500',
      link: '/admin/produtos'
    },
    {
      title: 'Categorias',
      value: stats.categorias,
      icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
      color: 'bg-green-100 text-green-800',
      iconColor: 'text-green-500',
      link: '/admin/categorias'
    },
    {
      title: 'Banners',
      value: stats.banners,
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      color: 'bg-purple-100 text-purple-800',
      iconColor: 'text-purple-500',
      link: '/admin/banners'
    }
  ];

  const quickLinks = [
    { name: 'Adicionar Produto', href: '/admin/produto/novo', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', color: 'bg-green-500 hover:bg-green-600' },
    { name: 'Nova Categoria', href: '/admin/categoria/nova', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', color: 'bg-blue-500 hover:bg-blue-600' },
    { name: 'Gerenciar Complementos', href: '/admin/complementos', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'bg-purple-500 hover:bg-purple-600' },
    { name: 'Configurações', href: '/admin/configuracao', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', color: 'bg-gray-500 hover:bg-gray-600' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao painel administrativo do NetFood.</p>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link 
            key={index} 
            href={card.link}
            className="bg-white overflow-hidden shadow rounded-lg transition-transform hover:scale-105"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                  <svg 
                    className={`h-6 w-6 ${card.iconColor}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{card.title}</dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">{card.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Acesso rápido */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-700">Acesso Rápido</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`flex items-center justify-center text-white font-medium p-4 rounded-lg ${link.color} transition-colors`}
              >
                <svg 
                  className="h-5 w-5 mr-2" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                </svg>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Produtos e Categorias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos recentes */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-700">Produtos Recentes</h2>
            <Link href="/admin/produtos" className="text-sm text-green-600 hover:text-green-800">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentProdutos.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Nenhum produto encontrado
              </div>
            ) : (
              recentProdutos.map((produto) => (
                <Link 
                  key={produto.id} 
                  href={`/admin/produto/${produto.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-6 py-4 flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${produto.disponivel ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{produto.nome}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}
                      </p>
                    </div>
                    <div>
                      <svg 
                        className="h-5 w-5 text-gray-400" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
        
        {/* Categorias */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-700">Categorias</h2>
            <Link href="/admin/categorias" className="text-sm text-green-600 hover:text-green-800">
              Ver todas
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {categorias.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Nenhuma categoria encontrada
              </div>
            ) : (
              categorias.slice(0, 5).map((categoria) => (
                <Link 
                  key={categoria.id} 
                  href={`/admin/categoria/${categoria.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-6 py-4 flex items-center">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{categoria.nome}</p>
                      {categoria.descricao && (
                        <p className="text-sm text-gray-500 truncate">{categoria.descricao}</p>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Ordem: {categoria.ordem}
                      </span>
                      <svg 
                        className="ml-2 h-5 w-5 text-gray-400" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Card de ajuda */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Precisa de ajuda?</h3>
              <p className="text-green-100 mb-4">Consulte nossa documentação ou entre em contato com o suporte.</p>
              <div className="flex space-x-3">
                <a 
                  href="https://github.com/dex4367/netfood.admin" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-green-700 bg-white hover:bg-green-50"
                >
                  Documentação
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <svg 
                className="h-24 w-24 text-white opacity-25" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 