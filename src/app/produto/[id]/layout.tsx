import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Home } from "lucide-react";

export default function ProdutoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link 
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full text-red-600 hover:bg-red-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-bold text-base text-center flex-1">Detalhes do Produto</h1>
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full text-red-600 hover:bg-red-50"
          >
            <Home className="h-5 w-5" />
          </Link>
        </div>
      </div>
      <main className="bg-gray-50 pt-4">
        {children}
      </main>
    </>
  );
} 