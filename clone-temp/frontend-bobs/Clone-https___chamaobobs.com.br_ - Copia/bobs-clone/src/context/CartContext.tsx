"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, Extra, Side, Sauce, Addon } from '../data/products';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedExtras: Record<string, number>; // ID do extra -> quantidade
  selectedSide: string | null;
  selectedSauces: Record<string, number>; // ID do molho -> quantidade
  selectedAddons: string[];
  observation: string;
  totalPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, newItem: CartItem) => void;
  updateItemQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Chave única para este carrinho específico
const CART_KEY = 'bob_cart_items_v2';
const REMOVED_IDS_KEY = 'bob_removed_items_v2';

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Função para limpar completamente todas as chaves de localStorage relacionadas ao carrinho
const cleanupStorage = () => {
  if (typeof window !== 'undefined') {
    // Limpar todas as possíveis chaves anteriores
    localStorage.removeItem('cartItems');
    localStorage.removeItem('bobsCart');
    localStorage.removeItem('removedCartItems');
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Inicialização: limpar tudo e começar do zero
  useEffect(() => {
    if (typeof window === 'undefined' || initialized) return;
    
    try {
      // Limpar chaves antigas
      cleanupStorage();
      
      // Carregar itens removidos
      try {
        const storedRemovedIds = localStorage.getItem(REMOVED_IDS_KEY);
        if (storedRemovedIds) {
          const parsedIds = JSON.parse(storedRemovedIds);
          if (Array.isArray(parsedIds)) {
            setRemovedIds(parsedIds);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar IDs removidos:', error);
        localStorage.removeItem(REMOVED_IDS_KEY);
      }
      
      // Carregar itens do carrinho
      try {
        const storedItems = localStorage.getItem(CART_KEY);
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          if (Array.isArray(parsedItems)) {
            setItems(parsedItems);
          } else {
            setItems([]);
            localStorage.removeItem(CART_KEY);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar itens do carrinho:', error);
        localStorage.removeItem(CART_KEY);
        setItems([]);
      }
    } catch (error) {
      console.error('Erro na inicialização do carrinho:', error);
    } finally {
      setInitialized(true);
    }
  }, [initialized]);

  // Persistir itens do carrinho quando mudarem
  useEffect(() => {
    if (!initialized || typeof window === 'undefined') return;
    
    try {
      if (items.length === 0) {
        localStorage.removeItem(CART_KEY);
      } else {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      }
      
      // Notificar outros componentes
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { items, action: 'update' } 
      }));
    } catch (error) {
      console.error('Erro ao salvar itens do carrinho:', error);
    }
  }, [items, initialized]);

  // Persistir IDs removidos quando mudarem
  useEffect(() => {
    if (!initialized || typeof window === 'undefined') return;
    
    try {
      if (removedIds.length === 0) {
        localStorage.removeItem(REMOVED_IDS_KEY);
      } else {
        localStorage.setItem(REMOVED_IDS_KEY, JSON.stringify(removedIds));
      }
    } catch (error) {
      console.error('Erro ao salvar IDs removidos:', error);
    }
  }, [removedIds, initialized]);

  // Verificar se um ID de produto está na lista de removidos
  const isProductRemoved = useCallback((productId: string): boolean => {
    // Temporariamente desativado para permitir adicionar qualquer produto
    // return removedIds.includes(productId);
    return false; // Sempre retorna falso para permitir adicionar produtos
  }, []);

  // Adicionar item ao carrinho
  const addItem = useCallback((item: CartItem) => {
    // Se o produto foi removido anteriormente, não adicionar
    // Temporariamente desativado para permitir adicionar qualquer produto
    /*
    if (isProductRemoved(item.product.id)) {
      console.log('Produto foi removido anteriormente, não será adicionado:', item.product.id);
      return;
    }
    */

    // Gerar ID único se não existir
    const cartItemId = item.id || `${item.product.id}-${Date.now()}`;
    const itemWithId = { ...item, id: cartItemId };
    
    setItems(prevItems => {
      // Garantir que temos um array válido
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      
      // Verificar se já existe um item idêntico
      const existingIndex = currentItems.findIndex(i => 
        i && 
        i.product.id === item.product.id && 
        i.selectedSide === item.selectedSide &&
        JSON.stringify(i.selectedExtras) === JSON.stringify(item.selectedExtras) &&
        JSON.stringify(i.selectedSauces) === JSON.stringify(item.selectedSauces) &&
        JSON.stringify(i.selectedAddons) === JSON.stringify(item.selectedAddons) &&
        i.observation === item.observation
      );
      
      // Se existir, atualizar a quantidade
      if (existingIndex !== -1) {
        const updatedItems = [...currentItems];
        const existingItem = updatedItems[existingIndex];
        
        updatedItems[existingIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity,
          totalPrice: existingItem.totalPrice + item.totalPrice
        };
        
        return updatedItems;
      }
      
      // Caso contrário, adicionar como novo item
      return [...currentItems, itemWithId];
    });
    
    // Salvar diretamente no localStorage para garantir
    if (typeof window !== 'undefined') {
      try {
        // Obter itens atuais
        let currentItems = [];
        const storedItems = localStorage.getItem(CART_KEY);
        if (storedItems) {
          try {
            const parsed = JSON.parse(storedItems);
            if (Array.isArray(parsed)) {
              currentItems = parsed;
            }
          } catch (e) {
            console.error('Erro ao parsear itens do carrinho:', e);
          }
        }
        
        // Gerar ID único se não existir
        const cartItemId = item.id || `${item.product.id}-${Date.now()}`;
        const itemWithId = { ...item, id: cartItemId };
        
        // Verificar item duplicado
        const existingIndex = currentItems.findIndex(i => 
          i && 
          i.product.id === item.product.id && 
          i.selectedSide === item.selectedSide &&
          JSON.stringify(i.selectedExtras) === JSON.stringify(item.selectedExtras) &&
          JSON.stringify(i.selectedSauces) === JSON.stringify(item.selectedSauces) &&
          JSON.stringify(i.selectedAddons) === JSON.stringify(item.selectedAddons) &&
          i.observation === item.observation
        );
        
        if (existingIndex !== -1) {
          // Atualizar item existente
          const existingItem = currentItems[existingIndex];
          currentItems[existingIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + item.quantity,
            totalPrice: existingItem.totalPrice + item.totalPrice
          };
        } else {
          // Adicionar novo item
          currentItems.push(itemWithId);
        }
        
        // Salvar de volta no localStorage
        localStorage.setItem(CART_KEY, JSON.stringify(currentItems));
        
        console.log('Item salvo diretamente no localStorage', currentItems);
        
        // Notificar outros componentes
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
          detail: { items: currentItems, action: 'add' } 
        }));
      } catch (error) {
        console.error('Erro ao salvar item diretamente no localStorage:', error);
      }
    }
  }, []);

  // Remover item do carrinho
  const removeItem = useCallback((itemId: string) => {
    setItems(prevItems => {
      // Garantir que temos um array válido
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      
      // Encontrar o item a ser removido
      const itemToRemove = currentItems.find(item => item.id === itemId);
      
      if (itemToRemove) {
        // Adicionar o ID do produto à lista de removidos
        setRemovedIds(prev => {
          if (!prev.includes(itemToRemove.product.id)) {
            return [...prev, itemToRemove.product.id];
          }
          return prev;
        });
        
        console.log('Item removido e adicionado à lista de removidos:', itemToRemove.product.id);
      }
      
      // Filtrar o item do array
      return currentItems.filter(item => item.id !== itemId);
    });
  }, []);

  // Atualizar item existente
  const updateItem = useCallback((itemId: string, updatedItem: CartItem) => {
    setItems(prevItems => {
      // Garantir que temos um array válido
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      
      // Atualizar o item mantendo o ID original
      return currentItems.map(item => 
        item.id === itemId ? { ...updatedItem, id: itemId } : item
      );
    });
  }, []);

  // Atualizar quantidade de um item
  const updateItemQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    
    setItems(prevItems => {
      // Garantir que temos um array válido
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      
      // Atualizar a quantidade e o preço total
      return currentItems.map(item => {
        if (item.id === itemId) {
          const unitPrice = item.totalPrice / item.quantity;
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: unitPrice * newQuantity
          };
        }
        return item;
      });
    });
  }, [removeItem]);

  // Limpar o carrinho completamente
  const clearCart = useCallback(() => {
    setItems([]);
    // Manter os IDs removidos para evitar que itens removidos reapareçam
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_KEY);
      
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { items: [], action: 'clear' } 
      }));
    }
  }, []);

  // Calcular o preço total do carrinho
  const getTotalPrice = useCallback(() => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item?.totalPrice || 0), 0);
  }, [items]);

  // Calcular o total de itens no carrinho
  const getTotalItems = useCallback(() => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item?.quantity || 0), 0);
  }, [items]);

  // Contexto a ser fornecido
  const cartContext: CartContextType = {
    items,
    addItem,
    removeItem,
    updateItem,
    updateItemQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return (
    <CartContext.Provider value={cartContext}>
      {children}
    </CartContext.Provider>
  );
} 