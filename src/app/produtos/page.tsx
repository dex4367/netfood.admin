import React from 'react'
import { Metadata } from 'next'
import { buscarProdutos, buscarProdutosPorQuery, buscarCategorias } from '@/lib/supabase'
import ProdutoGridCompacto from '@/components/ProdutoGridCompacto'
import Header from '@/components/Header'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Produtos | NetFood',
  description: 'Encontre seus produtos favoritos',
}

// Garantir que a página sempre busque os dados mais recentes
export const dynamic = 'force-dynamic'

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: { q?: string, sort?: string };
}) {
  // Obter o parâmetro de busca e ordenação da URL
  const searchQuery = searchParams.q?.trim() || '';
  const sortOption = searchParams.sort || 'relevancia';
  
  // Buscar produtos usando a query diretamente no Supabase
  let produtos = await buscarProdutosPorQuery(searchQuery);

  // Ordenar produtos conforme a opção selecionada
  if (produtos.length > 0) {
    switch (sortOption) {
      case 'preco-asc':
        produtos = produtos.sort((a, b) => (a.preco || 0) - (b.preco || 0));
        break;
      case 'preco-desc':
        produtos = produtos.sort((a, b) => (b.preco || 0) - (a.preco || 0));
        break;
      case 'nome-asc':
        produtos = produtos.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'nome-desc':
        produtos = produtos.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      // relevancia é o padrão retornado pelo Supabase, não precisa ordenar
    }
  }

  // Buscar categorias para sugestões de busca alternativas
  const categorias = await buscarCategorias();

  // Gerar termos de pesquisa relacionados combinando a query com categorias populares
  const relatedSearches = searchQuery ? 
    categorias
      .slice(0, 3)
      .map(cat => `${searchQuery} ${cat.nome.toLowerCase()}`)
      .filter(term => term !== searchQuery)
    : [];

  return (
    <div className="container mx-auto pt-14 pb-24 px-4">
      <Header />
      
      {/* Conteúdo principal */}
      <div className="pt-28 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-[22px] font-bold mb-4">
            {searchQuery ? `Resultados para "${searchQuery}"` : "Todos os produtos"}
          </h1>
          {produtos.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {produtos.length} {produtos.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          )}
        </div>

        {/* Filtros e ordenação */}
        {produtos.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-sm text-gray-700">
                <span className="font-medium">Ordenar por:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link 
                  href={`/produtos?q=${searchQuery}&sort=relevancia`}
                  className={`text-xs px-3 py-1.5 rounded-full border ${sortOption === 'relevancia' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  Relevância
                </Link>
                <Link 
                  href={`/produtos?q=${searchQuery}&sort=preco-asc`}
                  className={`text-xs px-3 py-1.5 rounded-full border ${sortOption === 'preco-asc' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  Menor preço
                </Link>
                <Link 
                  href={`/produtos?q=${searchQuery}&sort=preco-desc`}
                  className={`text-xs px-3 py-1.5 rounded-full border ${sortOption === 'preco-desc' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  Maior preço
                </Link>
                <Link 
                  href={`/produtos?q=${searchQuery}&sort=nome-asc`}
                  className={`text-xs px-3 py-1.5 rounded-full border ${sortOption === 'nome-asc' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  A-Z
                </Link>
                <Link 
                  href={`/produtos?q=${searchQuery}&sort=nome-desc`}
                  className={`text-xs px-3 py-1.5 rounded-full border ${sortOption === 'nome-desc' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  Z-A
                </Link>
              </div>
            </div>
          </div>
        )}

        {produtos.length > 0 ? (
          <ProdutoGridCompacto 
            produtos={produtos}
          />
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-600">
              Nenhum produto encontrado
            </h2>
            <p className="text-gray-500 mt-2 mb-4">
              Tente buscar com outras palavras ou navegue pelas categorias.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {categorias.slice(0, 6).map((categoria) => (
                <Link
                  key={categoria.id}
                  href={`/categoria/${categoria.id}`}
                  className="text-sm px-3 py-1.5 rounded-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                  {categoria.nome}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Termos de pesquisa relacionados */}
        {searchQuery && relatedSearches.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Pesquisas relacionadas</h2>
            <div className="flex flex-wrap gap-2">
              {relatedSearches.map((term, index) => (
                <Link 
                  key={index}
                  href={`/produtos?q=${encodeURIComponent(term)}`}
                  className="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {term}
                </Link>
              ))}
              {categorias.slice(0, 3).map((categoria) => (
                <Link
                  key={categoria.id}
                  href={`/categoria/${categoria.id}?from=${encodeURIComponent(searchQuery)}`}
                  className="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Ver {categoria.nome}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 