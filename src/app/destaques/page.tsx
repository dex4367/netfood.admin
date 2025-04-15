import { buscarProdutosDestaque } from '@/lib/supabase';
import ProdutosDestaque from '@/components/ProdutosDestaque';
import Link from 'next/link';

export const revalidate = 10;

export default async function DestaquesPage() {
  const destaques = await buscarProdutosDestaque();

  return (
    <div className="space-y-3">
      {/* Destaques em formato de lista (estilo Bob's) */}
      {destaques.length > 0 && (
        <div className="mt-2">
          <ProdutosDestaque produtos={destaques} />
        </div>
      )}
    </div>
  );
} 