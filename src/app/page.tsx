import CategoriaList from '@/components/CategoriaList';
import ProdutoGrid from '@/components/ProdutoGrid';
import { buscarCategorias, buscarProdutos, buscarProdutosDestaque } from '@/lib/supabase';

export default async function Home() {
  // Carregar categorias e produtos
  const categorias = await buscarCategorias();
  const produtos = await buscarProdutos();
  const destaques = await buscarProdutosDestaque();
  
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Nosso Cardápio
        </h1>
        <p className="text-gray-600 mb-6">
          Explore nosso cardápio completo e encontre suas delícias favoritas
        </p>
        
        <CategoriaList 
          categorias={categorias} 
          categoriaAtiva={null} 
        />
      </section>
      
      {destaques.length > 0 && (
        <section className="py-4">
          <ProdutoGrid 
            produtos={destaques} 
            titulo="Destaques" 
          />
        </section>
      )}
      
      <section className="py-4">
        <ProdutoGrid 
          produtos={produtos} 
          titulo="Todos os Produtos" 
        />
      </section>
    </div>
  );
}
