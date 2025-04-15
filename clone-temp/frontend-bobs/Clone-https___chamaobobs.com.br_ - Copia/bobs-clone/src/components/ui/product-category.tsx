"use client";

import React from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  photo: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  products: Product[];
}

interface ProductCategoryProps {
  category: Category;
}

export function ProductCategory({ category }: ProductCategoryProps) {
  return (
    <div className="home-category-item ng-scope" id="category-emporio-bobs">
      <div className="category-title-wrapper">
        <h2 className="ng-binding">{category.name}</h2>
      </div>
      
      <p className="category-home-description ng-binding"></p>
      
      <div className="home-products-wrapper">
        {category.products.map((product) => (
          <Link 
            key={product.id} 
            href={`/produto/${product.id.toString()}`} 
            className="home-product-item ng-scope cursor-pointer"
          >
            <div className="home-product-item-info">
              <div className="home-product-item-info-top">
                <h3 className="ng-binding">{product.name}</h3>
                <span className="ng-binding">
                  {product.description}
                </span>
              </div>
              <div className="ng-scope">
                <span className="home-product-item-price ng-binding ng-scope">
                  R${product.price}
                </span>
              </div>
            </div>
            
            {product.photo && (
              <div 
                className="home-product-item-image ng-scope" 
                style={{ backgroundImage: `url('${product.photo}')`, marginRight: 0 }}
              >
                <div className="product-count-overlay ng-hide">
                  <div className="product-count-icon">
                    <span className="ng-binding">0</span>
                  </div>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
} 