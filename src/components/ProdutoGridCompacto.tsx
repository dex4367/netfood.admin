import { type Produto } from '@/lib/supabase';
import ProdutoCardCompacto from './ProdutoCardCompacto';

interface ProdutoGridCompactoProps {
  produtos: Produto[];
  titulo?: string;
}

export default function ProdutoGridCompacto({ produtos, titulo }: ProdutoGridCompactoProps) {
  if (produtos.length === 0) {
    return (
      <div className="px-2 py-8 text-center">
        <h2 className="text-base font-semibold text-gray-600">
          Nenhum produto encontrado
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Tente selecionar outra categoria ou volte mais tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {titulo && (
        <h2 className="text-xl font-bold text-red-600 mb-2 mx-2">{titulo}</h2>
      )}
      <div className="divide-y divide-gray-200">
        {produtos.map((produto) => (
          <ProdutoCardCompacto key={produto.id} produto={produto} />
        ))}
      </div>
    </div>
  );
} 