'use client';

import React from 'react';
import { Produto } from '@/lib/supabase';
import ProdutoCardCompacto from './ProdutoCardCompacto';

interface ProdutosDestaqueProps {
  produtos: Produto[];
  titulo?: string;
}

// Componente para os destaques específicos como mostrado na imagem
export default function ProdutosDestaque({ produtos, titulo }: ProdutosDestaqueProps) {
  if (!produtos || produtos.length === 0) return null;

  return (
    <div className="px-1 max-w-3xl">
      {titulo && <h2 className="text-[22px] font-bold mb-1 text-orange-500 mx-2">{titulo}</h2>}
      
      <div className="space-y-0">
        {produtos.map((produto) => (
          <ProdutoCardCompacto key={produto.id} produto={produto} />
        ))}
      </div>
    </div>
  );
}

// Dados mockados para exemplo usando URLs públicas de imagens
export const produtosDestaqueMock = [
  {
    titulo: "3 Sanduíches por 49,90",
    descricao: "O combo é composto por 3 sanduíches clássicos à sua escolha. Escolha entre os seus lanches preferidos: Big Bob, Cheddar Australiano ou Double Cheese.",
    imagens: [
      "https://static.deliverymuch.com.br/images/products/609c6ee3e2892.png", 
      "https://static.ifood.com.br/image/upload/t_medium/pratos/32a5179c-26dd-41d9-9363-ff6c21be2dea/202203031951_8EQWKD21.png", 
      "https://static.ifood.com.br/image/upload/t_medium/pratos/2d44f2e9-09c5-416a-acd9-a1f2c4e9b248/202301311654_S15C_i.jpg"
    ],
    preco: 49.90,
    link: "/promocao/sanduiches"
  },
  {
    titulo: "Trio Big Bob + Sundae",
    descricao: "Na compra do nosso clássico Trio Big Bob, você ganha um Sundae grátis! O trio é composto por um Big Bob (são dois hambúrgueres bovinos, queijo, alface e...",
    imagens: [
      "https://static.ifood.com.br/image/upload/t_medium/pratos/8d6a22d9-c148-4fae-bcfb-6a9bb0cbdfe2/202306301502_3QVM_i.jpg"
    ],
    preco: 34.90,
    link: "/promocao/trio-sundae"
  },
  {
    titulo: "2 Milk Shakes 300ml",
    descricao: "Aquele milkshake que só o Bob's tem!",
    imagens: [
      "https://static.ifood.com.br/image/upload/t_medium/pratos/2d44f2e9-09c5-416a-acd9-a1f2c4e9b248/202301311718_8K82_i.jpg",
      "https://static.ifood.com.br/image/upload/t_medium/pratos/2d44f2e9-09c5-416a-acd9-a1f2c4e9b248/202301311718_4123_i.jpg"
    ],
    preco: 18.90,
    link: "/promocao/milkshakes"
  }
]; 