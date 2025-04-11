import Image from 'next/image';
import Link from 'next/link';
import { type Produto } from '@/lib/supabase';

interface ProdutoCardProps {
  produto: Produto;
}

export default function ProdutoCard({ produto }: ProdutoCardProps) {
  // Formatar o preço em reais
  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(produto.preco);

  return (
    <Link 
      href={`/produto/${produto.id}`}
      className="group flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105"
    >
      <div className="relative w-full h-48">
        {produto.imagem_url ? (
          <Image
            src={produto.imagem_url}
            alt={produto.nome}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            <span className="text-gray-400">Sem imagem</span>
          </div>
        )}
        {produto.destaque && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Destaque
          </div>
        )}
      </div>
      <div className="flex flex-col p-4 flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{produto.nome}</h3>
        {produto.descricao && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{produto.descricao}</p>
        )}
        <div className="mt-auto">
          <p className="text-xl font-bold text-green-600">{precoFormatado}</p>
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