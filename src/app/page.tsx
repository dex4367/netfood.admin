'use client';

import CategoriaList from '@/components/CategoriaList';
import ProdutoGridCompacto from '@/components/ProdutoGridCompacto';
import { supabase, buscarCategorias, buscarProdutos, buscarProdutosDestaque } from '@/lib/supabase';
import BannerCarouselWrapper from '@/components/BannerCarouselWrapper';
import FeaturedProductsCarousel from '@/components/FeaturedProductsCarousel';
import InfoLoja from '@/components/InfoLoja';
import ProdutosDestaque from '@/components/ProdutosDestaque';
import GaleriaDestaques from '@/components/GaleriaDestaques';
import CategoriaListHorizontal from '@/components/CategoriaListHorizontal';
import Link from 'next/link';
import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Store, ChevronRight, Info, Search, Menu } from 'lucide-react';

// Removendo a diretiva de revalidação que causa conflito com 'use client'
// export const revalidate = 10;

export default function Home() {
  // Estado para armazenar a categoria ativa
  const [categoriaAtiva, setCategoriaAtiva] = useState<number>(0);
  // NOVO ESTADO: Método de entrega selecionado ('delivery' ou 'pickup')
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  
  // Função client-side para buscar dados
  const [categoriasData, setCategoriasData] = useState<any[]>([]);
  const [produtosData, setProdutosData] = useState<any[]>([]);
  const [destaquesData, setDestaquesData] = useState<any[]>([]);
  const [bannersData, setBannersData] = useState<any[]>([]);
  const [configLoja, setConfigLoja] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Função para carregar todos os dados
    async function carregarDados() {
      try {
        setIsLoading(true);
        
        // Buscar dados diretamente das funções do Supabase, não de APIs que não existem
        const categorias = await buscarCategorias().catch(() => []);
        setCategoriasData(categorias || []);
        
        const produtos = await buscarProdutos().catch(() => []);
        setProdutosData(produtos || []);
        
        const destaques = await buscarProdutosDestaque().catch(() => []);
        setDestaquesData(destaques || []);
  
        // Buscar banners
        const { data: banners } = await supabase
          .from('banners')
          .select('*')
          .eq('ativo', true)
          .order('ordem', { ascending: true });
        setBannersData(banners || []);
  
        // Buscar configuração da loja
        const { data: config } = await supabase
          .from('configuracao_loja')
          .select('*')
          .limit(1);
        setConfigLoja(config?.[0] || null);
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Garantir que os dados tenham valores padrão mesmo com erro
        if (categoriasData.length === 0) setCategoriasData([]);
        if (produtosData.length === 0) setProdutosData([]);
        if (destaquesData.length === 0) setDestaquesData([]);
        if (bannersData.length === 0) setBannersData([]);
      } finally {
        // Sempre encerrar o carregamento, mesmo com erro
        setIsLoading(false);
      }
    }
    
    // Adicionar um timeout de segurança para garantir que isLoading não fique preso
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Timeout de segurança acionado - forçando fim do carregamento');
        setIsLoading(false);
      }
    }, 5000); // 5 segundos de timeout
    
    carregarDados();
    
    // Configurar intervalo para atualizar dados a cada 30 segundos
    const intervalId = setInterval(() => {
      carregarDados();
    }, 30000);
    
    // Limpar intervalo e timeout quando o componente é desmontado
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);
  
  // Formatar os banners para o componente
  const bannersFormatados = bannersData.map(banner => ({
    ...banner,
    titulo: banner.titulo || undefined,
    subtitulo: banner.subtitulo || undefined
  }));
  
  // Filtrar produtos por categoria ativa
  const produtosFiltrados = categoriaAtiva === 0 
    ? produtosData 
    : produtosData.filter(produto => produto.categoria_id === categoriaAtiva);
  
  // Agrupar produtos por categoria
  const produtosPorCategoria = categoriasData.map(categoria => {
    return {
      categoria,
      produtos: produtosData.filter(produto => produto.categoria_id === categoria.id)
    };
  });
  
  // Função para detectar qual categoria está atualmente visível na tela
  useEffect(() => {
    // Variável para controlar o throttling
    let throttleTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastScrollTime = 0;
    const throttleDelay = 100; // ms entre chamadas

    const handleScroll = () => {
      const now = Date.now();
      
      // Se passou menos tempo que o delay e já tem um timeout agendado, não fazer nada
      if (now - lastScrollTime < throttleDelay && throttleTimeout) return;
      
      // Se já tem um timeout agendado, limpar
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
      
      // Atualizar o timestamp da última rolagem
      lastScrollTime = now;
      
      // Agendar a próxima verificação
      throttleTimeout = setTimeout(() => {
        // Lógica de detecção de seção visível
        if (!categoriasData.length) return;
        
        // Altura da barra de categoria fixa + margem para detecção antecipada
        const headerOffset = 50 + 20; // Usar valor fixo (altura da barra de categoria)
        
        // Obter todas as seções de categorias
        const sections = categoriasData.map(cat => {
          const el = document.getElementById(`section-${cat.id}`);
          if (!el) return null;
          
          const rect = el.getBoundingClientRect();
          return {
            id: cat.id,
            top: rect.top - headerOffset,
            bottom: rect.bottom - headerOffset
          };
        }).filter(Boolean);
        
        // Adicionar a opção "Todos" para o topo da página
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        
        // Verificar se estamos no topo da página
        if (scrollPosition < 200) {
          if (categoriaAtiva !== 0) {
            setCategoriaAtiva(0);
          }
          return;
        }
        
        // Encontrar a categoria mais visível na tela
        let activeSection = null;
        for (const section of sections) {
          // Se a seção está completamente acima da viewport, pular
          if (section.bottom < 0) continue;
          
          // Se a seção está visível
          if (section.top < windowHeight * 0.5) {
            activeSection = section;
            break;
          }
        }
        
        // Se encontramos uma seção ativa e ela é diferente da atual, atualizar
        if (activeSection && activeSection.id !== categoriaAtiva) {
          setCategoriaAtiva(activeSection.id);
        }
        
        // Limpar o timeout
        throttleTimeout = null;
      }, throttleDelay);
    };
    
    // Adicionar listener e limpar quando o componente for desmontado
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, [categoriasData, categoriaAtiva]);
  
  // Função para mudar categoria ativa
  const mudarCategoriaAtiva = (id: number) => {
    setCategoriaAtiva(id);
    
    // Se id não for 0 (todos), fazer scroll para a categoria
    if (id !== 0) {
      // Pequeno timeout para garantir que a DOM está atualizada
      setTimeout(() => {
        const sectionElement = document.getElementById(`section-${id}`);
        if (sectionElement) {
          const headerOffset = 50 + 10; // Usar valor fixo + margem
          const y = sectionElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Se selecionou "todos", rolar para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Renderizar componente de erro em caso de falha total no carregamento
  const renderError = () => (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ops! Algo deu errado</h2>
        <p className="text-gray-600 mb-6">
          Não foi possível carregar os dados do cardápio. Tente recarregar a página.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors"
        >
          Recarregar página
        </button>
      </div>
    </div>
  );

  // Se estiver carregando por mais de 10 segundos, mostrar um botão para forçar carregamento
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setLoadingTimeout(true);
      }
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Componente de loading aprimorado
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{paddingTop: 50}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
          
          {loadingTimeout && (
            <div className="mt-6">
              <p className="text-gray-500 text-sm mb-2">Isso está demorando mais que o esperado.</p>
              <button 
                onClick={() => setIsLoading(false)} 
                className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
              >
                Continuar mesmo assim
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Se não tiver dados básicos necessários mesmo após carregamento, mostrar erro
  if (!categoriasData || categoriasData.length === 0) {
    return renderError();
  }
  
  return (
    <>
      {/* Container Principal do Banner com Overlays */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden bg-gray-800">
        {/* Imagem de Fundo com Overlay Escuro */}
        {configLoja?.imagem_capa_url ? (
          <Image
            src={configLoja.imagem_capa_url}
            alt="Banner Principal"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-900"></div>
        )}
        
        {/* Overlay escuro uniforme */}
        <div className="absolute inset-0 bg-black/25 z-10"></div>
        
        {/* Gradiente de sombra - mais forte na parte inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>

        {/* Barra de Navegação Superior (Overlay) */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-20">
          {/* Espaço à esquerda (para alinhar ícones à direita) */}
          <div></div> 
          {/* Ícones à direita */}
          <div className="flex items-center space-x-4">
            <button className="text-white">
              <Search size={24} />
            </button>
            <button className="text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Informações da Loja (Overlay) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex items-end space-x-4">
          {/* Logo da Loja */}
          {configLoja?.logo_url ? (
            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 border-white bg-white flex items-center justify-center shadow-lg">
              <Image
                src={configLoja.logo_url}
                alt={`Logo ${configLoja?.nome_loja || 'da Loja'}`}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 border-white bg-gray-100 flex items-center justify-center shadow-lg">
              <Store size={32} className="text-gray-400" />
            </div>
          )}
          {/* Nome e Status */}
          <div className="flex-grow mb-1">
            <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
              {configLoja?.nome_loja || 'Medieval Burguer - Itaperuna'}
            </h1>
            <div className="flex items-center mt-1">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              <p className="text-sm text-gray-200 drop-shadow-sm">
                Fechado. Abriremos às 18:00
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de Categorias (Header Component) - Agora abaixo do banner */}
      <div className="sticky top-0 z-40 bg-white">
        {categoriasData && categoriaAtiva !== undefined && (
          <Header 
            configLoja={configLoja}
            categorias={[]}
            categoriaAtiva={categoriaAtiva}
            setCategoriaAtiva={mudarCategoriaAtiva}
          />
        )}
      </div>

      {/* Seção de Seleção de Endereço/Retirada - Mantida abaixo */}
      <div className="bg-gray-50 border-b border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          {/* Barra Principal com Endereço e Opções */}
          <div 
            className="flex items-center px-4 py-3 text-sm border-b border-gray-100"
            onClick={() => {
              // Toggle um modal de endereço em uma implementação real
              console.log('Abrir modal de endereço');
            }}
          >
            {/* Ícone e Tipo de Entrega */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {deliveryMethod === 'delivery' ? (
                <MapPin size={16} className="text-red-500" />
              ) : (
                <Store size={16} className="text-red-500" />
              )}
              <span className="font-medium text-gray-500">
                {deliveryMethod === 'delivery' ? 'Entregar em:' : 'Retirar em:'}
              </span>
            </div>
            
            {/* Endereço com Estilo de Link */}
            <div className="ml-1 flex-1 truncate font-medium">
              {deliveryMethod === 'delivery'
                ? (configLoja?.endereco || 'Adicionar endereço')
                : (configLoja?.endereco || configLoja?.nome_loja || 'Localização da loja')
              }
            </div>
            
            {/* Seta Indicadora */}
            <ChevronRight size={18} className="text-red-500 flex-shrink-0" />
          </div>
          
          {/* Opções de Método (Pills) */}
          <div className="flex items-center gap-3 p-3 overflow-x-auto bg-white relative">
            {/* Opção Entregar */}
            <button
              onClick={() => setDeliveryMethod('delivery')}
              className={`flex items-center justify-center px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                deliveryMethod === 'delivery'
                  ? 'border-red-500 bg-red-50 text-red-500'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              <MapPin size={14} className={`mr-1 ${deliveryMethod === 'delivery' ? 'text-red-500' : 'text-gray-500'}`} />
              Delivery
            </button>
            
            {/* Opção Retirada */}
            <button
              onClick={() => setDeliveryMethod('pickup')}
              className={`flex items-center justify-center px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                deliveryMethod === 'pickup'
                  ? 'border-red-500 bg-red-50 text-red-500'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              <Store size={14} className={`mr-1 ${deliveryMethod === 'pickup' ? 'text-red-500' : 'text-gray-500'}`} />
              Retirada
            </button>
            
            {/* Opção Informações - Apenas ícone na direita */}
            <div className="flex-grow"></div>
            <Link 
              href="/informacoes" 
              className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:border-gray-400 transition-all ml-auto"
              aria-label="Informações da loja"
            >
              <Info size={18} className="text-gray-500" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="px-4 py-4 bg-white min-h-screen">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Barra de Categorias Horizontal */}
          <div className="mb-3 mt-1 -mx-4 sticky top-[48px] z-10 category-bar">
            <CategoriaListHorizontal
              categorias={categoriasData}
              categoriaAtiva={categoriaAtiva.toString()}
              setCategoriaAtiva={(id) => setCategoriaAtiva(parseInt(id))}
              className="shadow-sm"
            />
          </div>

          {/* Banners Carousel (Reativado) */}
          {bannersFormatados.length > 0 && (
            <div className="rounded-xl overflow-hidden shadow-sm">
              <BannerCarouselWrapper banners={bannersFormatados} autoplayDelay={5000} />
            </div>
          )}
          
          {/* Nova Galeria de Destaques */}
          {destaquesData.length > 0 && (
            <div className="mt-2">
              <GaleriaDestaques produtos={destaquesData} />
            </div>
          )}
          
          {/* Lista de Produtos agrupados por categoria */}
          <section className="py-1">
            {/* Sempre mostrar todos os produtos agrupados por categoria */}
            {produtosPorCategoria.map(({ categoria, produtos }) => 
              produtos.length > 0 && (
                <div 
                  key={categoria.id} 
                  className="mb-8"
                  id={`section-${categoria.id}`} // Adicionar ID para scroll
                  data-category-id={categoria.id} // Adicionar data attribute para referência
                >
                  <h2 className="text-[22px] font-bold text-orange-500 mb-4">{categoria.nome}</h2>
                  <ProdutoGridCompacto produtos={produtos} />
                </div>
              )
            )}
          </section>
        </div>
      </div>
    </>
  );
}