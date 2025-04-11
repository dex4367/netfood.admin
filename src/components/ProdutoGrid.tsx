import { type Produto } from '@/lib/supabase';
import ProdutoCard from './ProdutoCard';

interface ProdutoGridProps {
  produtos: Produto[];
  titulo?: string;
}

export default function ProdutoGrid({ produtos, titulo }: ProdutoGridProps) {
  if (produtos.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-600">
          Nenhum produto encontrado
        </h2>
        <p className="text-gray-500 mt-2">
          Tente selecionar outra categoria ou volte mais tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {titulo && (
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{titulo}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {produtos.map((produto) => (
          <ProdutoCard key={produto.id} produto={produto} />
        ))}
      </div>
    </div>
  );
} 