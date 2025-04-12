'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaPlus, 
  FaList, 
  FaShoppingCart, 
  FaUsers, 
  FaChartBar, 
  FaUserPlus, 
  FaCog, 
  FaImage,
  FaPizzaSlice,
  FaFolder,
  FaHamburger
} from 'react-icons/fa';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Redirecionamento se não estiver autenticado
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Não renderiza nada enquanto está carregando no servidor
  if (!isClient) {
    return null;
  }

  // Proteção de rota para cliente
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Vai ser redirecionado pelo useEffect
  }

  // Cards de navegação
  const navCards = [
    {
      title: 'Configurações',
      description: 'Altere as configurações do seu restaurante',
      icon: <FaCog className="h-6 w-6" />,
      href: '/admin/configuracao',
      color: 'bg-gray-700',
    },
    {
      title: 'Gerenciar Produtos',
      description: 'Visualize e edite produtos existentes',
      icon: <FaHamburger className="h-6 w-6" />,
      href: '/admin/produtos',
      color: 'bg-blue-600',
    },
    {
      title: 'Novo Produto',
      description: 'Crie um novo produto para o cardápio',
      icon: <FaPlus className="h-6 w-6" />,
      href: '/admin/produto/novo',
      color: 'bg-green-500',
    },
    {
      title: 'Gerenciar Categorias',
      description: 'Visualize e edite categorias existentes',
      icon: <FaFolder className="h-6 w-6" />,
      href: '/admin/categorias',
      color: 'bg-teal-500',
    },
    {
      title: 'Nova Categoria',
      description: 'Adicione uma nova categoria',
      icon: <FaList className="h-6 w-6" />,
      href: '/admin/categoria/novo',
      color: 'bg-blue-500',
    },
    {
      title: 'Banners',
      description: 'Gerencie os banners do seu cardápio',
      icon: <FaImage className="h-6 w-6" />,
      href: '/admin/banners',
      color: 'bg-blue-400',
    },
    {
      title: 'Complementos',
      description: 'Gerencie os complementos dos produtos',
      icon: <FaPizzaSlice className="h-6 w-6" />,
      href: '/admin/complementos',
      color: 'bg-orange-500',
    },
    {
      title: 'Pedidos',
      description: 'Visualize e gerencie os pedidos recebidos',
      icon: <FaShoppingCart className="h-6 w-6" />,
      href: '/admin/pedidos',
      color: 'bg-yellow-500',
    },
    {
      title: 'Clientes',
      description: 'Acesse a lista de clientes cadastrados',
      icon: <FaUsers className="h-6 w-6" />,
      href: '/admin/clientes',
      color: 'bg-purple-500',
    },
    {
      title: 'Usuários',
      description: 'Adicione e gerencie usuários do sistema',
      icon: <FaUserPlus className="h-6 w-6" />,
      href: '/admin/usuarios',
      color: 'bg-indigo-500',
    },
    {
      title: 'Relatórios',
      description: 'Visualize relatórios de vendas e análises',
      icon: <FaChartBar className="h-6 w-6" />,
      href: '/admin/relatorios',
      color: 'bg-red-500',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header className="mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="mt-2 text-sm text-gray-600">
              Bem-vindo, {user.email}! Gerencie seu cardápio e pedidos aqui.
            </p>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {navCards.map((card, index) => (
                <Link href={card.href} key={index}>
                  <div className={`${card.color} hover:opacity-90 transition-opacity rounded-lg shadow-md overflow-hidden p-6 text-white`}>
                    <div className="flex items-center">
                      <div className="bg-white bg-opacity-30 p-3 rounded-lg">
                        {card.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">{card.title}</h3>
                        <p className="mt-1 text-sm opacity-90">{card.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 