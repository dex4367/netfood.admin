"use client";

import { useState, useEffect } from 'react';
import { Product } from '../../../data/products';
import ProductDetails from './ProductDetails';
import { ProductDetailsSkeleton } from '../../../components/ui/product-skeleton';
import { useSearchParams } from 'next/navigation';

interface ProductClientProps {
  product: Product;
}

export default function ProductClient({ product }: ProductClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  // Extrair parâmetros de edição da URL
  const isEditing = searchParams.get('edit') === 'true';
  const itemId = searchParams.get('itemId');
  const editData = isEditing ? {
    itemId,
    extras: JSON.parse(searchParams.get('extras') || '{}'),
    sauces: JSON.parse(searchParams.get('sauces') || '{}'),
    side: searchParams.get('side') || null,
    addons: JSON.parse(searchParams.get('addons') || '[]'),
    quantity: parseInt(searchParams.get('quantity') || '1', 10)
  } : null;

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Sincronizar localStorage para evitar conflitos
    if (typeof window !== 'undefined') {
      try {
        // Limpar chaves antigas
        ['cartItems', 'bobsCart', 'removedCartItems'].forEach(key => {
          localStorage.removeItem(key);
        });
        
        // Verificar se as novas chaves já existem
        if (!localStorage.getItem('bob_cart_items_v2') && !localStorage.getItem('bob_removed_items_v2')) {
          // Inicializar com valores vazios
          localStorage.setItem('bob_removed_items_v2', JSON.stringify([]));
        }
        
        console.log('localStorage sincronizado na página do produto');
      } catch (error) {
        console.error('Erro ao sincronizar localStorage:', error);
      }
    }
  }, []);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  return <ProductDetails product={product} editData={editData} />;
} 