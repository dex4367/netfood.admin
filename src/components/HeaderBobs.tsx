'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import SearchSuggestions from './SearchSuggestions';

interface HeaderBobsProps {
  categoriaAtiva?: string | null;
  style?: React.CSSProperties;
}

export default function HeaderBobs({ categoriaAtiva, style }: HeaderBobsProps) {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  
  // Atualizar contagem do carrinho quando o componente montar ou quando o carrinho for atualizado
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const carrinhoStr = localStorage.getItem('carrinho');
        if (carrinhoStr) {
          const carrinho = JSON.parse(carrinhoStr);
          setCartCount(carrinho.length);
        }
      } catch (error) {
        console.error('Erro ao acessar o carrinho:', error);
      }
    };
    
    // Verificar inicialmente
    updateCartCount();
    
    // Escutar eventos de atualização do carrinho
    window.addEventListener('atualizarCarrinho', updateCartCount);
    
    return () => {
      window.removeEventListener('atualizarCarrinho', updateCartCount);
    };
  }, []);

  // Carregar pesquisas recentes do localStorage
  useEffect(() => {
    try {
      const savedSearches = localStorage.getItem('recentSearches');
      if (savedSearches) {
        const searches = JSON.parse(savedSearches);
        setRecentSearches(searches);
      }
    } catch (error) {
      console.error('Erro ao carregar pesquisas recentes:', error);
    }
  }, []);

  // Fechar o dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchDropdownRef.current && 
        !searchDropdownRef.current.contains(event.target as Node) && 
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchHistory(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mostrar sugestões quando o usuário digita
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setShowSuggestions(true);
      setShowSearchHistory(false);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Salvar no histórico de buscas
      saveSearchToHistory(searchQuery.trim());
      // Redirecionar para a página de resultados
      window.location.href = `/produtos?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const saveSearchToHistory = (query: string) => {
    try {
      // Remover duplicatas e limitar a 5 pesquisas recentes
      let updatedSearches = [query, ...recentSearches.filter(item => item !== query)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Erro ao salvar pesquisa:', error);
    }
  };

  const handleSelectRecentSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchHistory(false);
    saveSearchToHistory(query);
    window.location.href = `/produtos?q=${encodeURIComponent(query)}`;
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    saveSearchToHistory(suggestion);
    window.location.href = `/produtos?q=${encodeURIComponent(suggestion)}`;
  };

  const handleFocus = () => {
    if (searchQuery.trim().length >= 2) {
      setShowSuggestions(true);
      setShowSearchHistory(false);
    } else if (recentSearches.length > 0) {
      setShowSearchHistory(true);
      setShowSuggestions(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleClearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
    setShowSearchHistory(false);
  };
  
  return (
    <div className="header-wrapper fixed top-0 left-0 right-0 z-50 w-full">
      <div className="w-full bg-white z-40 border-b border-gray-200/30" style={style}>
        <div className="flex items-center justify-between py-1.5 px-2 mobile-nav">
          <button aria-label="Menu" className="p-1.5">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-menu h-5 w-5 text-gray-700"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
          <Link className="flex-1 flex justify-center" href="/">
            <Image 
              alt="Bob's" 
              width={85} 
              height={32} 
              className="h-8 w-auto" 
              src="/images/bobs-logo.png"
              unoptimized
            />
          </Link>
          <Link className="relative p-1.5" href="/carrinho">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-shopping-cart h-5 w-5 text-gray-700"
            >
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
        
        {/* Barra de pesquisa aprimorada */}
        <div className="search-bar border-t border-gray-200/30 py-2 px-2">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide lucide-search h-5 w-5"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar por produtos"
              className="w-full pl-10 pr-10 py-2 border border-gray-300/30 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleFocus}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={handleClearSearch}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="lucide lucide-x h-4 w-4"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            )}
            
            {/* Dropdown de pesquisas recentes */}
            {showSearchHistory && recentSearches.length > 0 && (
              <div 
                ref={searchDropdownRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
              >
                <div className="flex justify-between items-center p-2 border-b border-gray-100">
                  <span className="text-xs font-medium text-gray-500">Pesquisas recentes</span>
                  <button 
                    onClick={handleClearAllRecentSearches}
                    className="text-xs text-orange-500 hover:text-orange-600"
                  >
                    Limpar todas
                  </button>
                </div>
                <ul>
                  {recentSearches.map((search, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-orange-50 flex items-center"
                        onClick={() => handleSelectRecentSearch(search)}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="lucide lucide-clock h-4 w-4 mr-2 text-gray-400"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {search}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Mostrar sugestões de pesquisa em tempo real */}
            {showSuggestions && searchQuery.trim().length >= 2 && (
              <div ref={searchDropdownRef} className="absolute top-full left-0 right-0 z-50">
                <SearchSuggestions 
                  searchQuery={searchQuery} 
                  onSelectSuggestion={handleSelectSuggestion}
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 