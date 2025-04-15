"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BannerCarousel } from '@/components/ui/banner-carousel';
import { FeaturedProductsCarousel } from '@/components/ui/featured-products-carousel';
import { ProductCategory } from '@/components/ui/product-category';
import { CategoriesListMobile } from '@/components/ui/categories-list-mobile';
import { PageSkeleton } from '@/components/ui/product-skeleton';

export default function Home() {
  const [loading, setLoading] = useState(true);
  
  // Sincronizar localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Sincronizando localStorage na página inicial');
      try {
        // Limpar chaves antigas
        const oldKeys = ['cartItems', 'bobsCart', 'removedCartItems'];
        oldKeys.forEach(key => {
          if (localStorage.getItem(key)) {
            console.log(`Removendo chave antiga: ${key}`);
            localStorage.removeItem(key);
          }
        });
        
        // Garantir que as novas chaves estejam no lugar
        if (!localStorage.getItem('bob_removed_items_v2')) {
          localStorage.setItem('bob_removed_items_v2', JSON.stringify([]));
        }
        
        // Se o carrinho estiver vazio em bob_cart_items_v2, remover a chave
        const cartItems = localStorage.getItem('bob_cart_items_v2');
        if (cartItems) {
          try {
            const parsedItems = JSON.parse(cartItems);
            if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
              localStorage.removeItem('bob_cart_items_v2');
            }
          } catch (error) {
            console.error('Erro ao processar itens do carrinho:', error);
            localStorage.removeItem('bob_cart_items_v2');
          }
        }
      } catch (error) {
        console.error('Erro ao sincronizar localStorage:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // If loading, show skeleton
  if (loading) {
    return <PageSkeleton />;
  }

  // Banner data
  const banners = [
    {
      id: 1,
      src: "/images/banners/banner1.jpg",
      alt: "Promoção Bob's 1"
    },
    {
      id: 2,
      src: "/images/banners/banner2.png",
      alt: "Promoção Bob's 2"
    },
    {
      id: 3,
      src: "/images/banners/banner3.png",
      alt: "Promoção Bob's 3"
    },
    {
      id: 4,
      src: "/images/banners/banner4.png",
      alt: "Promoção Bob's 4"
    },
    {
      id: 5,
      src: "/images/banners/banner5.jpg",
      alt: "Promoção Bob's 5"
    }
  ];

  // Featured products data
  const featuredProducts = [
    {
      id: "2",
      title: "3 Sanduíches por 49,90",
      description: "O combo é composto por 3 sanduíches clássicos à sua escolha. Escolha entre os seus lanches preferidos: Big Bob, Cheddar Australiano ou Double Cheese.",
      price: "49,90",
      image: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/6503b26e409f4c8331d2caeeba844a5a.png"
    },
    {
      id: "1",
      title: "Big Bob",
      description: "São dois hambúrgueres bovinos, queijo, alface e cebola fresquinhos e molho Big Bob Original, num pão quentinho com gergelim.",
      price: "18,99",
      image: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/202204061741_3282_i.jpg"
    },
    {
      id: "3",
      title: "2 Cheeseburguers + 1 Refri",
      description: "Clássico que todo mundo gosta tudo isso acompanhado de refrigerante.",
      price: "24,90",
      image: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/fb5466377a88236bb484991d472a48a1.jpg"
    },
    {
      id: "5",
      title: "Milk Shake Colherudo 300ml",
      description: "Aquele milkshake que só o Bob´s tem!",
      price: "18,90",
      image: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/d57c673008256be8b19c1f6333c6491c.jpg"
    },
    {
      id: "4",
      title: "Trio Big Bob + Sundae",
      description: "Na compra do nosso clássico Trio Big Bob, você ganha um Sundae grátis! O trio é composto por um Big Bob, uma porção média de batata palito e refrigerante.",
      price: "34,90",
      image: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/202111041521_1QBA_i.jpg"
    }
  ];

  // Categorias completas para a lista móvel
  const allCategories = [
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

  // Product categories data from chamaobobs.com.br
  const categories = [
    {
      id: 1,
      name: "Promoção do Dia",
      products: [
        {
          id: "4",
          name: "Trio Big Bob + Milk Shake 300ml",
          description: "Na compra do nosso clássico Trio Big Bob, você ganha um Sundae grátis! O trio é composto por um Big Bob (são dois hambúrgueres bovinos, queijo, alface e cebola fresquinhos e molho Big Bob Original, num pão quentinho com gergelim), uma porção média de batata palito e refrigerante.",
          price: "36,90",
          photo: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/5d90753b00b3038121091b63a9229736.png"
        }
      ]
    },
    {
      id: 2,
      name: "Destaques Bob's Fã",
      products: [
        {
          id: "1",
          name: "Big Bob",
          description: "Toda cremosidade do cheddar derretido, coberto com cebola shoyu e hambúrguer bovino, em um pão quentinho.",
          price: "18,99",
          photo: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/202204061741_3282_i.jpg"
        },
        {
          id: "2",
          name: "3 Sanduíches por 49,90",
          description: "O combo é composto por 3 sanduíches clássicos à sua escolha. Escolha entre os seus lanches preferidos: Big Bob, Cheddar Australiano ou Double Cheese.",
          price: "49,90",
          photo: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/6503b26e409f4c8331d2caeeba844a5a.png"
        },
        {
          id: "4",
          name: "Trio Big Bob + Sundae",
          description: "Na compra do nosso clássico Trio Big Bob, você ganha um Sundae grátis! O trio é composto por um Big Bob (são dois hambúrgueres bovinos, queijo, alface e cebola fresquinhos e molho Big Bob Original, num pão quentinho com gergelim), uma porção média de batata palito e refrigerante.",
          price: "34,90",
          photo: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/202111041521_1QBA_i.jpg"
        }
      ]
    },
    {
      id: 3,
      name: "Lançamentos",
      products: [
        {
          id: "5",
          name: "Milk Shake Colherudo 300ml",
          description: "O Milk Shake que você ama, com recheio sabor Chocolate ao Leite espatulado nas bordas do copo, batido com um bolo irresistível, calda de chocolate e baunilha gelada.",
          price: "18,90",
          photo: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/d57c673008256be8b19c1f6333c6491c.jpg"
        },
        {
          id: "3",
          name: "2 Cheeseburguers + 1 Refri",
          description: "Combo Burger é composto de 1 Cheeseburger + 1 Batata Minions P + 1 Bebida + 1 Brinde Minions Sortido.",
          price: "24,90",
          photo: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/fb5466377a88236bb484991d472a48a1.jpg"
        }
      ]
    },
    {
      id: 4,
      name: "Empório Bob´s",
      products: [
        {
          id: "6",
          name: "Molho Bob's Burger & Salad",
          description: "Ele é único e exclusivo! Receita autêntica criada em nossa cozinha deixando seu sanduíche ainda mais...",
          price: "21,90",
          photo: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/202210040945_HE15_i.jpg"
        },
        {
          id: "7",
          name: "Molho Big Bob 200g",
          description: "Ele é único e exclusivo! Aprecie o verdadeiro Molho Big Bob e deixe seu sanduíche ainda mais saboroso. Que tal abusar da criatividade para criar novas combinações? Imagina mergulhar aquela batatinha f",
          price: "21,90",
          photo: "https://storage.shopfood.io/public/companies/poe726g0/products/medium/202111041746_78R8_i.jpg"
        }
      ]
    }
  ];

  return (
    <div className="container px-[5px] py-2 mx-auto mb-16">
      {/* Banner carrossel */}
      <BannerCarousel banners={banners} />

      {/* Featured products carrossel */}
      <FeaturedProductsCarousel products={featuredProducts} />

      {/* Product categories */}
      <div className="box-categories">
        {categories.map((category) => (
          <ProductCategory key={category.id} category={category} />
        ))}
      </div>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-4 mx-[5px]">
          <h2 className="text-xl font-bold text-gray-800">Encontre uma loja</h2>
          <Link href="/restaurantes" className="text-sm text-bobs-red font-medium">
            Ver todas
          </Link>
        </div>
        <div className="overflow-x-auto pb-4 px-[5px]">
          <div className="flex gap-3 min-w-[500px]">
            <Card className="shadow-sm min-w-[240px]">
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">Bob's Praia de Botafogo</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Praia Botafogo, 360, Botafogo, Rio de Janeiro - RJ
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Aberto agora</span>
                  <Button variant="outline" size="sm" className="text-xs text-bobs-red border-bobs-red">
                    Ver detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm min-w-[240px]">
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">Bob's Nova Iguaçu</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Avenida Governador Amaral Peixoto, 386, Centro, Nova Iguaçu - RJ
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Aberto agora</span>
                  <Button variant="outline" size="sm" className="text-xs text-bobs-red border-bobs-red">
                    Ver detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm min-w-[240px]">
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">Bob's Shopping Tacaruna</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Av.gov Agamenon Magalhaes, 153, Loja 281/282 2 Pav, Santo Amaro, Recife - PE
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Aberto agora</span>
                  <Button variant="outline" size="sm" className="text-xs text-bobs-red border-bobs-red">
                    Ver detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mb-6 mx-[5px]">
        <Card className="shadow-sm bg-bobs-light-gray">
          <CardHeader className="pb-2">
            <h3 className="font-bold text-lg">Informações de Pagamento</h3>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium">Cartões aceitos:</span>
              </div>
              <div className="flex items-center">
                <Image
                  src="/images/payment-methods.png"
                  alt="Métodos de pagamento"
                  width={150}
                  height={30}
                  className="h-7 w-auto"
                />
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-1">Cupom de Desconto</h4>
              <div className="flex items-center">
                <Image
                  src="/images/coupon.png"
                  alt="Cupom"
                  width={24}
                  height={24}
                  className="h-5 w-5 mr-2"
                />
                <span className="text-sm">Adicione um cupom para ganhar desconto</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-[5px]">
        <div className="mb-6">
          <Link href="/restaurantes" className="bobs-btn block">
            Encontre uma loja
          </Link>
        </div>
      </section>
    </div>
  );
}
