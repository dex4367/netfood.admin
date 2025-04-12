'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ConfiguracaoLoja } from '@/lib/supabase';

interface InfoLojaProps {
  configuracao: ConfiguracaoLoja;
}

export default function InfoLoja({ configuracao }: InfoLojaProps) {
  const [expanded, setExpanded] = useState(false);
  
  const temInformacoes = configuracao.mostrar_endereco || 
                         configuracao.mostrar_cnpj || 
                         configuracao.mostrar_horario || 
                         configuracao.mostrar_dias;
  
  const temPagamentos = configuracao.pagamento_carteira || 
                       configuracao.pagamento_credito_mastercard || 
                       configuracao.pagamento_credito_visa || 
                       configuracao.pagamento_credito_elo || 
                       configuracao.pagamento_credito_amex || 
                       configuracao.pagamento_credito_hipercard || 
                       configuracao.pagamento_debito_mastercard || 
                       configuracao.pagamento_debito_visa || 
                       configuracao.pagamento_debito_elo || 
                       configuracao.pagamento_pix || 
                       configuracao.pagamento_dinheiro;
  
  if (!temInformacoes && !temPagamentos) return null;
  
  return (
    <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
      >
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Informações da Loja
        </h2>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform ${expanded ? 'transform rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {expanded && (
        <div className="p-4 border-t border-gray-200">
          {temInformacoes && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Sobre a Loja</h3>
              <div className="space-y-3">
                {configuracao.mostrar_endereco && configuracao.endereco && (
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600">{configuracao.endereco}</p>
                  </div>
                )}
                
                {configuracao.mostrar_cnpj && configuracao.cnpj && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600">CNPJ: {configuracao.cnpj}</p>
                  </div>
                )}
                
                {configuracao.mostrar_horario && configuracao.horario_funcionamento && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600">Horário: {configuracao.horario_funcionamento}</p>
                  </div>
                )}
                
                {configuracao.mostrar_dias && configuracao.dias_funcionamento && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600">Dias: {configuracao.dias_funcionamento}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {temPagamentos && (
            <div className="merchant-details-payment">
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-4">Formas de Pagamento</h3>
                
                <div className="merchant-details-payment__payment mb-6">
                  <div className="mb-2">
                    <p className="font-medium text-gray-700">Pagamento pelo site</p>
                  </div>
                  
                  {/* Carteira Digital */}
                  {configuracao.pagamento_carteira && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Débito</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="payment-tag flex items-center bg-gray-50 rounded-md border border-gray-200 py-1 px-2">
                          <div className="w-6 h-4 mr-1 bg-gray-100 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M1 10H23" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <small className="text-xs">Saldo da carteira</small>
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Cartões de Débito */}
                  {(configuracao.pagamento_debito_mastercard || 
                    configuracao.pagamento_debito_visa || 
                    configuracao.pagamento_debito_elo) && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Débito</p>
                      <div className="flex flex-wrap gap-2">
                        {configuracao.pagamento_debito_elo && (
                          <span className="payment-tag flex items-center bg-gray-50 rounded-md border border-gray-200 py-1 px-2">
                            <div className="w-6 h-4 mr-1 bg-black rounded-sm flex items-center justify-center">
                              <div className="text-xs font-bold text-white" style={{ fontSize: '7px' }}>elo</div>
                            </div>
                            <small className="text-xs">Elo Débito</small>
                          </span>
                        )}
                        {configuracao.pagamento_debito_mastercard && (
                          <span className="payment-tag flex items-center bg-gray-50 rounded-md border border-gray-200 py-1 px-2">
                            <div className="w-6 h-4 mr-1 bg-white rounded-sm flex items-center justify-center overflow-hidden">
                              <div className="flex -space-x-1">
                                <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></div>
                              </div>
                            </div>
                            <small className="text-xs">Mastercard Débito</small>
                          </span>
                        )}
                        {configuracao.pagamento_debito_visa && (
                          <span className="payment-tag flex items-center bg-gray-50 rounded-md border border-gray-200 py-1 px-2">
                            <div className="w-6 h-4 mr-1 bg-blue-800 rounded-sm flex items-center justify-center">
                              <div className="text-xs font-bold text-white" style={{ fontSize: '7px' }}>VISA</div>
                            </div>
                            <small className="text-xs">Visa Débito</small>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Cartões de Crédito */}
                  {(configuracao.pagamento_credito_mastercard || 
                    configuracao.pagamento_credito_visa || 
                    configuracao.pagamento_credito_elo || 
                    configuracao.pagamento_credito_amex || 
                    configuracao.pagamento_credito_hipercard) && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Crédito</p>
                      <div className="flex flex-wrap gap-2">
                        {configuracao.pagamento_credito_mastercard && (
                          <span className="payment-tag flex items-center bg-gray-50 rounded-md border border-gray-200 py-1 px-2">
                            <div className="w-6 h-4 mr-1 bg-white rounded-sm flex items-center justify-center overflow-hidden">
                              <div className="flex -space-x-1">
                                <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></div>
                              </div>
                            </div>
                            <small className="text-xs">Mastercard</small>
                          </span>
                        )}
                        {configuracao.pagamento_credito_visa && (
                          <span className="payment-tag flex items-center bg-gray-50 rounded-md border border-gray-200 py-1 px-2">
                            <div className="w-6 h-4 mr-1 bg-blue-800 rounded-sm flex items-center justify-center">
                              <div className="text-xs font-bold text-white" style={{ fontSize: '7px' }}>VISA</div>
                            </div>
                            <small className="text-xs">Visa</small>
                          </span>
                        )}
                        {configuracao.pagamento_credito_elo && (
                          <span className="payment-tag flex items-center bg-gray-50 rounded-md border border-gray-200 py-1 px-2">
                            <div className="w-6 h-4 mr-1 bg-black rounded-sm flex items-center justify-center">
                              <div className="text-xs font-bold text-white" style={{ fontSize: '7px' }}>elo</div>
                            </div>
                            <small className="text-xs">Elo</small>
                          </span>
                        )}
                        {configuracao.pagamento_credito_amex && (
                          <span className="payment-tag flex items-center bg-gray-50 rounded-md border border-gray-200 py-1 px-2">
                            <div className="w-6 h-4 mr-1 bg-blue-600 rounded-sm flex items-center justify-center">
                              <div className="text-white font-bold" style={{ fontSize: '6px' }}>AMEX</div>
                            </div>
                            <small className="text-xs">Amex</small>
                          </span>
                        )}
                        {configuracao.pagamento_credito_hipercard && (
                          <span className="payment-tag flex items-center bg-gray-50 rounded-md border border-gray-200 py-1 px-2">
                            <div className="w-6 h-4 mr-1 bg-red-700 rounded-sm flex items-center justify-center">
                              <div className="text-white text-center font-bold" style={{ fontSize: '4px' }}>H</div>
                            </div>
                            <small className="text-xs">Hipercard</small>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* PIX */}
                  {configuracao.pagamento_pix && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">PIX</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="payment-tag flex items-center bg-gray-50 rounded-md border border-gray-200 py-1 px-2">
                          <div className="w-6 h-4 mr-1 bg-white rounded-sm flex items-center justify-center overflow-hidden">
                            <img 
                              src="https://static.ifood-static.com.br/image/upload/t_high/icones/payments/brands/3dc38545-6c1b-43a0-a2d0-dd2e1ac3bc73" 
                              alt="PIX" 
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <small className="text-xs">PIX</small>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Pagamento na Entrega */}
                {configuracao.pagamento_dinheiro && (
                  <div className="merchant-details-payment__payment">
                    <div className="mb-2">
                      <p className="font-medium text-gray-700">Pagamento na entrega</p>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Dinheiro</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="payment-tag flex items-center bg-gray-50 rounded-md border border-gray-200 py-1 px-2">
                        <div className="w-6 h-4 mr-1 bg-green-100 rounded-sm flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="6" width="20" height="12" rx="1" stroke="#357a38" strokeWidth="1.5"/>
                            <circle cx="12" cy="12" r="3" stroke="#357a38" strokeWidth="1.5"/>
                          </svg>
                        </div>
                        <small className="text-xs">Dinheiro</small>
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                Todos os preços apresentados no cardápio são definidos pela loja.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 