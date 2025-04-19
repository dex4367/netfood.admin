'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Produto } from '@/lib/supabase';
import useEmblaCarousel from "embla-carousel-react";

interface GaleriaDestaquesProps {
  produtos: Produto[];
  titulo?: string;
}

export default function GaleriaDestaques({ produtos, titulo = 'Destaques' }: GaleriaDestaquesProps) {
  if (!produtos || produtos.length === 0) return null;
  
  const [emblaRef] = useEmblaCarousel({ 
    loop: false, 
    dragFree: false,
    skipSnaps: false,
    containScroll: "trimSnaps",
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 }
    },
    dragThreshold: 10,
    duration: 20
  });

  return (
    <div className="py-2 max-w-3xl relative mb-2">
      <h2 className="text-[20px] font-bold mb-3 text-orange-500">{titulo}</h2>
      
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex" style={{ paddingRight: '40px' }}>
          {produtos.map((produto, index) => (
            <div 
              className={`embla__slide relative flex-[0_0_160px] min-w-0 ${index !== 0 ? 'ml-2' : ''}`}
              key={produto.id}
            >
              <Link href={`/produto/${produto.id}`}>
                <div className="border border-gray-200/30 rounded-lg overflow-hidden flex flex-col h-full bg-white shadow-sm">
                  <div className="h-[110px] w-full relative overflow-hidden bg-gray-50">
                    <Image
                      src={produto.imagem_url || "https://placehold.co/400x300?text=Produto"}
                      alt={produto.nome}
                      fill
                      className="transition-transform hover:scale-105 object-cover"
                    />
                  </div>
                  
                  <div className="h-[2px] bg-orange-500/70 w-full"></div>
                  
                  <div className="p-2 flex flex-col flex-grow h-[80px]">
                    <h3 className="text-xs font-semibold line-clamp-2 mb-1 text-[#505050]">{produto.nome}</h3>
                    
                    <p className="text-2xs text-gray-600 line-clamp-1 mb-1 flex-grow">
                      {produto.descricao?.length > 40 
                        ? `${produto.descricao.substring(0, 40)}...` 
                        : produto.descricao}
                    </p>
                    
                    <div className="mt-auto">
                      <div className="flex flex-col">
                        <span className="text-gray-600 text-2xs">A partir de</span>
                        <span className="text-orange-500 font-bold text-xs">
                          R${produto.preco.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 