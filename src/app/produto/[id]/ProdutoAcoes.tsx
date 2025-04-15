'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Produto, Complemento, GrupoComplemento } from '@/lib/supabase';
import ImageWithFallback from '@/components/ImageWithFallback';

interface ProdutoAcoesProps {
  produto: Produto;
  gruposComplementos: GrupoComplemento[];
}

export default function ProdutoAcoes({ produto, gruposComplementos }: ProdutoAcoesProps) {
  const router = useRouter();
  const [quantidade, setQuantidade] = useState(1);
  const [selecionados, setSelecionados] = useState<Record<string, Complemento[]>>({});
  const [observacoes, setObservacoes] = useState('');
  const [adicionando, setAdicionando] = useState(false);
  
  // Verificar se todos os grupos obrigatórios têm seleções
  const gruposObrigatoriosSelecionados = gruposComplementos
    .filter(grupo => grupo.min_escolhas > 0)
    .every(grupo => {
      const complementosSelecionados = selecionados[grupo.id] || [];
      return complementosSelecionados.length >= grupo.min_escolhas;
    });
  
  // Calcular preço total com complementos
  const calcularPrecoTotal = useCallback(() => {
    let total = produto.preco * quantidade;
    
    // Adicionar preço dos complementos
    Object.values(selecionados).forEach(complementos => {
      complementos.forEach(complemento => {
        total += complemento.preco;
      });
    });
    
    return total;
  }, [produto.preco, quantidade, selecionados]);
  
  // Adicionar um complemento (sem toggle, apenas adiciona)
  const adicionarComplemento = useCallback((grupo: GrupoComplemento, complemento: Complemento) => {
    setSelecionados(prev => {
      const grupoAtual = prev[grupo.id] || [];
      const complementosSelecionados = grupoAtual.filter(c => c.id === complemento.id);
      
      // Se atingiu o limite do grupo, não adicionar
      if (complementosSelecionados.length >= grupo.max_escolhas) {
        return prev;
      }
      
      // Adicionar complemento
      return {
        ...prev,
        [grupo.id]: [...grupoAtual, complemento]
      };
    });
  }, []);
  
  // Remover um complemento específico
  const removerComplemento = useCallback((grupo: GrupoComplemento, complemento: Complemento) => {
    setSelecionados(prev => {
      const grupoAtual = prev[grupo.id] || [];
      const index = grupoAtual.findIndex(c => c.id === complemento.id);
      
      if (index < 0) return prev;
      
      const novoGrupo = [...grupoAtual];
      novoGrupo.splice(index, 1);
      
      return {
        ...prev,
        [grupo.id]: novoGrupo
      };
    });
  }, []);
  
  // Adicionar ao carrinho
  const adicionarAoCarrinho = useCallback(async () => {
    if (!produto.disponivel || adicionando) return;
    
    setAdicionando(true);
    
    // Verificar grupos obrigatórios
    if (!gruposObrigatoriosSelecionados && gruposComplementos.some(g => g.min_escolhas > 0)) {
      alert('Selecione os complementos obrigatórios');
      setAdicionando(false);
      return;
    }
    
    try {
      // Criar item para o carrinho
      const itemCarrinho = {
        id: Date.now().toString(),
        produto_id: produto.id,
        produto_nome: produto.nome,
        quantidade,
        preco_unitario: produto.preco,
        preco_total: calcularPrecoTotal(),
        imagem_url: produto.imagem_url,
        observacoes: observacoes.trim(),
        complementos: Object.values(selecionados).flat(),
        created_at: new Date().toISOString()
      };
      
      // Buscar carrinho atual do localStorage
      const carrinhoAtual = localStorage.getItem('carrinho');
      const carrinho = carrinhoAtual ? JSON.parse(carrinhoAtual) : [];
      
      // Adicionar novo item
      carrinho.push(itemCarrinho);
      
      // Salvar no localStorage
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      
      // Disparar evento de atualização do carrinho
      window.dispatchEvent(new CustomEvent('atualizarCarrinho'));
      
      // Navegar para o carrinho
      router.push('/carrinho');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert('Erro ao adicionar produto ao carrinho');
    } finally {
      setAdicionando(false);
    }
  }, [
    produto, 
    quantidade, 
    selecionados, 
    observacoes, 
    adicionando, 
    gruposObrigatoriosSelecionados, 
    gruposComplementos, 
    router, 
    calcularPrecoTotal
  ]);
  
  // Selecionar ou deselecionar um complemento (para grupos tipo radio - max_escolhas=1)
  const toggleRadioComplemento = useCallback((grupo: GrupoComplemento, complemento: Complemento) => {
    setSelecionados(prev => {
      const grupoAtual = prev[grupo.id] || [];
      const jaExiste = grupoAtual.some(c => c.id === complemento.id);
      
      // Se é radio e já existe, remover (permitir deselecionar)
      if (jaExiste) {
        return {
          ...prev,
          [grupo.id]: []
        };
      }
      
      // Se é radio, substituir qualquer seleção anterior
      return {
        ...prev,
        [grupo.id]: [complemento]
      };
    });
  }, []);
  
  return (
    <>
      {/* Título do Produto com preço */}
      <div className="mb-4 mt-0">
        <h1 className="text-xl font-bold mb-1">{produto.nome}</h1>
        <p className="text-sm text-gray-600 mb-1">{produto.descricao}</p>
        <div className="text-xl font-bold text-orange-500">
          R$ {produto.preco.toFixed(2).replace('.', ',')}
        </div>
      </div>
      
      {/* Complementos por Grupo */}
      {gruposComplementos.length > 0 && (
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="space-y-6">
            {gruposComplementos.map((grupo) => (
              <div key={grupo.id} className="mb-2">
                <h3 className="font-bold text-gray-800 mb-3">{grupo.nome}</h3>
                {grupo.descricao && (
                  <p className="text-xs text-gray-500 mb-3">{grupo.descricao}</p>
                )}
                
                <div className="space-y-4">
                  {grupo.complementos?.map((complemento: Complemento) => (
                    <div key={complemento.id} className="flex items-center justify-between">
                      <div className="font-medium">{complemento.nome}
                        {complemento.preco > 0 && (
                          <div className="text-orange-500 text-sm">
                            +R$ {complemento.preco.toFixed(2).replace('.', ',')}
                          </div>
                        )}
                      </div>
                      
                      {complemento.imagem_url && (
                        <div className="relative w-12 h-12 mx-2 rounded overflow-hidden border border-gray-200">
                          <ImageWithFallback
                            src={complemento.imagem_url}
                            alt={complemento.nome}
                            fill
                            sizes="48px"
                            className="object-cover"
                            fallbackSrc="https://placehold.co/48x48?text=Comp"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <button 
                          onClick={() => removerComplemento(grupo, complemento)}
                          className="w-8 h-8 rounded-full border border-orange-500 flex items-center justify-center text-orange-500 font-bold"
                          disabled={!(selecionados[grupo.id] || []).some(c => c.id === complemento.id)}
                        >
                          -
                        </button>
                        
                        <div className="mx-2 w-5 text-center font-medium">
                          {(selecionados[grupo.id] || []).filter(c => c.id === complemento.id).length}
                        </div>
                        
                        <button 
                          onClick={() => adicionarComplemento(grupo, complemento)}
                          className="w-8 h-8 rounded-full border border-orange-500 flex items-center justify-center text-orange-500 font-bold"
                          disabled={(selecionados[grupo.id] || []).filter(c => c.id === complemento.id).length >= grupo.max_escolhas}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Observações */}
      <div className="mb-24">
        <h2 className="font-bold mb-2">Observações</h2>
        <textarea
          placeholder="Alguma observação para este item?"
          className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-700 resize-none focus:outline-none"
          rows={2}
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />
      </div>
      
      {/* Botão de Adicionar com Quantidade */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-10 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center">
          <div className="flex items-center mr-3">
            <button 
              onClick={() => setQuantidade(q => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-full border border-orange-500 flex items-center justify-center text-orange-500 font-bold"
              disabled={quantidade <= 1}
            >
              -
            </button>
            <span className="mx-2 font-bold min-w-[20px] text-center">
              {quantidade}
            </span>
            <button 
              onClick={() => setQuantidade(q => q + 1)}
              className="w-7 h-7 rounded-full border border-orange-500 flex items-center justify-center text-orange-500 font-bold"
            >
              +
            </button>
          </div>
          
          <div className="flex-1">
            <button
              disabled={!produto.disponivel || adicionando}
              onClick={adicionarAoCarrinho}
              className={`w-full py-3 rounded-lg font-bold text-white text-base
                ${produto.disponivel && !adicionando
                  ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700' 
                  : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {adicionando 
                ? 'Adicionando...' 
                : `Adicionar`
              }
            </button>
          </div>
          <div className="ml-3 font-bold text-orange-500">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(calcularPrecoTotal())}
          </div>
        </div>
      </div>
    </>
  );
} 