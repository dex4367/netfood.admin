import { type Produto } from '@/lib/supabase';
import ProdutoCardCompacto from './ProdutoCardCompacto';

interface ProdutoGridCompactoProps {
  produtos: Produto[];
  titulo?: string;
}

export default function ProdutoGridCompacto({ produtos, titulo }: ProdutoGridCompactoProps) {
  if (produtos.length === 0) {
    return (
      <div className="px-2 text-center">
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
    <div className="w-full px-1">
      {titulo && <h2 className="text-xl font-semibold mb-4">{titulo}</h2>}
      
      {produtos.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {produtos.map((produto) => (
            <ProdutoCardCompacto key={produto.id} produto={produto} />
          ))}
        </div>
      )}
    </div>
  );
} 