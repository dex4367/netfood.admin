'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Produto } from '@/lib/supabase';

interface SearchSuggestionsProps {
  searchQuery: string;
  onSelectSuggestion: (query: string) => void;
}

export default function SearchSuggestions({ searchQuery, onSelectSuggestion }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      
      try {
        // Usamos a API Route para buscar sugestões
        const response = await fetch(`/api/search-suggestions?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar sugestões');
        }

        const data = await response.json();
        setSuggestions(data.slice(0, 5)); // Limitamos a 5 sugestões
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce para não fazer muitas requisições enquanto o usuário digita
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchQuery]);

  if (!searchQuery || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
      <ul className="divide-y divide-gray-100">
        {loading ? (
          <li className="p-3 text-center text-sm text-gray-500">
            Buscando...
          </li>
        ) : (
          suggestions.map((produto) => (
            <li key={produto.id} className="hover:bg-orange-50">
              <button
                className="w-full px-4 py-2 flex items-center gap-3 text-left"
                onClick={() => onSelectSuggestion(produto.nome)}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                  {produto.imagem_url ? (
                    <Image
                      src={produto.imagem_url}
                      alt={produto.nome}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
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
                        className="text-gray-400"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{produto.nome}</p>
                  {produto.preco && (
                    <p className="text-xs text-orange-600 font-medium">
                      R$ {produto.preco.toFixed(2).replace('.', ',')}
                    </p>
                  )}
                </div>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
} 