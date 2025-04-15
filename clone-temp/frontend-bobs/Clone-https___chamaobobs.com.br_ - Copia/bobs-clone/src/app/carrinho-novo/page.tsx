"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/context/CartContext';

// Produtos sugeridos (normalmente viriam de uma API ou banco de dados)
const sugestoesProdutos = [
  {
    id: "sug1",
    name: "Big Bob's",
    description: "Dois hambúrgueres, queijo derretido, molho especial, cebola, alface e picles.",
    price: 25.90,
    image: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/202204061741_3282_i.jpg",
    category: "Sanduíches"
  },
  {
    id: "sug2",
    name: "Cheddar",
    description: "Hambúrguer, queijo cheddar cremoso, bacon crocante e cebola.",
    price: 22.90,
    image: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/6503b26e409f4c8331d2caeeba844a5a.png",
    category: "Sanduíches"
  },
  {
    id: "sug3",
    name: "Fritas Grandes",
    description: "Porção grande de batatas fritas crocantes e douradas.",
    price: 12.90,
    image: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/202111041521_1QBA_i.jpg",
    category: "Acompanhamentos"
  },
  {
    id: "sug4",
    name: "Milk Shake Chocolate",
    description: "Delicioso milk shake de chocolate com calda especial.",
    price: 14.90,
    image: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/d57c673008256be8b19c1f6333c6491c.jpg",
    category: "Bebidas"
  },
  {
    id: "sug5",
    name: "Sundae Caramelo",
    description: "Sorvete de baunilha com calda de caramelo.",
    price: 9.90,
    image: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/fb5466377a88236bb484991d472a48a1.jpg",
    category: "Sobremesas"
  }
];

