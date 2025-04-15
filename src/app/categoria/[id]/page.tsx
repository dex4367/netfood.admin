'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

export default function CategoriaPage({ params }: PageProps) {
  const router = useRouter();
  const categoriaId = params.id;
  
  useEffect(() => {
    // Função para redirecionar de forma segura
    const redirecionar = () => {
      try {
        // Redirecionar para a página principal com um parâmetro de categoria
        router.push(`/?categoria=${categoriaId}`);
      } catch (error) {
        console.error('Erro ao redirecionar:', error);
        // Em caso de erro, tentar novamente após um breve intervalo
        setTimeout(redirecionar, 500);
      }
    };
    
    redirecionar();
  }, [categoriaId, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecionando...</p>
      </div>
    </div>
  );
}