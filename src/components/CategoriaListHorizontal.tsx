'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Categoria } from '@/lib/supabase';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Estender a interface Window para incluir a propriedade scrollTimer
declare global {
  interface Window {
    scrollTimer: ReturnType<typeof setTimeout>;
  }
}

interface Props {
  categorias: Categoria[];
  categoriaAtiva: string | null;
  setCategoriaAtiva: (id: string) => void;
  className?: string;
}

const CategoriaListHorizontal: React.FC<Props> = ({
  categorias = [],
  categoriaAtiva,
  setCategoriaAtiva,
  className = '',
}) => {
  const categoriaListRef = useRef<HTMLDivElement>(null);
  const activeCategoryRef = useRef<HTMLButtonElement>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCategoriaAtiva = useRef<string | null>(categoriaAtiva);
  const [isScrolling, setIsScrolling] = useState(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  // Função para lidar com cliques nas categorias
  const handleCategoryClick = (id: string) => {
    if (id === categoriaAtiva) return;
    
    setCategoriaAtiva(id);
    
    // Encontrar o elemento da seção correspondente e rolar até ele
    const sectionElement = document.getElementById(`section-${id}`);
    if (sectionElement) {
      const headerHeight = 110; // Altura aproximada do cabeçalho
      const yOffset = -headerHeight;
      const y = sectionElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    
    // Centralizar a categoria ativa no scroll horizontal
    centralizarCategoriaAtiva(id);
  };

  const centralizarCategoriaAtiva = (categoryId: string) => {
    if (!categoriaListRef.current) return;
    
    const container = categoriaListRef.current;
    const activeButton = container.querySelector(`[data-category-id="${categoryId}"]`) as HTMLElement;
    
    if (activeButton) {
      const containerWidth = container.offsetWidth;
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      
      // Calcula a posição para centralizar o botão
      const scrollLeft = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Centralizar a categoria ativa no scroll horizontal da barra quando ela mudar
  useEffect(() => {
    if (!categoriaListRef.current || !activeCategoryRef.current) return;
    
    // Verificar se a categoria ativa mudou
    if (categoriaAtiva !== prevCategoriaAtiva.current) {
      prevCategoriaAtiva.current = categoriaAtiva;
      
      // Animação baseada na fonte da mudança (scroll ou clique)
      if (!isScrolling) {
        // Se foi mudado por clique direto, fazer animação mais visível
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
      } else {
        // Se foi mudado por scroll da página, fazer animação mais sutil
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      }
      
      // Centralizar o botão da categoria ativa no scroll horizontal da barra
      const scrollToActiveCategory = () => {
        const container = categoriaListRef.current;
        const activeBtn = activeCategoryRef.current;
        
        if (container && activeBtn) {
          // Calcular posição para centralizar
          const containerWidth = container.offsetWidth;
          const btnLeft = activeBtn.offsetLeft;
          const btnWidth = activeBtn.offsetWidth;
          
          const scrollPosition = btnLeft - (containerWidth / 2) + (btnWidth / 2);
          
          // Scroll suave para a categoria ativa
          container.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: isScrolling ? 'auto' : 'smooth' // Comportamento instantâneo quando rolando
          });
        }
      };
      
      // Executar imediatamente para uma resposta mais rápida quando rolando
      if (isScrolling) {
        scrollToActiveCategory();
      } else {
        // Pequeno delay para garantir que as dimensões estão corretas quando clicando
        setTimeout(scrollToActiveCategory, 50);
      }
    }
  }, [categoriaAtiva, isScrolling]);

  // Monitorar o evento de scroll da página
  useEffect(() => {
    const handleScroll = () => {
      // Indicar que está rolando
      setIsScrolling(true);
      
      // Definir um temporizador para marcar quando a rolagem parou
      clearTimeout(window.scrollTimer);
      window.scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (window.scrollTimer) clearTimeout(window.scrollTimer);
    };
  }, []);

  // Função para lidar com toque na barra de categorias em dispositivos móveis
  const handleTouchStart = useCallback((id: string) => {
    setHoveredCategory(id);
    
    // Limpar qualquer temporizador anterior
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
    
    // Definir um novo temporizador para remover o efeito hover após um tempo
    touchTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 1500);
  }, []);

  useEffect(() => {
    // Limpar temporizadores quando o componente for desmontado
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  // Preparar as categorias para exibição
  const todasAsCategorias = categorias ? [
    { id: 0, nome: 'Todos' },
    ...categorias
  ] : [];

  useEffect(() => {
    if (isHomePage && categoriaAtiva && activeCategoryRef.current && categoriaListRef.current) {
      const container = categoriaListRef.current;
      const activeElement = activeCategoryRef.current;
      
      const containerWidth = container.offsetWidth;
      const activeElementLeft = activeElement.offsetLeft;
      const activeElementWidth = activeElement.offsetWidth;
      
      const scrollPosition = activeElementLeft - (containerWidth / 2) + (activeElementWidth / 2);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [categoriaAtiva, isHomePage]);

  return (
    <div className={`w-full bg-white min-h-[36px] ${className}`}>
      <div 
        ref={categoriaListRef}
        className="bg-white w-full flex overflow-x-auto scrollbar-hide"
        style={{ 
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          paddingTop: '4px',
          paddingBottom: '3px',
          display: 'flex',
          flexWrap: 'nowrap',
          paddingLeft: '0',
          marginLeft: '-16px'
        }}
      >
        {todasAsCategorias.map((categoria, index) => (
          <div 
            key={categoria.id} 
            className={`flex-shrink-0 ${index === 0 ? 'ml-0' : 'px-4'}`}
            style={{ 
              display: 'inline-block',
              ...(index === 0 ? { marginLeft: '16px' } : {})
            }}
          >
            <button
              ref={categoria.id === categoriaAtiva ? activeCategoryRef : null}
              onClick={() => handleCategoryClick(categoria.id.toString())}
              onMouseEnter={() => setHoveredCategory(categoria.id.toString())}
              onMouseLeave={() => setHoveredCategory(null)}
              onTouchStart={() => handleTouchStart(categoria.id.toString())}
              data-category-id={categoria.id.toString()}
              className={`whitespace-nowrap px-2.5 py-0.5 text-[15px] font-medium rounded-full relative transition-colors categoria-item
                ${
                  categoria.id.toString() === categoriaAtiva 
                    ? 'text-orange-500 categoria-ativa' 
                    : categoria.id.toString() === hoveredCategory 
                      ? 'text-orange-400' 
                      : 'text-gray-500'
                }
                ${categoria.id.toString() === categoriaAtiva && isAnimating ? 'animate-pulse-soft' : ''}
              `}
            >
              {categoria.nome}
              {categoria.id.toString() === categoriaAtiva ? null : (
                <div 
                  className={`absolute bottom-[-2px] left-0 right-0 mx-auto w-auto h-[1.5px] rounded-full transition-opacity duration-150
                    ${categoria.id.toString() === hoveredCategory 
                        ? 'bg-orange-300 opacity-70' 
                        : 'opacity-0'
                    }
                  `}
                  style={{ 
                    width: 'calc(100% + 4px)', 
                    marginLeft: '-2px' 
                  }}
                />
              )}
            </button>
          </div>
        ))}
      </div>
      
      {/* Estilo para animações */}
      <style jsx global>{`
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        
        @keyframes glow {
          0% { box-shadow: 0 0 0px rgba(249, 115, 22, 0.5); }
          50% { box-shadow: 0 0 4px rgba(249, 115, 22, 0.8); }
          100% { box-shadow: 0 0 0px rgba(249, 115, 22, 0.5); }
        }
        
        .animate-pulse-soft {
          animation: pulse-soft 0.5s ease-in-out;
        }
        
        .animate-glow {
          animation: glow 0.6s ease-in-out;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategoriaListHorizontal; 