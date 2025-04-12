import { buscarCategorias, buscarProdutosPorId, buscarProdutos, buscarGruposComplementosPorProduto } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BotoesQuantidade from '@/components/BotoesQuantidade';
import { Complemento } from '@/lib/supabase';
import ImageWithFallback from '@/components/ImageWithFallback';

// Forçar revalidação a cada 10 segundos
export const revalidate = 10;

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProdutoPage({ params }: PageProps) {
  const resolvedParams = await params;
  const produtoId = resolvedParams.id;
  
  // Buscar o produto pelo ID
  const produto = await buscarProdutosPorId(produtoId);
  
  if (!produto) {
    notFound();
  }
  
  // Buscar a categoria do produto
  const categorias = await buscarCategorias();
  const categoria = categorias.find(cat => cat.id === produto.categoria_id);
  
  // Buscar produtos relacionados (mesma categoria)
  const produtosRelacionados = await buscarProdutos(produto.categoria_id);
  const outrosProdutos = produtosRelacionados
    .filter(p => p.id !== produto.id)
    .slice(0, 4);
  
  // Buscar os grupos de complementos do produto
  const gruposComplementos = await buscarGruposComplementosPorProduto(produtoId);
  
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
  
  const placeholderUrl = "https://via.placeholder.com/800x600?text=Produto";

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Imagem do Produto */}
        <div className="md:w-1/2">
          <div className="relative h-64 md:h-full min-h-[300px]">
            {produto.imagem_url ? (
              <ImageWithFallback
                src={produto.imagem_url}
                alt={produto.nome}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                fallbackSrc="https://via.placeholder.com/800x600?text=Produto"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                <span className="text-gray-400 text-lg">Sem imagem</span>
              </div>
            )}
            {produto.destaque && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full font-semibold">
                Destaque
              </div>
            )}
          </div>
        </div>
        
        <div className="md:w-1/2 p-6 md:p-8">
          <div className="flex flex-col h-full">
            <div>
              {categoria && (
                <Link 
                  href={`/categoria/${categoria.id}`}
                  className="text-sm text-green-600 font-medium hover:underline"
                >
                  {categoria.nome}
                </Link>
              )}
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2 mb-3">
                {produto.nome}
              </h1>
              
              {produto.descricao && (
                <p className="text-gray-600 mb-6">
                  {produto.descricao}
                </p>
              )}
            </div>
            
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-green-600">
                    {precoFormatado}
                  </span>
                  
                  {temDesconto && precoOriginalFormatado && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-500 line-through">
                        {precoOriginalFormatado}
                      </span>
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        -{percentualDesconto}%
                      </span>
                    </div>
                  )}
                </div>
                
                {!produto.disponivel && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                    Indisponível
                  </span>
                )}
              </div>
              
              {gruposComplementos.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Complementos Adicionais</h3>
                  
                  {gruposComplementos.map((grupo) => (
                    <div key={grupo.id} className="mb-4 bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-800">{grupo.nome}</h4>
                        {grupo.min_escolhas > 0 && (
                          <span className="text-sm text-red-600">
                            {grupo.min_escolhas === grupo.max_escolhas 
                              ? `Escolha ${grupo.min_escolhas}`
                              : `Escolha de ${grupo.min_escolhas} a ${grupo.max_escolhas}`}
                          </span>
                        )}
                      </div>
                      
                      {grupo.descricao && (
                        <p className="text-sm text-gray-600 mb-2">{grupo.descricao}</p>
                      )}
                      
                      <div className="space-y-2">
                        {grupo.complementos?.map((complemento: Complemento) => (
                          <div key={complemento.id} className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                            <div className="flex items-center">
                              {grupo.max_escolhas === 1 ? (
                                <input
                                  type="radio"
                                  id={`complemento-${complemento.id}`}
                                  name={`grupo-${grupo.id}`}
                                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded-full"
                                />
                              ) : (
                                <div className="flex items-center">
                                  <BotoesQuantidade 
                                    id={complemento.id}
                                    maxQuantidade={grupo.max_escolhas}
                                  />
                                </div>
                              )}
                              <div className="ml-2 flex items-center">
                                {complemento.imagem_url && (
                                  <div className="relative w-10 h-10 mr-2 rounded-full overflow-hidden">
                                    <ImageWithFallback
                                      src={complemento.imagem_url}
                                      alt={complemento.nome}
                                      fill
                                      className="object-cover"
                                      sizes="40px"
                                      fallbackSrc="https://via.placeholder.com/40x40?text=C"
                                    />
                                  </div>
                                )}
                                <label 
                                  htmlFor={`complemento-${complemento.id}`} 
                                  className="text-sm text-gray-700"
                                >
                                  {complemento.nome}
                                </label>
                              </div>
                            </div>
                            
                            {complemento.preco > 0 && (
                              <span className="text-sm font-medium text-gray-700">
                                + {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(complemento.preco)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                disabled={!produto.disponivel}
                className={`w-full py-3 rounded-lg font-medium text-white transition-colors
                  ${produto.disponivel 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {produto.disponivel ? 'Adicionar ao Pedido' : 'Produto Indisponível'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {outrosProdutos.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Você também pode gostar
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {outrosProdutos.map(prod => (
              <Link 
                key={prod.id}
                href={`/produto/${prod.id}`}
                className="block bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-40">
                  {prod.imagem_url ? (
                    <ImageWithFallback
                      src={prod.imagem_url}
                      alt={prod.nome}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      fallbackSrc="https://via.placeholder.com/400x300?text=Produto"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200">
                      <span className="text-gray-400 text-sm">Sem imagem</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 line-clamp-1">{prod.nome}</h3>
                  <p className="text-green-600 font-bold mt-1">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(prod.preco)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Gerar páginas estáticas para todos os produtos
export async function generateStaticParams() {
  const produtos = await buscarProdutos();
  
  return produtos.map((produto) => ({
    id: produto.id,
  }));
} 