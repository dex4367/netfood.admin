"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Product, Extra, Side, Sauce, Addon } from '@/data/products';

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

export const dynamic = 'force-dynamic';

export default function CarrinhoPage() {
  const { items, removeItem, updateItemQuantity, getTotalPrice } = useCart();
  const [isClient, setIsClient] = useState(false);
  const [cartState, setCartState] = useState<number>(0);
  
  // Inicializar e sincronizar localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Inicializando e sincronizando localStorage');
      
      try {
        // Limpar chaves antigas
        const oldKeys = ['cartItems', 'bobsCart', 'removedCartItems'];
        oldKeys.forEach(key => {
          if (localStorage.getItem(key)) {
            console.log(`Removendo chave antiga: ${key}`);
            localStorage.removeItem(key);
          }
        });
        
        // Forçar sincronização com o novo formato
        if (items.length > 0) {
          console.log('Sincronizando itens com o novo formato');
          localStorage.setItem('bob_cart_items_v2', JSON.stringify(items));
          
          // Garantir que a lista de removidos esteja inicializada
          if (!localStorage.getItem('bob_removed_items_v2')) {
            localStorage.setItem('bob_removed_items_v2', JSON.stringify([]));
          }
        } else {
          localStorage.removeItem('bob_cart_items_v2');
        }
      } catch (error) {
        console.error('Erro ao sincronizar localStorage:', error);
      }
    }
  }, [items]);
  
  // Força uma atualização quando os itens do carrinho mudam
  useEffect(() => {
    setCartState(prevState => prevState + 1);
  }, [items]);
  
  // Efeito para detectar renderização do cliente e configurar event listener
  useEffect(() => {
    setIsClient(true);
    console.log('Renderização do cliente - Itens do carrinho:', items);
    
    // Adicionar listener para evento customizado de atualização do carrinho
    const handleCartUpdate = () => {
      console.log('Evento de atualização do carrinho detectado');
      setCartState(prev => prev + 1);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);
  
  // Função para remover item com atualização imediata
  const handleRemoveItem = (itemId: string) => {
    // Encontrar o item antes de removê-lo
    const itemToRemove = items.find(item => item.id === itemId);
    
    if (itemToRemove) {
      // Remover o item usando a função do contexto
      removeItem(itemId);
      
      // Forçar re-renderização para atualizar a UI
      setCartState(prevState => prevState + 1);
      
      try {
        // Garantir que o localStorage seja limpo corretamente
        // Removendo todas as chaves antigas
        localStorage.removeItem('cartItems');
        localStorage.removeItem('bobsCart');
        
        // Atualizar as chaves do novo sistema
        const filteredItems = items.filter(item => item.id !== itemId);
        
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
        console.log('Item removido com sucesso:', itemToRemove.product.id);
      } catch (error) {
        console.error('Erro ao processar remoção de item:', error);
      }
    }
  };
  
  // Função para atualizar quantidade com atualização imediata
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    updateItemQuantity(itemId, newQuantity);
    // Força re-renderização para atualizar o total
    setCartState(prevState => prevState + 1);
  };
  
  // Só renderiza os componentes interativos quando estamos no cliente
  if (!isClient) {
    return (
      <div className="bg-white min-h-[100vh] w-full flex items-center justify-center">
        <div className="flex items-center">
          <div className="h-2 w-2 bg-bobs-red rounded-full animate-bounce mr-1" style={{animationDelay: '0ms'}}></div>
          <div className="h-2 w-2 bg-bobs-red rounded-full animate-bounce mr-1" style={{animationDelay: '150ms'}}></div>
          <div className="h-2 w-2 bg-bobs-red rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    );
  }

  // Carrinho vazio
  if (items.length === 0) {
    console.log('Carrinho vazio na renderização');
    return (
      <div className="bg-white min-h-[100vh] w-full">
        <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <ShoppingCartIcon className="h-12 w-12 text-gray-400 mb-3" />
          <h2 className="text-lg font-bold text-gray-700 mb-2">Carrinho vazio</h2>
          <p className="text-sm text-gray-500 mb-4 text-center">Adicione produtos para continuar</p>
          <Link href="/" className="bg-bobs-red hover:bg-red-700 text-white font-medium py-2 px-6 rounded">
            Voltar para o cardápio
          </Link>
            </div>

        {/* Sugestões de produtos - CARRINHO VAZIO */}
        <div className="p-4 md:p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Sugestões para você</h2>
          <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
            {sugestoesProdutos.map((produto) => (
              <Link href={`/produto/${produto.id}`} key={produto.id} className="flex-shrink-0 w-40 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="relative h-40 w-full bg-gray-100">
                    <Image
                    src={produto.image}
                    alt={produto.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-bobs-red line-clamp-1">{produto.name}</h3>
                  <p className="text-xs text-gray-800 mt-2">R$ {produto.price.toFixed(2).replace('.', ',')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  console.log('Renderizando carrinho com itens:', items.length);

  // Carrinho com itens
  return (
    <div className="bg-white min-h-[100vh] w-full">
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Seu carrinho</h1>
          <Link href="/" className="text-gray-400 hover:text-gray-600 flex items-center gap-2 text-sm">
            <ArrowLeftIcon className="h-4 w-4" />
            Continuar comprando
          </Link>
        </div>

        {/* Lista de itens no carrinho */}
        <div className="space-y-4 mb-6">
          {items.map((item) => {
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
              <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg relative">
                {/* Botão de remover (reposicionado) */}
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 bg-white rounded-full p-1 shadow-sm"
                  aria-label="Remover item"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                
                {/* Imagem do produto com botão de editar */}
                <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-white">
                  <Image 
                    src={item.product.image} 
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                  <Link 
                    href={`/produto/${item.product.id}?edit=true&itemId=${item.id}&extras=${JSON.stringify(item.selectedExtras)}&sauces=${JSON.stringify(item.selectedSauces)}&side=${item.selectedSide || ''}&addons=${JSON.stringify(item.selectedAddons)}&quantity=${item.quantity}`}
                    className="absolute top-1 right-1 w-7 h-7 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)] flex items-center justify-center hover:bg-gray-50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-200"
                    title="Editar item"
                  >
                    <EditIcon className="h-3.5 w-3.5 text-bobs-red" />
                  </Link>
      </div>

                {/* Informações do produto */}
                <div className="flex-1 min-w-0 pr-8">
              <div className="flex justify-between">
                    <h3 className="font-bold text-bobs-red">{item.product.name}</h3>
                  </div>
                  
                  {/* Complementos - Exibição vertical */}
                  <div className="mt-2 space-y-2 text-sm text-gray-600">
                    {Object.entries(item.selectedExtras).length > 0 && (
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">Extras:</span>
                        <ul className="pl-4 mt-1 list-disc space-y-1">
                          {Object.entries(item.selectedExtras).map(([extraId, quantity]) => (
                            <li key={extraId}>
                              <span>{quantity}x {getExtraName(extraId)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {Object.entries(item.selectedSauces).length > 0 && (
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">Molhos:</span>
                        <ul className="pl-4 mt-1 list-disc space-y-1">
                          {Object.entries(item.selectedSauces).map(([sauceId, quantity]) => (
                            <li key={sauceId}>
                              <span>{quantity}x {getSauceName(sauceId)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {item.selectedSide && (
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">Acompanhamento:</span>
                        <span className="pl-4">{getSideName(item.selectedSide)}</span>
                      </div>
                    )}
                    
                    {item.selectedAddons.length > 0 && (
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">Adicionais:</span>
                        <ul className="pl-4 mt-1 list-disc space-y-1">
                          {item.selectedAddons.map(addonId => (
                            <li key={addonId}>
                              <span>{getAddonName(addonId)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {item.observation && (
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">Observações:</span>
                        <span className="pl-4 italic">{item.observation}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Preço e controles de quantidade */}
                <div className="flex justify-between items-center mt-4 md:mt-0 md:flex-col md:items-end md:min-w-[100px]">
                  <div className="text-sm font-bold text-gray-900">
                    R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                  </div>
                  
                  <div className="flex items-center bg-gray-100 rounded-full p-1 mt-2">
                    <button 
                      className="w-7 h-7 rounded-full text-bobs-red flex items-center justify-center"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <span className="px-3 font-medium text-sm">{item.quantity}</span>
                    <button 
                      className="w-7 h-7 rounded-full text-bobs-red flex items-center justify-center"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sugestões de produtos - carrinho com itens */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Você também pode gostar</h2>
          <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
            {sugestoesProdutos.map((produto) => (
              <Link href={`/produto/${produto.id}`} key={produto.id} className="flex-shrink-0 w-40 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="relative h-40 w-full bg-gray-100">
                  <Image
                    src={produto.image}
                    alt={produto.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-bobs-red line-clamp-1">{produto.name}</h3>
                  <p className="text-xs text-gray-800 mt-2">R$ {produto.price.toFixed(2).replace('.', ',')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Resumo do pedido */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg mb-6">
          <h2 className="text-lg font-bold mb-4">Resumo do pedido</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">R$ {getTotalPrice().toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
              <span className="text-gray-600">Taxa de entrega</span>
              <span className="font-medium">R$ 5,90</span>
            </div>
            <div className="flex justify-between pt-3 mt-3 border-t border-gray-100">
              <span className="font-bold">Total</span>
              <span className="font-bold text-bobs-red">
                R$ {(getTotalPrice() + 5.9).toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>
        
        {/* Pagamento */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg mb-6">
          <h2 className="text-lg font-bold mb-4">Pagamento</h2>
          
          <div className="border border-gray-200 rounded-lg mb-4">
            <div className="flex justify-between items-center p-4 cursor-pointer">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.9997 22C17.5226 22 21.9997 17.5228 21.9997 12C21.9997 6.47715 17.5226 2 11.9997 2C6.47687 2 1.99972 6.47715 1.99972 12C1.99972 17.5228 6.47687 22 11.9997 22Z" fill="#32BCAD" />
                    <path d="M6.65999 13.5L9.99999 16.9L18.34 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">Pagamento Com Pix</span>
                </div>
              </div>
              <div className="text-red-500 font-medium">
                <span>Trocar</span>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center p-4 cursor-pointer">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 10H21" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">CPF/CNPJ na nota</span>
                </div>
              </div>
              <div className="text-red-500 font-medium">
                <span>Trocar</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Espaço extra para evitar que o rodapé cubra conteúdo */}
        <div style={{ height: '20px' }}></div>
      </div>

      {/* Rodapé fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_12px_rgba(0,0,0,0.1)] z-50">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <div className="payment-action flex justify-center">
            <a 
              href="/checkout.html"
              className="bg-bobs-red text-white font-medium py-3 rounded-md w-full max-w-[375px] flex items-center justify-center"
              style={{borderRadius: '4px'}}
            >
              <span className="font-medium">Fazer pedido</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Shopping cart icon
function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

// Trash icon
function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

// Arrow left icon
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

// Edit icon
function EditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
