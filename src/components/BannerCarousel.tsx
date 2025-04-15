'use client';

import React, { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "@/lib/supabase";

// Adicionar campos opcionais extras para o título e subtítulo
interface BannerExtended extends Banner {
  titulo?: string;
  subtitulo?: string;
}

interface BannerCarouselProps {
  banners: BannerExtended[];
  autoplayDelay?: number;
}

export default function BannerCarousel({ banners, autoplayDelay = 5000 }: BannerCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    dragFree: true,
    skipSnaps: false,
    containScroll: "keepSnaps",
    align: "start"
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi || banners.length <= 1) return;
    
    let intervalId: NodeJS.Timeout | null = null;
    
    const startAutoplay = () => {
      intervalId = setInterval(() => {
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollTo(0);
        }
      }, autoplayDelay);
    };
    
    // Iniciar autoplay
    startAutoplay();
    
    // Pausar autoplay quando o usuário interagir
    const stopAutoplay = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
    
    // Reiniciar autoplay após interação
    const onPointerUp = () => {
      stopAutoplay();
      startAutoplay();
    };
    
    emblaApi.on("pointerUp", onPointerUp);
    
    return () => {
      if (intervalId) clearInterval(intervalId);
      emblaApi.off("pointerUp", onPointerUp);
    };
  }, [emblaApi, autoplayDelay, banners.length]);

  if (banners.length === 0) {
    return null;
  }

  // Duplicar os banners para criar efeito de repetição infinita se houver poucos
  const displayBanners = banners.length < 5 
    ? [...banners, ...banners, ...banners] 
    : banners;

  return (
    <div className="relative overflow-hidden mx-auto my-2 pl-2.5">
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex" style={{ paddingRight: '100px' }}>
          {displayBanners.map((banner, index) => (
            <div
              className="embla__slide relative flex-[0_0_350px] h-[150px] min-w-0 ml-2.5"
              key={`${banner.id}-${index}`}
            >
              <Image
                src={banner.image_url}
                alt={banner.titulo || "Banner promocional"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="w-full h-full object-cover rounded-lg"
              />
              {banner.titulo && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
                  <h3 className="font-bold text-sm">{banner.titulo}</h3>
                  {banner.subtitulo && <p className="text-xs">{banner.subtitulo}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 