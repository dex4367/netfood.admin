import CategoriaList from '@/components/CategoriaList';
import ProdutoGrid from '@/components/ProdutoGrid';
import ProdutoCard from '@/components/ProdutoCard';
import { buscarCategorias, buscarProdutos, buscarProdutosDestaque, buscarBanners, buscarConfiguracaoLoja } from '@/lib/supabase';
import BannerCarouselWrapper from '@/components/BannerCarouselWrapper';
import FeaturedProductsCarousel from '@/components/FeaturedProductsCarousel';
import InfoLoja from '@/components/InfoLoja';

// Forçar revalidação a cada 10 segundos
export const revalidate = 10;

export default async function Home() {
  // Carregar categorias e produtos
  const categorias = await buscarCategorias();
  const produtos = await buscarProdutos();
  const destaques = await buscarProdutosDestaque();
  const banners = await buscarBanners();
  const configuracaoLoja = await buscarConfiguracaoLoja();
  
  // Formatar os banners para o componente
  const bannersFormatados = banners.map(banner => ({
    id: banner.id,
    imageUrl: banner.image_url,
    linkUrl: banner.link_url || undefined
  }));
  
  // Agrupar produtos por categoria
  const produtosPorCategoria = categorias.map(categoria => {
    return {
      categoria,
      produtos: produtos.filter(produto => produto.categoria_id === categoria.id)
    };
  });
  
  return (
    <div className="space-y-8">
      {/* Banners */}
      {bannersFormatados.length > 0 && (
        <BannerCarouselWrapper banners={bannersFormatados} autoplayDelay={5000} />
      )}
      
      {/* Informações da Loja */}
      {configuracaoLoja && (
        <InfoLoja configuracao={configuracaoLoja} />
      )}
    
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
          <FeaturedProductsCarousel produtos={destaques} />
        </section>
      )}
      
      {/* Produtos por Categoria */}
      <section className="py-4 space-y-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Cardápio por Categoria</h2>
        
        {produtosPorCategoria.map(({ categoria, produtos }) => (
          produtos.length > 0 && (
            <div key={categoria.id} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-700 border-b pb-2">
                {categoria.nome}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {produtos.map((produto) => (
                  <ProdutoCard key={produto.id} produto={produto} />
                ))}
              </div>
            </div>
          )
        ))}
      </section>
      
      <section className="py-4">
        <ProdutoGrid 
          produtos={produtos} 
          titulo="Todos os Produtos" 
        />
      </section>
    </div>
  );
}
