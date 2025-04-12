'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Banner {
  id: string;
  imageUrl: string;
  linkUrl?: string;
}

interface BannerCarouselProps {
  banners: Banner[];
  autoplayDelay?: number;
}

export default function BannerCarousel({ banners, autoplayDelay = 5000 }: BannerCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const router = useRouter();

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

  // Configurar autoplay
  useEffect(() => {
    if (!emblaApi || autoplayDelay === 0) return;
    
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplayDelay);
    
    return () => clearInterval(interval);
  }, [emblaApi, autoplayDelay]);

  const handleBannerClick = (banner: Banner) => {
    if (banner.linkUrl) {
      router.push(banner.linkUrl);
    }
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div className="embla-banners relative overflow-hidden mb-8">
      <div className="embla-banners-viewport" ref={emblaRef}>
        <div className="embla-banners-container flex">
          {banners.map((banner) => (
            <div 
              key={banner.id} 
              className="embla-banner-slide relative flex-grow-0 flex-shrink-0 w-full min-w-0"
              onClick={() => handleBannerClick(banner)}
            >
              <div className="embla-banner-slide-inner relative cursor-pointer">
                <div className="relative w-full h-64 md:h-80">
                  <Image
                    src={banner.imageUrl}
                    alt="Banner promocional"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 1200px"
                    priority
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button
        className="embla__button embla__button--prev absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white/70 rounded-full p-2 shadow hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      
      <button
        className="embla__button embla__button--next absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white/70 rounded-full p-2 shadow hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
} 