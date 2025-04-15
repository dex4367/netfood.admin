import React from 'react';
import { Providers } from '@/app/providers';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Carrinho | Bob\'s',
  description: 'Finalize seu pedido no Bob\'s',
};

export default function CarrinhoNovoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} text-gray-800`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 