"use client";

import React, { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerCarouselProps {
  banners: {
    id: number;
    src: string;
    alt: string;
  }[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const autoplay = useCallback(() => {
    if (!emblaApi) return;
    const timer = setTimeout(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [emblaApi]);

  useEffect(() => {
    const cleanup = autoplay();
    return () => {
      if (cleanup) cleanup();
    };
  }, [autoplay]);

  return (
    <div className="relative overflow-hidden mx-auto mb-6 mt-2 px-[5px]">
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {banners.map((banner) => (
            <div
              className="embla__slide relative flex-[0_0_100%] h-[180px] min-w-0"
              key={banner.id}
            >
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                priority
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        className="embla__prev absolute top-1/2 -translate-y-1/2 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/30 shadow-md text-gray-800 hover:bg-white/50 disabled:opacity-0"
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        className="embla__next absolute top-1/2 -translate-y-1/2 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/30 shadow-md text-gray-800 hover:bg-white/50 disabled:opacity-0"
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
