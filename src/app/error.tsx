'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log do erro para análise em desenvolvimento
    console.error('Erro na aplicação:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Algo deu errado!</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Desculpe, ocorreu um erro ao carregar esta página.
      </p>
      <button
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        onClick={() => reset()}
      >
        Tentar novamente
      </button>
    </div>
  );
} 