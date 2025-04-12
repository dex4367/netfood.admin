'use client';

import { useState } from 'react';

interface BotoesQuantidadeProps {
  id: string;
  maxQuantidade: number;
}

export default function BotoesQuantidade({ id, maxQuantidade }: BotoesQuantidadeProps) {
  const [quantidade, setQuantidade] = useState(0);

  const incrementar = () => {
    if (quantidade < maxQuantidade) {
      setQuantidade(quantidade + 1);
    }
  };

  const decrementar = () => {
    if (quantidade > 0) {
      setQuantidade(quantidade - 1);
    }
  };

  return (
    <div className="flex items-center ml-3">
      <button
        type="button"
        onClick={decrementar}
        disabled={quantidade <= 0}
        className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-medium 
          ${quantidade <= 0 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      >
        −
      </button>
      <span className="mx-2 text-sm font-medium">{quantidade}</span>
      <button
        type="button"
        onClick={incrementar}
        disabled={quantidade >= maxQuantidade}
        className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-medium
          ${quantidade >= maxQuantidade
            ? 'bg-green-200 text-green-400 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'}`}
      >
        +
      </button>
    </div>
  );
} 