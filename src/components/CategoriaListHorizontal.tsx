'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Categoria } from '@/lib/supabase';

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
  categorias,
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

  // Função para lidar com cliques nas categorias
  const handleCategoryClick = (id: string) => {
    if (id === categoriaAtiva) return;
    
    setCategoriaAtiva(id);
    
    // Iniciar animação quando a categoria mudar por clique direto
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
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
          behavior: 'smooth'
        });
      }
    };
    
    // Pequeno delay para garantir que as dimensões estão corretas
    setTimeout(scrollToActiveCategory, 50);
    
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
  const todasAsCategorias = [
    { id: 'todos', nome: 'Todos' },
    ...categorias
  ];

  return (
    <div className={`w-full bg-white min-h-[45px] ${className}`}>
      <div 
        ref={categoriaListRef}
        className="overflow-x-auto hide-scrollbar pl-3" 
        style={{ 
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          paddingTop: '4px',
          paddingBottom: '3px',
          display: 'flex',
          flexWrap: 'nowrap'
        }}
      >
        {/* Adicionando pequeno espaçamento inicial */}
        <div className="w-2 flex-shrink-0"></div>
        
        {todasAsCategorias.map((categoria, index) => (
          <div 
            key={categoria.id} 
            className={`flex-shrink-0 ${index === 0 ? 'pl-1' : 'px-4'}`} 
            style={{ display: 'inline-block' }}
          >
            <button
              ref={categoria.id === categoriaAtiva ? activeCategoryRef : null}
              onClick={() => handleCategoryClick(categoria.id)}
              onMouseEnter={() => setHoveredCategory(categoria.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              onTouchStart={() => handleTouchStart(categoria.id)}
              data-category-id={categoria.id}
              className={`whitespace-nowrap px-2.5 py-0.5 text-[15px] font-medium rounded-full relative transition-colors categoria-item
                ${
                  categoria.id === categoriaAtiva 
                    ? 'text-orange-500 categoria-ativa' 
                    : categoria.id === hoveredCategory 
                      ? 'text-orange-400' 
                      : 'text-gray-500'
                }
                ${categoria.id === categoriaAtiva && isAnimating ? 'animate-pulse-soft' : ''}
              `}
            >
              {categoria.nome}
              {categoria.id === categoriaAtiva ? null : (
                <div 
                  className={`absolute bottom-[-2px] left-0 right-0 mx-auto w-auto h-[2px] rounded-full transition-opacity duration-150
                    ${categoria.id === hoveredCategory 
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
        
        {/* Pequeno espaçamento final */}
        <div className="w-2 flex-shrink-0"></div>
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