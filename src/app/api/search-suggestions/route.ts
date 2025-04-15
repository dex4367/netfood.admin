import { NextResponse } from 'next/server';
import { buscarProdutosPorQuery } from '@/lib/supabase';

export async function GET(request: Request) {
  // Extrair a query de busca da URL
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  if (!query || query.trim().length < 2) {
    return NextResponse.json([]);
  }

  try {
    // Buscar produtos que correspondem à query
    const produtos = await buscarProdutosPorQuery(query);
    
    // Retornar os produtos encontrados (limitado a 5)
    return NextResponse.json(produtos.slice(0, 5));
  } catch (error) {
    console.error('Erro ao buscar sugestões de produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar sugestões' },
      { status: 500 }
    );
  }
} 