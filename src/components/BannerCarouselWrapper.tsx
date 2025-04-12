'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Importar o componente com lazy loading no lado do cliente
const BannerCarousel = dynamic(() => import('@/components/BannerCarousel'), { ssr: false });

interface Banner {
  id: string;
  imageUrl: string;
  linkUrl?: string;
}

interface BannerCarouselWrapperProps {
  banners: Banner[];
  autoplayDelay?: number;
}

export default function BannerCarouselWrapper({ banners, autoplayDelay }: BannerCarouselWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Não renderizar nada durante o SSR
  if (!isMounted) {
    return <div className="banner-placeholder" style={{ height: '300px' }}></div>;
  }

  // Renderizar o carrossel apenas no cliente
  return <BannerCarousel banners={banners} autoplayDelay={autoplayDelay} />;
} 