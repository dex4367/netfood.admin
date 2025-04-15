"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const [isClient, setIsClient] = useState(false);

  // Detectar renderização do cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Indicador de carregamento
  if (!isClient) {
    return (
      <div className="bg-white min-h-[100vh] w-full flex items-center justify-center">
        <div className="flex items-center">
          <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce mr-1" style={{animationDelay: '0ms'}}></div>
          <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce mr-1" style={{animationDelay: '150ms'}}></div>
          <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[100vh] w-full flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image 
            src="https://www.bobsbrasil.com.br/assets/img/svg/logo-bobs.svg"
            width={120}
            height={60}
            alt="Logo Bob's"
            priority
          />
        </div>
        
        {/* Título principal */}
        <h1 className="text-3xl font-bold text-red-500 mb-4">CHECKOUT EM BREVE</h1>
        
        {/* Ícone de construção */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        
        {/* Subtítulo */}
        <p className="text-gray-600 mb-8">
          Estamos trabalhando para implementar o checkout em breve. Aguarde nossas atualizações.
        </p>
        
        {/* Botão para voltar */}
        <Link 
          href="/carrinho-novo" 
          className="bg-red-500 text-white font-medium py-3 px-8 rounded-md inline-block"
        >
          Voltar para o carrinho
        </Link>
      </div>
    </div>
  );
} 