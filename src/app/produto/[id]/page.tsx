import { buscarCategorias, buscarProdutosPorId, buscarProdutos, buscarGruposComplementosPorProduto } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BotoesQuantidade from '@/components/BotoesQuantidade';
import { Complemento } from '@/lib/supabase';
import ImageWithFallback from '@/components/ImageWithFallback';
import { supabase } from '@/lib/supabase';
import ProdutoCardCompacto from '@/components/ProdutoCardCompacto';
import ProdutoAcoes from './ProdutoAcoes';
import React from 'react';

// Forçar revalidação a cada 10 segundos
export const revalidate = 10;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Função para buscar grupos e complementos
async function buscarGruposEComplementos(produtoId: string) {
  try {
    // Primeiro busca os IDs de grupos associados ao produto
    const { data: gruposIds, error: gruposError } = await supabase
      .from('produtos_grupos_complementos')
      .select('grupo_id')
      .eq('produto_id', produtoId);

    if (gruposError || !gruposIds?.length) {
      return [];
    }

    // Extrai apenas os IDs para usar na consulta
    const ids = gruposIds.map(item => item.grupo_id);

    // Busca os detalhes dos grupos
    const { data: grupos, error: gruposDetalhesError } = await supabase
      .from('grupos_complementos')
      .select('*')
      .in('id', ids);

    if (gruposDetalhesError || !grupos) {
      console.error('Erro ao buscar detalhes dos grupos de complementos:', gruposDetalhesError);
      return [];
    }

    // Para cada grupo, busca seus complementos
    const gruposComComplementos = await Promise.all(
      grupos.map(async (grupo) => {
        const { data: complementos, error: complementosError } = await supabase
          .from('complementos')
          .select('*')
          .eq('grupo_id', grupo.id)
          .eq('disponivel', true);

        if (complementosError) {
          console.error(`Erro ao buscar complementos do grupo ${grupo.nome}:`, complementosError);
          return { ...grupo, complementos: [] };
        }

        return { ...grupo, complementos: complementos || [] };
      })
    );

    return gruposComComplementos;
  } catch (error) {
    console.error('Erro ao buscar grupos de complementos:', error);
    return [];
  }
}

export default async function ProdutoPage({ params }: PageProps) {
  const { id: produtoId } = await params;
  
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
    .slice(0, 6);
  
  // Buscar os grupos de complementos do produto
  const gruposComplementos = await buscarGruposEComplementos(produtoId);
  
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
    <div className="max-w-3xl mx-auto pb-16 px-4">
      {/* Imagem Principal */}
      <div className="relative h-[300px] w-full mb-0">
        <div className="w-full h-full">
          <ImageWithFallback
            src={produto.imagem_url || "https://placehold.co/400x300?text=Produto"}
            alt={produto.nome}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
            fallbackSrc="https://placehold.co/400x300?text=Produto"
          />
        </div>
      </div>
      
      {/* Componente de Ações do Produto - Client Side */}
      {produto.disponivel && (
        <div className="pb-20">
          <ProdutoAcoes produto={produto} gruposComplementos={gruposComplementos} />
        </div>
      )}
      
      {/* Produtos Relacionados */}
      {outrosProdutos.length > 0 && (
        <div className="mt-8 mb-20">
          <h2 className="text-lg font-bold text-gray-800 mb-4 mx-1">
            Você também pode gostar
          </h2>
          
          <div className="px-1 space-y-1">
            {outrosProdutos.map(prod => (
              <ProdutoCardCompacto key={prod.id} produto={prod} />
            ))}
          </div>
        </div>
      )}
      
      {/* Botão Fixo Somente quando não estiver disponível */}
      {!produto.disponivel && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-10 shadow-lg">
          <div className="max-w-3xl mx-auto">
            <button
              disabled={true}
              className="w-full py-3 rounded-lg font-bold text-white text-base bg-gray-400 cursor-not-allowed"
            >
              Produto Indisponível
            </button>
          </div>
        </div>
      )}

      {produto.imagem_url && (
        <div className="w-full flex justify-center mb-4">
          <div className="relative w-[100px] h-[100px]">
            <Image
              src={produto.imagem_url}
              alt={produto.nome}
              width={100}
              height={100}
              className="object-contain rounded-md"
              style={{ width: '100px', height: '100px' }}
              priority
            />
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