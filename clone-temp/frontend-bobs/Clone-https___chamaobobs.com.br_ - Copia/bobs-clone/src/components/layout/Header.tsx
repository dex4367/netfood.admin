"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, ShoppingCartIcon, MapPinIcon } from 'lucide-react';
import { CategoriesListMobile } from '@/components/ui/categories-list-mobile';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { items } = useCart();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Atualizar o contador sempre que o carrinho mudar
  useEffect(() => {
    // Usar um timeout para garantir que o estado mais recente do carrinho seja utilizado
    const updateCartCount = () => {
      console.log('Header: Atualizando contador do carrinho', items.length);
      setCartItemCount(items.length);
    };
    
    updateCartCount();
    
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
  }, [items, forceUpdate]);

  // Categorias para a barra de navegação
  const categories = [
    { id: 1, name: "Promoção do Dia" },
    { id: 2, name: "Destaques Bob's Fã" },
    { id: 3, name: "Lançamentos" },
    { id: 4, name: "Trios" },
    { id: 5, name: "Milk Shakes" },
    { id: 6, name: "Sanduíches" },
    { id: 7, name: "Combos Família" },
    { id: 8, name: "Acompanhamentos" },
    { id: 9, name: "Sobremesas" },
    { id: 10, name: "Bob's Play" },
    { id: 11, name: "Bebidas" },
    { id: 12, name: "Empório Bob´s" }
  ];

  return (
    <div className="header-wrapper">
      <div className="w-full bg-white z-50 shadow-none">
        <div className="address-bar border-b border-gray-200">
          <div className="flex items-center text-gray-600 py-2 px-4">
            <MapPinIcon className="w-5 h-5 text-bobs-red mr-1" />
            <span className="text-sm font-semibold">CLIQUE AQUI E INFORME SEU ENDEREÇO</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2 px-4 mobile-nav">
          <button aria-label="Menu" className="p-2">
            <MenuIcon className="h-6 w-6 text-gray-700" />
          </button>

          <Link href="/" className="flex-1 flex justify-center">
            <Image
              src="/images/bobs-logo.png"
              alt="Bob's"
              width={102}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <Link href="/carrinho-novo" className="relative p-2">
            <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-bobs-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* Barra de categorias integrada ao cabeçalho */}
      <div className="w-full categories-bar shadow-none">
        <CategoriesListMobile categories={categories} />
      </div>
    </div>
  );
}
