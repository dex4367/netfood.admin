"use client";

import React, { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
}

interface FeaturedProductsCarouselProps {
  products: Product[];
}

export function FeaturedProductsCarousel({ products }: FeaturedProductsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

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

  return (
    <div className="relative overflow-hidden mx-auto mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 mx-[5px]">Destaques</h2>
      <div className="embla overflow-hidden px-[5px]" ref={emblaRef}>
        <div className="embla__container flex">
          {products.map((product) => (
            <div
              className="embla__slide mr-3 flex-[0_0_50%] min-w-0 sm:flex-[0_0_33%] md:flex-[0_0_25%]"
              key={product.id}
            >
              <Link href={`/produto/${product.id.toString()}`} className="block h-full">
                <Card className="shadow-sm h-full hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-0">
                    <div className="relative h-[150px] w-full">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-base mb-1 line-clamp-1">{product.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="font-bold text-base text-gray-800">A partir de R${product.price}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
      {(prevBtnEnabled || nextBtnEnabled) && (
        <>
          <button
            className="embla__prev absolute top-1/2 -translate-y-1/2 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-gray-800 hover:bg-gray-100 disabled:opacity-0"
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="embla__next absolute top-1/2 -translate-y-1/2 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-gray-800 hover:bg-gray-100 disabled:opacity-0"
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