export default function CarrinhoNovoPage() {
  const { items, removeItem, updateItemQuantity, getTotalPrice } = useCart();
  const [isClient, setIsClient] = useState(false);
  const [cartState, setCartState] = useState<number>(0);
  const [localItems, setLocalItems] = useState<CartItem[]>([]);
  
  // Função para mostrar a lista de itens real (combinando context e localStorage)
  const getItemsToDisplay = () => {
    if (items.length > 0) {
      console.log('Usando itens do contexto:', items.length);
      return items;
    }
    
    if (localItems.length > 0) {
      console.log('Usando itens do localStorage:', localItems.length);
      return localItems;
    }
    
    return [];
  };
  
  const itemsToDisplay = getItemsToDisplay();
  console.log('Exibindo itens:', itemsToDisplay.length);

  // Função para limpar todo o carrinho
  const clearCart = () => {
    // Remover todos os itens atuais
    itemsToDisplay.forEach(item => {
      removeItem(item.id);
    });
    
    // Limpar localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bob_cart_items_v2');
      
      // Disparar evento para notificar outras partes da aplicação
      const event = new CustomEvent('cartUpdated', { 
        detail: { action: 'clear' }
      });
      window.dispatchEvent(event);
    }
    
    // Resetar estados locais
    setLocalItems([]);
    setCartState(prevState => prevState + 1);
  };
  
  // Inicializar e sincronizar localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Inicializando e sincronizando localStorage no carrinho novo');
      
      try {
        // Verificar se há itens no localStorage
        const storedItems = localStorage.getItem('bob_cart_items_v2');
        if (storedItems) {
          try {
            const parsed = JSON.parse(storedItems);
            if (Array.isArray(parsed) && parsed.length > 0) {
              console.log('Itens encontrados no localStorage:', parsed);
              setLocalItems(parsed);
            } else {
              console.log('Array de itens vazio ou inválido no localStorage');
            }
          } catch (e) {
            console.error('Erro ao parsear itens do localStorage:', e);
          }
        } else {
          console.log('Nenhum item encontrado no localStorage');
        }
        
        // Limpar chaves antigas
        const oldKeys = ['cartItems', 'bobsCart', 'removedCartItems'];
        oldKeys.forEach(key => {
          if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
          }
        });
        
        // Forçar sincronização com o novo formato
        if (items.length > 0) {
          console.log('Sincronizando itens com o novo formato:', items);
          localStorage.setItem('bob_cart_items_v2', JSON.stringify(items));
          
          // Garantir que a lista de removidos esteja inicializada
          if (!localStorage.getItem('bob_removed_items_v2')) {
            localStorage.setItem('bob_removed_items_v2', JSON.stringify([]));
          }
        } else {
          console.log('Context items vazio, verificando localStorage');
          // Verifica se existem itens no localStorage que não estão no contexto
          if (storedItems) {
            try {
              const parsed = JSON.parse(storedItems);
              if (Array.isArray(parsed) && parsed.length > 0) {
                console.log('Itens encontrados apenas no localStorage, forçando atualização');
                // Aqui seria ideal atualizar o contexto, mas como não temos acesso direto
                // ao setItems, apenas mantemos o localStorage intacto
              }
            } catch (e) {
              console.error('Erro ao verificar localStorage para itens:', e);
            }
          } else {
            localStorage.removeItem('bob_cart_items_v2');
          }
        }
      } catch (error) {
        console.error('Erro ao sincronizar localStorage:', error);
      }
    }
  }, [items]);
  
  // Força uma atualização quando os itens do carrinho mudam
  useEffect(() => {
    console.log('Items atualizados no contexto:', items.length);
    setCartState(prevState => prevState + 1);
  }, [items]);
  
  // Efeito para detectar renderização do cliente
  useEffect(() => {
    setIsClient(true);
    console.log('Cliente renderizado, itens no contexto:', items.length);
    
    // Verificar localStorage imediatamente após renderização
    if (typeof window !== 'undefined') {
      const storedItems = localStorage.getItem('bob_cart_items_v2');
      if (storedItems) {
        try {
          const parsed = JSON.parse(storedItems);
          if (Array.isArray(parsed)) {
            console.log('Itens no localStorage após renderização:', parsed.length);
            if (parsed.length > 0 && items.length === 0) {
              console.log('Itens encontrados apenas no localStorage, definindo localItems');
              setLocalItems(parsed);
            }
          }
        } catch (e) {
          console.error('Erro ao verificar localStorage após renderização:', e);
        }
      }
    }
    
    // Adicionar listener para evento customizado de atualização do carrinho
    const handleCartUpdate = () => {
      console.log('Evento de atualização do carrinho detectado');
      
      // Verificar localStorage após evento
      if (typeof window !== 'undefined') {
        const storedItems = localStorage.getItem('bob_cart_items_v2');
        if (storedItems) {
          try {
            const parsed = JSON.parse(storedItems);
            if (Array.isArray(parsed)) {
              console.log('Itens no localStorage após evento:', parsed.length);
              if (parsed.length > 0) {
                setLocalItems(parsed);
              }
            }
          } catch (e) {
            console.error('Erro ao verificar localStorage após evento:', e);
          }
        }
      }
      
      setCartState(prev => prev + 1);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [items]);
  
  // Função para remover item com atualização imediata
  const handleRemoveItem = (itemId: string) => {
    // Encontrar o item antes de removê-lo
    const itemToRemove = items.find(item => item.id === itemId) || localItems.find(item => item.id === itemId);
    
    if (itemToRemove) {
      // Remover o item usando a função do contexto
      removeItem(itemId);
      
      // Atualizar local items para refletir a mudança imediatamente
      setLocalItems(prevItems => prevItems.filter(item => item.id !== itemId));
      
      // Forçar re-renderização para atualizar a UI
      setCartState(prevState => prevState + 1);
      
      try {
        // Garantir que o localStorage seja limpo corretamente
        localStorage.removeItem('cartItems');
        localStorage.removeItem('bobsCart');
        
        // Atualizar as chaves do novo sistema
        let filteredItems = items.filter(item => item.id !== itemId);
        
        // Salvar itens atualizados
        if (filteredItems.length > 0) {
          localStorage.setItem('bob_cart_items_v2', JSON.stringify(filteredItems));
        } else {
          localStorage.removeItem('bob_cart_items_v2');
        }
        
        // Carregar lista de IDs removidos existente
        let removedIds: string[] = [];
        const storedRemovedIds = localStorage.getItem('bob_removed_items_v2');
        if (storedRemovedIds) {
          try {
            const parsedIds = JSON.parse(storedRemovedIds);
            if (Array.isArray(parsedIds)) {
              removedIds = parsedIds;
            }
          } catch (error) {
            console.error('Erro ao carregar IDs removidos:', error);
          }
        }
        
        // Adicionar o ID do produto à lista de removidos se não existir
        if (itemToRemove.product.id && !removedIds.includes(itemToRemove.product.id)) {
          removedIds.push(itemToRemove.product.id);
          localStorage.setItem('bob_removed_items_v2', JSON.stringify(removedIds));
        }
        
        // Disparar evento para notificar outras partes da aplicação
        const event = new CustomEvent('cartUpdated', { 
          detail: { 
            action: 'remove',
            itemId,
            productId: itemToRemove.product.id,
            removedIds
          }
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('Erro ao processar remoção de item:', error);
      }
    }
  };
  
  // Função para atualizar quantidade
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    updateItemQuantity(itemId, newQuantity);
    setCartState(prevState => prevState + 1);
  };
  
  // Indicador de carregamento
  if (!isClient) {
    return (
      <div className="bg-white min-h-[100vh] w-full flex items-center justify-center">
        <div className="flex items-center">
          <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce mr-1" style={{animationDelay: '0ms'}}></div>
          <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce mr-1" style={{animationDelay: '150ms'}}></div>
          <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    );
  }

  // Carrinho vazio
  if (itemsToDisplay.length === 0) {
    return (
      <div className="bg-white min-h-[100vh] w-full">
        <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="h-12 w-12 text-gray-400 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-700 mb-2">Carrinho vazio</h2>
          <p className="text-sm text-gray-500 mb-4 text-center">Adicione produtos para continuar</p>
          <Link href="/" className="bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-6 rounded">
            Voltar para o cardápio
          </Link>
        </div>

        <div className="p-4 md:p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Sugestões para você</h2>
          <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
            {sugestoesProdutos.map((produto) => (
              <Link href={`/produto/${produto.id}`} key={produto.id} className="flex-shrink-0 w-40 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="relative h-40 w-full bg-gray-100">
                  <Image
                    src={produto.image}
                    alt={produto.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-1 right-1 w-7 h-7 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)] flex items-center justify-center hover:bg-gray-50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-500"
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-red-500 line-clamp-1">{produto.name}</h3>
                  <p className="text-xs text-gray-800 mt-2">R$ {produto.price.toFixed(2).replace('.', ',')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Carrinho com itens
  return (
    <div className="bg-white min-h-[100vh] w-full">
      {/* Cabeçalho Fixo */}
      <header className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <h1 className="text-base font-bold text-gray-800">Sacola</h1>
          <button 
            onClick={clearCart}
            className="text-red-500 text-sm font-medium"
          >
            Limpar
          </button>
        </div>
      </header>

      <div className="p-4 max-w-3xl mx-auto">
        {/* Lista de itens no carrinho */}
        <div className="space-y-5 mb-8">
          {itemsToDisplay.map((item) => {
            // Função para obter o nome de um extra pelo ID
            const getExtraName = (extraId: string) => {
              const extra = item.product.extras?.find(e => e.id === extraId);
              return extra ? extra.name : '';
            };

            // Função para obter o nome de um molho pelo ID
            const getSauceName = (sauceId: string) => {
              const sauce = item.product.sauces?.find(s => s.id === sauceId);
              return sauce ? sauce.name : '';
            };

            // Função para obter o nome de um acompanhamento pelo ID
            const getSideName = (sideId: string | null) => {
              if (!sideId) return '';
              const side = item.product.sides?.find(s => s.id === sideId);
              return side ? side.name : '';
            };

            // Função para obter o nome de um adicional pelo ID
            const getAddonName = (addonId: string) => {
              const addon = item.product.addons?.find(a => a.id === addonId);
              return addon ? addon.name : '';
            };

            return (
              <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg relative">
                {/* Botão de remover */}
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                  aria-label="Remover item"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
                
                {/* Imagem do produto com botão de editar */}
                <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-white">
                  <Image 
                    src={item.product.image} 
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                  <Link 
                    href={`/produto/${item.product.id}?edit=true&itemId=${item.id}&extras=${JSON.stringify(item.selectedExtras)}&sauces=${JSON.stringify(item.selectedSauces)}&side=${item.selectedSide || ''}&addons=${JSON.stringify(item.selectedAddons)}&quantity=${item.quantity}`}
                    className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-red-500"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </Link>
                </div>

                {/* Informações do produto */}
                <div className="flex-1 min-w-0 pr-6">
                  <h3 className="font-bold text-red-500 text-sm">{item.product.name}</h3>
                  
                  {/* Complementos resumidos */}
                  {(Object.entries(item.selectedExtras).length > 0 || 
                    Object.entries(item.selectedSauces).length > 0 || 
                    item.selectedSide || 
                    item.selectedAddons.length > 0 || 
                    item.observation) && (
                    <div className="text-xs text-gray-500 mt-2 line-clamp-1">
                      {Object.entries(item.selectedExtras).length > 0 && 
                        `${Object.entries(item.selectedExtras).map(([id, qty]) => `${qty}x ${getExtraName(id)}`).join(', ')} `}
                      {Object.entries(item.selectedSauces).length > 0 && 
                        `${Object.entries(item.selectedSauces).map(([id, qty]) => `${qty}x ${getSauceName(id)}`).join(', ')} `}
                      {item.selectedSide && `${getSideName(item.selectedSide)} `}
                      {item.selectedAddons.length > 0 && 
                        `${item.selectedAddons.map(id => getAddonName(id)).join(', ')} `}
                    </div>
                  )}
                  
                  {/* Preço e controles de quantidade */}
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm font-semibold text-gray-900">
                      R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                    </div>
                    
                    <div className="flex items-center bg-gray-100 rounded-full">
                      <button 
                        className="w-7 h-7 rounded-full text-red-500 flex items-center justify-center"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <span className="px-3 font-medium text-xs">{item.quantity}</span>
                      <button 
                        className="w-7 h-7 rounded-full text-red-500 flex items-center justify-center"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Link para adicionar mais itens */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-red-500 text-sm font-medium flex items-center justify-center gap-2 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Adicionar mais itens
          </Link>
        </div>

        {/* Sugestões de produtos compactas */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Você também pode gostar</h2>
          <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
            {sugestoesProdutos.slice(0, 3).map((produto) => (
              <Link href={`/produto/${produto.id}`} key={produto.id} className="flex-shrink-0 w-32 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <div className="relative h-32 w-full bg-gray-100">
                  <Image
                    src={produto.image}
                    alt={produto.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-red-500"
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-red-500 text-xs line-clamp-1">{produto.name}</h3>
                  <p className="text-xs text-gray-800 mt-1">R$ {produto.price.toFixed(2).replace('.', ',')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Resumo do pedido - Espaçamento aumentado */}
        <div className="bg-white border-t border-b border-gray-200 py-5 mb-5">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>R$ {getTotalPrice().toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxa de entrega</span>
              <span>R$ 5,90</span>
            </div>
            <div className="flex justify-between pt-3 mt-3 border-t border-gray-100 font-bold">
              <span>Total</span>
              <span className="text-red-500">
                R$ {(getTotalPrice() + 5.9).toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>
        
        {/* Pagamento - Espaçamento aumentado */}
        <div className="flex items-center gap-3 mb-6 py-4 border-b border-gray-200">
          <div className="w-6 h-6 relative flex-shrink-0">
            <Image 
              src="https://static.ifood-static.com.br/image/upload/t_thumbnail/icones/payments/brands/3dc38545-6c1b-43a0-a2d0-dd2e1ac3bc73"
              alt="Pix"
              width={24}
              height={24}
            />
          </div>
          <span className="text-sm font-medium">Pagamento Com Pix</span>
          <span className="text-red-500 text-xs ml-auto">Trocar</span>
        </div>
        
        {/* Espaço para o rodapé fixo */}
        <div className="h-20"></div>
      </div>

      {/* Rodapé fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm z-50">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <a 
            href="/checkout.html" 
            className="bg-red-500 text-white font-medium py-3 rounded-md w-full flex items-center justify-center"
          >
            <span>Fazer pedido</span>
          </a>
        </div>
      </div>
    </div>
  );
} 