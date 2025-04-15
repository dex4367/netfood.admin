"use client";

import React from "react";

export function ProductSkeleton() {
  return (
    <div className="home-product-item animate-pulse">
      <div className="home-product-item-info">
        <div className="home-product-item-info-top">
          <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
        </div>
        <div>
          <div className="h-5 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="w-24 h-24 bg-gray-200 rounded"></div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="home-category-item animate-pulse mb-6">
      <div className="category-title-wrapper mb-3">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="home-products-wrapper">
        {[1, 2, 3, 4, 5].map((item) => (
          <ProductSkeleton key={item} />
        ))}
      </div>
    </div>
  );
}

export function FeaturedProductsSkeleton() {
  return (
    <div className="relative overflow-hidden mx-auto mb-8 animate-pulse">
      <div className="h-7 bg-gray-200 rounded w-1/4 mb-4 mx-[5px]"></div>
      <div className="flex px-[5px] gap-3 overflow-hidden">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex-[0_0_50%] min-w-0 sm:flex-[0_0_33%] md:flex-[0_0_25%] mr-3">
            <div className="shadow-sm h-full rounded-lg overflow-hidden">
              <div className="h-[150px] w-full bg-gray-200"></div>
              <div className="p-3">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="w-full h-[180px] bg-gray-200 rounded-lg animate-pulse mb-6"></div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container px-[5px] py-2 mx-auto mb-16">
      <BannerSkeleton />
      <FeaturedProductsSkeleton />
      <div className="box-categories">
        {[1, 2, 3, 4, 5].map((item) => (
          <CategorySkeleton key={item} />
        ))}
      </div>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="container max-w-2xl mx-auto pb-20 animate-pulse">
      {/* Cabeçalho com logo */}
      <div className="sticky top-0 z-10 bg-white border-b border-red-100 shadow-sm">
        <div className="flex items-center p-3">
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
      </div>

      {/* Imagem destaque */}
      <div className="w-full h-64 bg-gray-200"></div>

      {/* Informações do produto */}
      <div className="px-4 pt-4 pb-3 border-b">
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>

      {/* Extras */}
      <div className="border-b">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-2/5"></div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-4">
              <div className="flex items-center pr-3">
                <div className="h-14 w-14 bg-gray-200 rounded-lg mr-3"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-40 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 mt-1"></div>
                </div>
              </div>
              <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Acompanhamentos */}
      <div className="border-b">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="h-5 bg-gray-200 rounded w-2/5 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-3/5"></div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-center justify-between p-4">
              <div className="flex items-center pr-3">
                <div className="h-14 w-14 bg-gray-200 rounded-lg mr-3"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-40 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 mt-1"></div>
                </div>
              </div>
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Observações */}
      <div className="p-4 border-b">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="w-full h-16 bg-gray-200 rounded"></div>
      </div>

      {/* Barra fixa inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md">
        <div className="container max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
} 