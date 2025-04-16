import Link from 'next/link';
import { type Produto } from '@/lib/supabase';
import ImageWithFallback from './ImageWithFallback';
import Image from 'next/image';

interface ProdutoCardProps {
  produto: Produto;
}

export default function ProdutoCard({ produto }: ProdutoCardProps) {
  // Formatar o preço em reais
  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(produto.preco);

  // Formatar o preço original quando existir
  const precoOriginalFormatado = produto.preco_original
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(produto.preco_original)
    : null;

  // Calcular percentual de desconto
  const temDesconto = produto.preco_original != null && produto.preco_original > produto.preco;
  const percentualDesconto = temDesconto && produto.preco_original
    ? Math.round(((produto.preco_original - produto.preco) / produto.preco_original) * 100)
    : 0;

  return (
    <Link 
      href={`/produto/${produto.id}`}
      className="group flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 border border-gray-200/30"
    >
      <div className="flex justify-center pt-3">
        <div className="relative w-[100px] h-[100px]">
          {produto.imagem_url ? (
            <Image
              src={produto.imagem_url}
              alt={produto.nome}
              width={100}
              height={100}
              className="object-contain rounded-lg"
              style={{ width: '100px', height: '100px' }}
            />
          ) : (
            <div className="flex items-center justify-center w-[100px] h-[100px] bg-gray-200 rounded-lg">
              <span className="text-gray-400 text-xs">Sem imagem</span>
            </div>
          )}
          {produto.destaque && (
            <div className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Destaque
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col p-2 flex-grow">
        <h3 className="text-lg font-semibold text-[#505050] mb-1">{produto.nome}</h3>
        {produto.descricao && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{produto.descricao}</p>
        )}
        <div className="mt-auto">
          <div className="flex items-center gap-1">
            <p className="text-xl font-bold text-orange-500">{precoFormatado}</p>
            
            {temDesconto && precoOriginalFormatado && (
              <>
                <p className="text-sm text-gray-500 line-through">{precoOriginalFormatado}</p>
                <span className="text-xs font-semibold text-white bg-orange-500 px-1 py-0.5 rounded-full">
                  -{percentualDesconto}%
                </span>
              </>
            )}
          </div>
          
          {!produto.disponivel && (
            <span className="text-xs text-red-500 mt-1 block">
              Produto indisponível
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}