import Link from 'next/link';
import { type Produto } from '@/lib/supabase';
import Image from 'next/image';

interface ProdutoCardCompactoProps {
  produto: Produto;
}

export default function ProdutoCardCompacto({ produto }: ProdutoCardCompactoProps) {
  return (
    <div className="py-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <Link href={`/produto/${produto.id}`} className="block hover:text-orange-600">
            <h3 className="text-base font-bold mb-1 text-gray-800">{produto.nome}</h3>
          </Link>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{produto.descricao}</p>
          
          <div>
            {produto.preco_original ? (
              <div className="flex items-center gap-2">
                <span className="text-orange-500 font-bold text-base">
                  R$ {produto.preco.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-gray-500 line-through text-sm">
                  R$ {produto.preco_original.toFixed(2).replace('.', ',')}
                </span>
              </div>
            ) : (
              <div className="text-orange-500 font-bold text-base">
                {produto.disponivel 
                  ? `R$ ${produto.preco.toFixed(2).replace('.', ',')}`
                  : <span className="text-gray-500 font-normal">Indisponível</span>
                }
              </div>
            )}
          </div>
        </div>
        
        <div className="w-[100px] h-[100px] relative flex-shrink-0">
          <Link href={`/produto/${produto.id}`} className="block">
            <Image
              src={produto.imagem_url || "https://placehold.co/100x100?text=Produto"}
              alt={produto.nome}
              width={100}
              height={100}
              className="object-cover rounded-md border border-gray-100"
            />
          </Link>
        </div>
      </div>
    </div>
  );
} 
 