'use client';

import { useState } from 'react';

interface ControladorQuantidadeProps {
  complementoId: string;
  maxEscolhas: number;
}

export default function ControladorQuantidade({ complementoId, maxEscolhas }: ControladorQuantidadeProps) {
  const [quantidade, setQuantidade] = useState(1); // Começar com 1 selecionado

  const incrementar = () => {
    if (quantidade < maxEscolhas) {
      setQuantidade(quantidade + 1);
    }
  };

  const decrementar = () => {
    if (quantidade > 1) { // Mínimo de 1 quando o checkbox está marcado
      setQuantidade(quantidade - 1);
    }
  };

  return (
    <div className="flex items-center ml-3">
      <button
        type="button"
        onClick={decrementar}
        disabled={quantidade <= 1}
        className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-medium 
          ${quantidade <= 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      >
        −
      </button>
      <span className="mx-2 text-sm font-medium">{quantidade}</span>
      <button
        type="button"
        onClick={incrementar}
        disabled={quantidade >= maxEscolhas}
        className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-medium
          ${quantidade >= maxEscolhas
            ? 'bg-green-200 text-green-400 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'}`}
      >
        +
      </button>
    </div>
  );
} 