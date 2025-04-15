"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const pathname = usePathname();
  
  // Verificar se estamos em rotas que não devem ter header/footer
  const isProdutoRoute = pathname.startsWith('/produto/');
  const isCarrinhoRoute = pathname.startsWith('/carrinho');
  const isCheckoutRoute = pathname.startsWith('/checkout') || 
                           pathname.startsWith('/checkout-novo') || 
                           pathname.startsWith('/checkout-pix') || 
                           pathname.startsWith('/checkout-temp') || 
                           pathname.startsWith('/checkout_em_breve');
  
  // Se for a rota do carrinho, checkout ou produto, não exibir layout
  const hideLayout = isProdutoRoute || isCarrinhoRoute || isCheckoutRoute;

  useEffect(() => {
    function handleOnlineStatusChange() {
      setIsOnline(navigator.onLine);
    }

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  // Se for página do carrinho ou checkout, apenas renderizar o conteúdo sem header/footer
  if (isCarrinhoRoute || isCheckoutRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && (
        <div className="header-nav-container">
          <Header />
        </div>
      )}
      <main className={`flex-grow ${hideLayout ? 'pt-0' : ''}`}>
        {children}
        {!isOnline && (
          <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white text-center p-4">
            <div className="mb-2">
              <img
                src="/images/offline-transparent.png"
                alt="Offline"
                className="w-8 h-8 inline-block mr-2"
              />
              Você está sem conexão com a internet.
            </div>
            <p>Tentando reconectar</p>
          </div>
        )}
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}
