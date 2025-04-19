'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import type { Produto, Categoria } from '@/lib/supabase';
import { 
  ShoppingBag, 
  Users, 
  Tag, 
  Image as ImageIcon, 
  Settings, 
  ArrowUpRight 
} from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProdutos: 0,
    produtosDestaque: 0,
    produtosDisponiveis: 0,
    categorias: 0,
    banners: 0,
    produtos: 0,
    usuarios: 0,
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
          produtos: produtos?.length || 0,
          usuarios: 0, // Assuming usuarios count is not available in the current query
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
      title: 'Produtos',
      value: stats.produtos,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      href: '/admin/produtos',
    },
    {
      title: 'Categorias',
      value: stats.categorias,
      icon: Tag,
      color: 'bg-amber-500',
      href: '/admin/categorias',
    },
    {
      title: 'Banners',
      value: stats.banners,
      icon: ImageIcon,
      color: 'bg-emerald-500',
      href: '/admin/banners',
    },
    {
      title: 'Usuários',
      value: stats.usuarios,
      icon: Users,
      color: 'bg-purple-500',
      href: '/admin/usuarios',
    },
  ];

  const quickLinks = [
    { name: 'Novo Produto', href: '/admin/produto/novo', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', color: 'bg-gradient-to-r from-green-500 to-green-600' },
    { name: 'Nova Categoria', href: '/admin/categoria/nova', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    { name: 'Banners', href: '/admin/banners', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
    { name: 'Configurações', href: '/admin/configuracao', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', color: 'bg-gradient-to-r from-gray-500 to-gray-600' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-3"></div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
        <Link 
          href="/admin/configuracao" 
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <Settings className="h-5 w-5 mr-1" />
          Configurações
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-md ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{card.title}</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">{card.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <div className="font-medium text-blue-600 hover:text-blue-500 flex items-center">
                  Ver todos
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <h2 className="text-lg font-medium text-gray-900 mt-8 mb-4">Ações rápidas</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center p-5 bg-white shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className={`flex-shrink-0 p-3 rounded-md ${link.color}`}>
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-base font-medium text-gray-900">{link.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Produtos recentes */}
      <h2 className="text-lg font-medium text-gray-900 mt-8 mb-4">Produtos recentes</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {recentProdutos.length > 0 ? (
            recentProdutos.map((produto) => (
              <li key={produto.id}>
                <Link href={`/admin/produto/${produto.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {produto.imagem_url ? (
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                            <Image 
                              src={produto.imagem_url} 
                              alt={produto.nome} 
                              width={40} 
                              height={40}
                              className="h-10 w-10 object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <ShoppingBag className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-blue-600">{produto.nome}</div>
                          <div className="text-sm text-gray-500">
                            {produto.descricao ? (
                              produto.descricao.length > 60 ? 
                                `${produto.descricao.substring(0, 60)}...` : 
                                produto.descricao
                            ) : (
                              "Sem descrição"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-semibold text-gray-900">
                          R$ {produto.preco.toFixed(2).replace('.', ',')}
                        </div>
                        <div className="mt-1 flex items-center text-sm">
                          <span 
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${produto.disponivel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {produto.disponivel ? 'Disponível' : 'Indisponível'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 text-center text-gray-500">
              Nenhum produto cadastrado.
            </li>
          )}
        </ul>
      </div>
    </>
  );
} 