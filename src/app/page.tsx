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
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Produto, Categoria } from '@/lib/supabase';
import Image from 'next/image';

// Removendo a diretiva de revalidação que causa conflito com 'use client'
// export const revalidate = 10;

export default function Home() {
  const searchParams = useSearchParams();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(
    searchParams.get('categoria') || 'todos'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [destaquesData, setDestaquesData] = useState<any[]>([]);
  const [bannersData, setBannersData] = useState<any[]>([]);
  const [configLoja, setConfigLoja] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Buscar categorias
        const categoriasData = await buscarCategorias();
        setCategorias(categoriasData);
        
        // Buscar produtos
        const produtosData = await buscarProdutos();
        setProdutos(produtosData);
        
        // Buscar produtos em destaque
  const destaques = await buscarProdutosDestaque();
        setDestaquesData(destaques);
  
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
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Adicionar CSS na página para controlar a barra de categorias de maneira mais confiável
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Criar elemento de estilo
    const style = document.createElement('style');
    style.id = 'categoria-bar-styles';
    style.innerHTML = `
      .header-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
        background-color: white;
      }
      
      .categoria-bar-container {
        position: fixed;
        top: 106px; /* Altura do header */
        left: 0;
        right: 0;
        z-index: 40;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      .body-padding {
        padding-top: 140px; /* Compensa a altura do header + categoria bar */
      }
    `;
    
    document.head.appendChild(style);

    // Adicionar detector de rolagem mais simples e confiável
    const handleScroll = () => {
      requestAnimationFrame(() => {
        // Aqui apenas atualizamos a posição visual - a barra já está fixa pelo CSS
        const categoriaBar = document.querySelector('.categoria-bar-container') as HTMLElement;
        const header = document.querySelector('.header-wrapper') as HTMLElement;
        
        if (categoriaBar && header) {
          const headerHeight = header.getBoundingClientRect().height;
          categoriaBar.style.top = `${headerHeight}px`;
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    // Verificar tamanhos iniciais após página carregada
    setTimeout(handleScroll, 200);
    
    return () => {
      const styleElement = document.getElementById('categoria-bar-styles');
      if (styleElement) document.head.removeChild(styleElement);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Configurar IntersectionObserver para detectar qual categoria está visível
  useEffect(() => {
    if (typeof window === 'undefined' || categorias.length === 0) return;

    // Função para atualizar a categoria ativa quando a seção correspondente estiver visível
    const updateActiveCategory = (entries: IntersectionObserverEntry[]) => {
      // Só proceder se não estiver rolando para uma categoria específica
      // Isso evita o bug de mudar a categoria durante a rolagem automática
      if (document.body.classList.contains('scrolling-to-category')) return;
      
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      
      if (visibleEntries.length > 0) {
        // Obter o entry com maior intersecção (mais visível)
        const mostVisibleEntry = visibleEntries.reduce((prev, current) => {
          return prev.intersectionRatio > current.intersectionRatio ? prev : current;
        });
        
        const categoryId = mostVisibleEntry.target.getAttribute('data-category');
        if (categoryId && categoryId !== categoriaAtiva) {
          setCategoriaAtiva(categoryId);
        }
      }
    };

    // Criar o observer com opções adequadas para a detecção de rolagem
    const observer = new IntersectionObserver(updateActiveCategory, {
      // Ajustar o rootMargin para considerar o header fixo + categoria bar
      rootMargin: '-140px 0px -30% 0px',
      threshold: [0.1, 0.2, 0.3, 0.4] // Múltiplos thresholds para melhor precisão
    });

    // Observar todas as seções de categoria após breve delay para DOM estar pronto
    setTimeout(() => {
      const categoriaSections = document.querySelectorAll('[data-category]');
      categoriaSections.forEach(section => {
        observer.observe(section);
      });
    }, 300);

    // Limpar o observer quando o componente desmontar
    return () => {
      const categoriaSections = document.querySelectorAll('[data-category]');
      categoriaSections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, [categorias, categoriaAtiva]);
  
  // Formatar os banners para o componente
  const bannersFormatados = bannersData.map(banner => ({
    ...banner,
    titulo: banner.titulo || undefined,
    subtitulo: banner.subtitulo || undefined
  }));
  
  // Agrupar produtos por categoria
  const produtosPorCategoria = categorias.map(categoria => {
    return {
      categoria,
      produtos: produtos.filter(produto => produto.categoria_id === categoria.id)
    };
  });

  // Mudar categoria ativa e rolar para a seção correspondente
  const mudarCategoriaAtiva = useCallback((id: string) => {
    setCategoriaAtiva(id);
    
    // Adicionar classe para evitar que a detecção de categoria mude durante a rolagem
    document.body.classList.add('scrolling-to-category');
    
    // Pequeno timeout para garantir que o DOM esteja pronto
    setTimeout(() => {
      // Se for categoria "todos", rolar para o topo da área de produtos
      if (id === 'todos') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Remover classe após rolagem completar
        setTimeout(() => {
          document.body.classList.remove('scrolling-to-category');
        }, 1000);
        
        return;
      }
      
      // Encontrar a seção da categoria e rolar até ela
      const categoriaElement = document.getElementById(`categoria-${id}`);
      if (categoriaElement) {
        // Medição mais precisa das alturas
        const headerHeight = document.querySelector('.header-wrapper')?.getBoundingClientRect().height || 106;
        const categoriesBarHeight = document.querySelector('.categoria-bar-container')?.getBoundingClientRect().height || 34;
        const offset = headerHeight + categoriesBarHeight + 5; // +5 para margem extra
        
        window.scrollTo({
          top: categoriaElement.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
        
        // Remover classe após rolagem completar
        setTimeout(() => {
          document.body.classList.remove('scrolling-to-category');
        }, 1000);
      }
    }, 100);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ee4023]"></div>
      </div>
    );
  }
  
  return (
    <div className="pb-24">
      <Header categoriaAtiva={categoriaAtiva} />
      
      <div className="categoria-bar-container">
        <CategoriaListHorizontal 
          categorias={categorias} 
          categoriaAtiva={categoriaAtiva} 
          setCategoriaAtiva={mudarCategoriaAtiva}
          className="bg-white"
        />
      </div>
      
      {/* Área principal com padding-top para compensar o header fixo */}
      <div className="pt-44"> {/* Aumentado significativamente o padding-top para dar muito mais espaço aos banners */}
        <div className="space-y-4 produtos-container">
          {/* Banners */}
          {bannersFormatados.length > 0 && (
            <div className="mb-6">
            <BannerCarouselWrapper banners={bannersFormatados} autoplayDelay={5000} />
            </div>
          )}
          
          {/* Nova Galeria de Destaques */}
          {destaquesData.length > 0 && (
            <div className="mt-2">
              <GaleriaDestaques produtos={destaquesData} />
            </div>
          )}
          
          {/* Informações da Loja */}
          {configLoja && (
            <div className="mb-6">
              <InfoLoja configuracao={configLoja} />
            </div>
          )}
          
          {/* Lista de Produtos agrupados por categoria */}
          <section className="py-1 px-1">
            {produtosPorCategoria.map(({ categoria, produtos }) => 
              produtos.length > 0 && (
                <div 
                  key={categoria.id} 
                  id={`categoria-${categoria.id}`} 
                  data-category={categoria.id}
                  className="mb-6 categoria-section"
                >
                  <h2 className="text-[22px] font-bold text-orange-500 mb-2 px-[5px]">{categoria.nome}</h2>
                  <div className="border-t border-gray-200/30 mb-3"></div>
                  <ProdutoGridCompacto produtos={produtos} />
                </div>
              )
            )}
          </section>
        </div>
      </div>
    </div>
  );
}