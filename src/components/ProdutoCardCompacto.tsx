import Link from 'next/link';
import { type Produto } from '@/lib/supabase';
import Image from 'next/image';

interface ProdutoCardCompactoProps {
  produto: Produto;
}

export default function ProdutoCardCompacto({ produto }: ProdutoCardCompactoProps) {
  return (
    <Link href={`/produto/${produto.id}`} className="block">
      <div className="border-b border-gray-200/30 py-3">
        <div className="flex justify-between">
          <div className="flex-1 pr-3">
            <h3 className="text-base font-bold mb-0.5 text-[#505050]">{produto.nome}</h3>
            <p className="text-gray-600 text-xs mb-1">{produto.descricao}</p>
            
            <div>
              {produto.preco_original ? (
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold text-sm">
                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-gray-500 line-through text-xs">
                    R$ {produto.preco_original.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ) : (
                <div className="text-orange-500 font-bold text-sm">
                  {produto.disponivel 
                    ? `R$ ${produto.preco.toFixed(2).replace('.', ',')}`
                    : <span className="text-gray-500">Indisponível</span>
                  }
                </div>
              )}
            </div>
          </div>
          
          <div className="w-[100px] h-[100px] relative flex items-start">
            <Image
              src={produto.imagem_url || "https://placehold.co/400x300?text=Produto"}
              alt={produto.nome}
              width={100}
              height={100}
              className="object-contain rounded-lg"
              style={{ width: '100px', height: '100px' }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
} 
 