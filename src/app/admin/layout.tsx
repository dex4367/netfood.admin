'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  List,
  Settings,
  Users,
  LogOut,
  Image as ImageIcon,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Home
} from 'lucide-react';

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Verificação de carregamento e autenticação
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-blue-500"></div>
          <p className="mt-4 text-center text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Produtos', href: '/admin/produtos', icon: Package },
    { name: 'Categorias', href: '/admin/categorias', icon: List },
    { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
    { name: 'Usuários', href: '/admin/usuarios', icon: Users },
    { name: 'Configurações', href: '/admin/configuracao', icon: Settings },
  ];

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') {
      return true;
    }
    return pathname?.startsWith(path) && path !== '/admin';
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Overlay para menu mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar - versão mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-800 transition duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">Admin</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex h-full flex-col justify-between">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center rounded-md px-3 py-2 text-sm font-medium
                    ${
                      isActive(item.href)
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className="mb-6 px-4">
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar - versão desktop */}
      <div
        className={`hidden bg-slate-800 transition-all duration-300 lg:fixed lg:inset-y-0 lg:flex lg:flex-col ${
          sidebarOpen ? 'lg:w-64' : 'lg:w-20'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
          <div className="flex items-center justify-center flex-1">
            {sidebarOpen ? (
              <span className="text-xl font-semibold text-white">Admin</span>
            ) : (
              <span className="text-xl font-semibold text-white">A</span>
            )}
          </div>
          <button
            onClick={handleToggleSidebar}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <div className="flex h-0 flex-1 flex-col overflow-y-auto">
          <nav className="mt-5 flex-1 px-2">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center rounded-md px-3 py-2 text-sm font-medium
                    ${
                      isActive(item.href)
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }
                    ${!sidebarOpen && 'justify-center px-2'}
                  `}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${sidebarOpen && 'mr-3'}`} />
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              ))}
            </div>
          </nav>

          <div className="mb-6 px-4">
            <button
              onClick={handleLogout}
              className={`
                mt-2 flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white
                ${!sidebarOpen && 'justify-center px-2'} w-full
              `}
            >
              <LogOut className={`h-5 w-5 flex-shrink-0 ${sidebarOpen && 'mr-3'}`} />
              {sidebarOpen && <span>Sair</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className={`flex flex-1 flex-col ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
        {/* Barra superior */}
        <header className="z-10 bg-white shadow">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-slate-500 focus:outline-none lg:hidden"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center text-sm font-medium text-blue-500 hover:text-blue-700"
              >
                <Home size={16} className="mr-1" />
                Ver site
              </Link>
              
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden text-sm text-slate-700 md:inline-block">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>

        {/* Rodapé */}
        <footer className="bg-white py-4 text-center text-sm text-slate-500 shadow-inner">
          <p>&copy; {new Date().getFullYear()} NetFood Admin</p>
        </footer>
      </div>
    </div>
  );
} 