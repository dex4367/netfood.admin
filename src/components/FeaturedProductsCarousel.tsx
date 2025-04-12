'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';
import { Produto } from '@/lib/supabase';

interface FeaturedProductsCarouselProps {
  produtos: Produto[];
}

export default function FeaturedProductsCarousel({ produtos }: FeaturedProductsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    slidesToScroll: 1
  });
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (!produtos || produtos.length === 0) return null;

  return (
    <div className="featured-wrapper">
      <h2 className="text-2xl font-bold mb-6">Destaques</h2>
      
      <div className="embla-featured-products relative overflow-hidden">
        <div className="embla-featured-products-viewport is-draggable" ref={emblaRef}>
          <div className="embla-featured-products-container flex">
            {produtos.map((produto) => (
              <div 
                key={produto.id} 
                className="embla-featured-products-slide flex-grow-0 flex-shrink-0 min-w-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-3"
              >
                <Link href={`/produto/${produto.id}`}>
                  <div className="embla-featured-products-slide-inner bg-white rounded-lg shadow-md overflow-hidden h-full">
                    <div className="featured-product-image home-product-image-wrapper relative h-48">
                      <Image
                        src={produto.imagem_url || 'https://via.placeholder.com/300x200'}
                        alt={produto.nome}
                        fill
                        className="object-cover newhome-product-image"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="featured-product-info p-4 flex flex-col">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{produto.nome}</h3>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{produto.descricao}</p>
                      </div>
                      <div className="featured-product-info-bottom mt-auto pt-3 border-t border-gray-100">
                        <span className="home-product-item-price text-green-600 font-bold">
                          {produto.preco_original ? (
                            <>
                              <span className="line-through text-sm text-gray-500 mr-2">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(produto.preco_original)}
                              </span>
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(produto.preco)}
                            </>
                          ) : (
                            <span>
                              A partir de {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(produto.preco)}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        <button
          className="embla__button embla__button--prev absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          aria-label="Anterior"
        >
          <svg className="w-6 h-6" viewBox="137.718 -1.001 366.563 643.999">
            <path d="M428.36 12.5c16.67-16.67 43.76-16.67 60.42 0 16.67 16.67 16.67 43.76 0 60.42L241.7 320c148.25 148.24 230.61 230.6 247.08 247.08 16.67 16.66 16.67 43.75 0 60.42-16.67 16.66-43.76 16.67-60.42 0-27.72-27.71-249.45-249.37-277.16-277.08a42.308 42.308 0 0 1-12.48-30.34c0-11.1 4.1-22.05 12.48-30.42C206.63 234.23 400.64 40.21 428.36 12.5z" fill="currentColor"></path>
          </svg>
        </button>
        
        <button
          className="embla__button embla__button--next absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          aria-label="Próximo"
        >
          <svg className="w-6 h-6" viewBox="0 0 238.003 238.003">
            <path d="M181.776 107.719L78.705 4.648c-6.198-6.198-16.273-6.198-22.47 0s-6.198 16.273 0 22.47l91.883 91.883-91.883 91.883c-6.198 6.198-6.198 16.273 0 22.47s16.273 6.198 22.47 0l103.071-103.039a15.741 15.741 0 0 0 4.64-11.283c0-4.13-1.526-8.199-4.64-11.313z" fill="currentColor"></path>
          </svg>
        </button>
      </div>
    </div>
  );
} 