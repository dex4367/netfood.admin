import CategoriaList from '@/components/CategoriaList';
import ProdutoGrid from '@/components/ProdutoGrid';
import { buscarCategorias, buscarProdutos } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CategoriaPage({ params }: PageProps) {
  const categoriaId = params.id;
  
  // Buscar todas as categorias para o menu
  const categorias = await buscarCategorias();
  
  // Verificar se a categoria existe
  const categoriaAtual = categorias.find(cat => cat.id === categoriaId);
  if (!categoriaAtual) {
    notFound();
  }
  
  // Buscar produtos desta categoria
  const produtos = await buscarProdutos(categoriaId);
  
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {categoriaAtual.nome}
        </h1>
        {categoriaAtual.descricao && (
          <p className="text-gray-600 mb-6">
            {categoriaAtual.descricao}
          </p>
        )}
        
        <CategoriaList 
          categorias={categorias} 
          categoriaAtiva={categoriaId} 
        />
      </section>
      
      <section className="py-4">
        <ProdutoGrid 
          produtos={produtos} 
          titulo={`Produtos em ${categoriaAtual.nome}`} 
        />
      </section>
    </div>
  );
}

// Gerar páginas estáticas para todas as categorias
export async function generateStaticParams() {
  const categorias = await buscarCategorias();
  
  return categorias.map((categoria) => ({
    id: categoria.id,
  }));
} 