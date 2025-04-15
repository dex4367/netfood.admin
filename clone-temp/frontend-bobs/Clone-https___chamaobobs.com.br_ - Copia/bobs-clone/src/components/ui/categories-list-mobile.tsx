"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface Category {
  id: number;
  name: string;
}

interface CategoriesListMobileProps {
  categories: Category[];
}

export function CategoriesListMobile({ categories }: CategoriesListMobileProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const handleCategoryClick = useCallback((index: number) => {
    setActiveIndex(index);
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="categories-list-mobile">
      <div className="embla pl-[5px]" ref={emblaRef}>
        <div className="embla__viewport is-draggable">
          <div className="embla__container flex overflow-x-auto">
            {categories.map((category, index) => (
              <div 
                key={category.id}
                className={`embla__slide ${activeIndex === index ? 'active-category-button' : ''}`}
                data-category-index={index}
                onClick={() => handleCategoryClick(index)}
                style={{ 
                  position: 'relative',
                  zIndex: activeIndex === index ? 5 : 1,
                  display: 'block'
                }}
              >
                <button className="whitespace-nowrap">{category.name}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 