"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Extra, Side, Sauce, Addon } from '../../../data/products';
import { useCart, CartItem } from '../../../context/CartContext';

interface ProductDetailsProps {
  product: Product;
  editData?: {
    itemId: string | null;
    extras: { [key: string]: number };
    sauces: { [key: string]: number };
    side: string | null;
    addons: string[];
    quantity: number;
  } | null;
}

export default function ProductDetails({ product, editData }: ProductDetailsProps) {
  // Inicializar estados com dados de edição, se disponíveis
  const [quantity, setQuantity] = useState(editData?.quantity || 1);
  const [selectedSide, setSelectedSide] = useState<string | null>(editData?.side || null);
  const [extraQuantities, setExtraQuantities] = useState<{ [key: string]: number }>(editData?.extras || {});
  const [sauceQuantities, setSauceQuantities] = useState<{ [key: string]: number }>(editData?.sauces || {});
  const [selectedAddons, setSelectedAddons] = useState<string[]>(editData?.addons || []);
  const [observation, setObservation] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { addItem, updateItem } = useCart();

  const addExtraQuantity = (extraId: string) => {
    setExtraQuantities(prev => ({
      ...prev,
      [extraId]: (prev[extraId] || 0) + 1
    }));
  };
  
  const decreaseExtraQuantity = (extraId: string) => {
    setExtraQuantities(prev => {
      const currentQuantity = prev[extraId] || 0;
      if (currentQuantity <= 1) {
        const newExtras = { ...prev };
        delete newExtras[extraId];
        return newExtras;
      }
      return {
        ...prev,
        [extraId]: currentQuantity - 1
      };
    });
  };
  
  const addSauceQuantity = (sauceId: string) => {
    setSauceQuantities(prev => ({
      ...prev,
      [sauceId]: (prev[sauceId] || 0) + 1
    }));
  };
  
  const decreaseSauceQuantity = (sauceId: string) => {
    setSauceQuantities(prev => {
      const currentQuantity = prev[sauceId] || 0;
      if (currentQuantity <= 1) {
        const newSauces = { ...prev };
        delete newSauces[sauceId];
        return newSauces;
      }
      return {
        ...prev,
        [sauceId]: currentQuantity - 1
      };
    });
  };
  
  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(prev => prev.filter(id => id !== addonId));
    } else {
      setSelectedAddons(prev => [...prev, addonId]);
    }
  };
  
  const calcularTotalCarrinho = () => {
    if (!product) return 0;
    
    let total = product.price;
    
    // Adiciona valor dos extras com suas quantidades
    if (product.extras) {
      product.extras.forEach(extra => {
        const extraQuantity = extraQuantities[extra.id] || 0;
        if (extraQuantity > 0) {
          total += extra.price * extraQuantity;
        }
      });
    }
    
    // Adiciona valor do acompanhamento
    if (selectedSide && product.sides) {
      const side = product.sides.find(side => side.id === selectedSide);
      if (side) {
        total += side.price;
      }
    }
    
    // Adiciona valor dos molhos com suas quantidades
    if (product.sauces) {
      product.sauces.forEach(sauce => {
        const sauceQuantity = sauceQuantities[sauce.id] || 0;
        if (sauceQuantity > 0) {
          total += sauce.price * sauceQuantity;
        }
      });
    }
    
    // Multiplicar pela quantidade
    total = total * quantity;
    
    return total;
  };

  const calcularTotalCarrinhoFormatado = () => {
    const total = calcularTotalCarrinho();
    return total.toFixed(2).replace('.', ',');
  };

  const addToCart = () => {
    // Calcular o preço total
    const totalValue = calcularTotalCarrinho();
    
    // Verificar se o produto está na lista de produtos removidos
    // Comentamos temporariamente para resolver o problema
    /*
    if (typeof window !== 'undefined' && !editData?.itemId) {
      const storedRemovedIds = localStorage.getItem('bob_removed_items_v2');
      if (storedRemovedIds) {
        try {
          const removedIds = JSON.parse(storedRemovedIds);
          if (Array.isArray(removedIds) && removedIds.includes(product.id)) {
            console.log('Este produto foi removido anteriormente e não pode ser adicionado novamente.');
            alert('Este produto foi removido do carrinho e não pode ser adicionado novamente.');
            return;
          }
        } catch (error) {
          console.error('Erro ao verificar lista de produtos removidos:', error);
        }
      }
    }
    */
    
    console.log('Função addToCart foi chamada', { editData, quantity });
    
    // Criar o objeto do item do carrinho
    const cartItem: CartItem = {
      id: editData?.itemId || `${product.id}-${Date.now()}`, // Gerar ID único se for novo item
      product,
      quantity,
      selectedExtras: extraQuantities,
      selectedSide,
      selectedSauces: sauceQuantities,
      selectedAddons,
      observation,
      totalPrice: totalValue
    };
    
    if (editData?.itemId) {
      console.log('Atualizando item existente', editData.itemId);
      // Se estiver editando, atualiza o item existente
      updateItem(editData.itemId, cartItem);
      // Mostrar confirmação e redirecionar para o carrinho
      setShowConfirmation(true);
      setTimeout(() => {
        window.location.href = '/carrinho-novo';
      }, 1000);
    } else {
      console.log('Adicionando novo item');
      // Se for novo, adiciona como novo item
      addItem(cartItem);
      
      // Limpar qualquer entrada antiga para evitar problemas
      if (typeof window !== 'undefined') {
        // Verificar se precisamos inicializar o localStorage com o novo sistema
        const hasNewFormat = localStorage.getItem('bob_cart_items_v2') !== null;
        
        if (!hasNewFormat) {
          // Limpar chaves antigas para garantir que não haja conflito
          ['cartItems', 'bobsCart'].forEach(key => {
            localStorage.removeItem(key);
          });
        }
        
        // Forçar salvamento no localStorage manualmente
        try {
          // Obter itens existentes
          let existingItems = [];
          const storedItems = localStorage.getItem('bob_cart_items_v2');
          if (storedItems) {
            try {
              const parsed = JSON.parse(storedItems);
              if (Array.isArray(parsed)) {
                existingItems = parsed;
              }
            } catch (e) {
              console.error('Erro ao parsear itens existentes:', e);
            }
          }
          
          // Adicionar o novo item 
          existingItems.push(cartItem);
          
          // Salvar de volta
          localStorage.setItem('bob_cart_items_v2', JSON.stringify(existingItems));
          
          // Disparar evento
          window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { items: existingItems, action: 'add' } 
          }));
          
          console.log('Item adicionado manualmente ao localStorage', existingItems);
        } catch (error) {
          console.error('Erro ao salvar item no localStorage:', error);
        }
      }
      
      // Redirecionar para o carrinho novo após adicionar
      window.location.href = '/carrinho-novo';
    }
  };

  return (
    <div className="container max-w-2xl mx-auto pb-20">
      {/* Cabeçalho com logo */}
      <div className="sticky top-0 z-10 bg-white border-b border-red-100 shadow-sm">
        <div className="flex items-center p-3">
          <Link href="/" className="flex items-center text-bobs-red">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-center flex-1 font-bold text-lg text-gray-800">Detalhes do produto</h1>
        </div>
      </div>

      {/* Imagem destaque */}
      <div className="w-full h-64 relative">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Informações do produto */}
      <div className="px-4 pt-4 pb-3 border-b">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
        <div className="text-xl font-bold text-bobs-red">R$ {product.price.toFixed(2).replace('.', ',')}</div>
      </div>

      {/* Renderizar seções apenas para categorias específicas */}
      {product.category !== 'Bebidas' && product.category !== 'Sobremesas' && (
        <>
          {/* Extras */}
          {product.extras && product.extras.length > 0 && (
            <div className="border-b">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="font-bold text-bobs-red">Extras</h3>
                <p className="text-xs text-gray-500">Personalize seu lanche</p>
              </div>
              
              <div className="divide-y divide-gray-100">
                {product.extras.map(extra => {
                  const extraQuantity = extraQuantities[extra.id] || 0;
                  return (
                  <div 
                    key={extra.id} 
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center pr-3">
                      {extra.image && (
                        <div className="h-14 w-14 relative mr-3 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={extra.image}
                            alt={extra.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm">{extra.name}</h4>
                        {extra.description && <p className="text-xs text-gray-500 mt-0.5">{extra.description}</p>}
                        <p className="text-sm text-bobs-red mt-1">+R$ {extra.price.toFixed(2).replace('.', ',')}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {extraQuantity > 0 ? (
                        <div className="flex items-center bg-gray-100 rounded-full p-1">
                          <button 
                            className="w-7 h-7 rounded-full text-bobs-red flex items-center justify-center"
                            onClick={() => decreaseExtraQuantity(extra.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <span className="px-3 font-medium text-sm">{extraQuantity}</span>
                          <button 
                            className="w-7 h-7 rounded-full text-bobs-red flex items-center justify-center"
                            onClick={() => addExtraQuantity(extra.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addExtraQuantity(extra.id)}
                          className="w-7 h-7 rounded-full border border-bobs-red text-bobs-red flex items-center justify-center flex-shrink-0 transition-colors hover:bg-bobs-red hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}

          {/* Acompanhamentos */}
          {product.sides && product.sides.length > 0 && (
            <div className="border-b">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="font-bold text-bobs-red">Acompanhamentos</h3>
                <p className="text-xs text-gray-500">Escolha um acompanhamento</p>
              </div>
              
              <div className="divide-y divide-gray-100">
                {product.sides.map(side => (
                  <div 
                    key={side.id} 
                    className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedSide(side.id)}
                  >
                    <div className="flex items-center pr-3">
                      {side.image && (
                        <div className="h-14 w-14 relative mr-3 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={side.image}
                            alt={side.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm">{side.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{side.description}</p>
                        <p className="text-sm text-bobs-red mt-1">+R$ {side.price.toFixed(2).replace('.', ',')}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                      selectedSide === side.id 
                        ? 'border-bobs-red' 
                        : 'border-gray-300'
                    }`}>
                      {selectedSide === side.id && (
                        <div className="w-3 h-3 rounded-full bg-bobs-red"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Molhos */}
          {product.sauces && product.sauces.length > 0 && (
            <div className="border-b">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="font-bold text-bobs-red">Molhos</h3>
                <p className="text-xs text-gray-500">Escolha seus molhos</p>
              </div>
              
              <div className="divide-y divide-gray-100">
                {product.sauces.map(sauce => {
                  const sauceQuantity = sauceQuantities[sauce.id] || 0;
                  return (
                  <div 
                    key={sauce.id} 
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center pr-3">
                      {sauce.image && (
                        <div className="h-14 w-14 relative mr-3 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={sauce.image}
                            alt={sauce.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm">{sauce.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{sauce.description}</p>
                        <p className="text-sm text-bobs-red mt-1">+R$ {sauce.price.toFixed(2).replace('.', ',')}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {sauceQuantity > 0 ? (
                        <div className="flex items-center bg-gray-100 rounded-full p-1">
                          <button 
                            className="w-7 h-7 rounded-full text-bobs-red flex items-center justify-center"
                            onClick={() => decreaseSauceQuantity(sauce.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <span className="px-3 font-medium text-sm">{sauceQuantity}</span>
                          <button 
                            className="w-7 h-7 rounded-full text-bobs-red flex items-center justify-center"
                            onClick={() => addSauceQuantity(sauce.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addSauceQuantity(sauce.id)}
                          className="w-7 h-7 rounded-full border border-bobs-red text-bobs-red flex items-center justify-center flex-shrink-0 transition-colors hover:bg-bobs-red hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}
        </>
      )}

      {/* Adicionais - Exibidos para todos os produtos */}
      {product.addons && product.addons.length > 0 && (
        <div className="border-b">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h3 className="font-bold text-bobs-red">Adicionais</h3>
            <p className="text-xs text-gray-500">Itens extras para seu pedido</p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {product.addons.map(addon => (
              <div 
                key={addon.id} 
                className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleAddon(addon.id)}
              >
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">{addon.name}</h4>
                  {addon.price > 0 && (
                    <p className="text-sm text-bobs-red mt-1">+R$ {addon.price.toFixed(2).replace('.', ',')}</p>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedAddons.includes(addon.id) 
                    ? 'border-bobs-red' 
                    : 'border-gray-300'
                }`}>
                  {selectedAddons.includes(addon.id) && (
                    <div className="w-3 h-3 rounded-full bg-bobs-red"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Observações */}
      <div className="p-4 border-b">
        <label className="block text-sm font-medium text-gray-600 mb-2">Observações</label>
        <textarea 
          className="w-full p-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-bobs-red"
          placeholder="Alguma observação para o seu pedido?"
          rows={2}
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
        />
      </div>

      {/* Barra fixa inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Contador com estilo de retângulo branco com bordas */}
            <div className="flex items-center border border-gray-200 rounded-md h-[46px] px-3 flex-shrink-0">
              <button 
                type="button"
                className="text-[#EA1D2C] text-2xl font-medium w-6"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                −
              </button>
              <div className="mx-4 font-medium">{quantity}</div>
              <button 
                type="button"
                className="text-[#EA1D2C] text-2xl font-medium w-6"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            
            {/* Botão de adicionar */}
            <button
              type="button"
              className="flex-1 bg-[#EA1D2C] text-white font-medium h-[46px] rounded-md flex items-center justify-between px-4"
              onClick={addToCart}
            >
              {editData && showConfirmation ? (
                <span className="flex items-center justify-center w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Atualizado!
                </span>
              ) : (
                <>
                  <span>{editData ? 'Atualizar' : 'Adicionar'}</span>
                  <span>R$ {calcularTotalCarrinhoFormatado()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}