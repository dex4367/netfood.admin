'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Banner } from '@/lib/supabase';

// Dynamic import para o componente principal
const BannerCarousel = dynamic(() => import('./BannerCarousel'), {
  loading: () => <div className="h-[150px] bg-gray-200 animate-pulse rounded-lg" />,
  ssr: false,
});

// Tipos para os banners formatados
interface BannerFormatado extends Banner {
  titulo?: string;
  subtitulo?: string;
}

// Props do componente
interface BannerCarouselWrapperProps {
  banners: BannerFormatado[];
  autoplayDelay?: number;
}

// Componente wrapper com carregamento lazy e fallback
export default function BannerCarouselWrapper({ banners, autoplayDelay }: BannerCarouselWrapperProps) {
  return <BannerCarousel banners={banners} autoplayDelay={autoplayDelay} />;
} 