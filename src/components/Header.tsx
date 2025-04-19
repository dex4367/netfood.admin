'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenuIcon, ShoppingCartIcon, MapPinIcon } from 'lucide-react';
import CategoriaListHorizontal from './CategoriaListHorizontal';
import { Categoria } from '@/lib/supabase';

interface HeaderProps {
  categoriaAtiva?: string | number | null;
  categorias?: Categoria[];
  setCategoriaAtiva?: (id: string | number) => void;
  configLoja?: any;
}

export default function Header({ categoriaAtiva, categorias, setCategoriaAtiva, configLoja }: HeaderProps) {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Atualizar o contador sempre que o carrinho mudar
  useEffect(() => {
    // Função para capturar mudanças no localStorage diretamente
    const handleStorageChange = () => {
      try {
        const savedItems = localStorage.getItem('cartItems');
        if (savedItems) {
          const parsedItems = JSON.parse(savedItems);
          if (Array.isArray(parsedItems)) {
            console.log('Header: Atualizando do localStorage', parsedItems.length);
            setCartItemCount(parsedItems.length);
          }
        } else {
          setCartItemCount(0);
        }
      } catch (error) {
        console.error('Erro ao ler localStorage:', error);
      }
    };
    
    // Chamar imediatamente para inicializar
    handleStorageChange();
    
    // Adicionar listener para mudanças no localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Adicionar listener customizado para atualizações do carrinho
    const handleCartUpdate = () => {
      console.log('Header: Evento de atualização do carrinho detectado');
      // Força a re-leitura do localStorage
      handleStorageChange();
      // Força um re-render
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Verificar a cada segundo se houve mudanças no carrinho
    const interval = setInterval(() => {
      handleStorageChange();
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(interval);
    };
  }, [forceUpdate]);

  return (
    <div className="header-wrapper w-full bg-white shadow-sm">
      {/* Barra de categorias integrada ao cabeçalho */}
      <div className="w-full bg-white border-b border-gray-100 shadow-none">
        {categorias && categorias.length > 0 && categoriaAtiva !== undefined && setCategoriaAtiva ? (
          <CategoriaListHorizontal 
            categorias={categorias} 
            categoriaAtiva={categoriaAtiva?.toString()} 
            setCategoriaAtiva={(id) => {
              // Converter string para número se possível
              const idNumber = !isNaN(Number(id)) ? Number(id) : id;
              setCategoriaAtiva(idNumber);
            }}
          />
        ) : null}
      </div>
    </div>
  );
} 