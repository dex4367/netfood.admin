'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ConfiguracaoLoja } from '@/lib/supabase';
import { FaInfoCircle, FaChevronDown, FaMapMarkerAlt, FaFileAlt, FaClock, FaCalendarAlt, 
         FaCreditCard, FaMoneyBillWave, FaWallet, FaPiggyBank } from 'react-icons/fa';
import { SiMastercard, SiVisa, SiAmericanexpress } from 'react-icons/si';
import { BsCashCoin } from 'react-icons/bs';
import { RiPixelfedFill } from 'react-icons/ri';

interface InfoLojaProps {
  configuracao: ConfiguracaoLoja;
}

export default function InfoLoja({ configuracao }: InfoLojaProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Normalizar as flags para evitar erros quando elas não estão definidas
  const config = {
    ...configuracao,
    mostrar_endereco: configuracao.mostrar_endereco === true,
    mostrar_cnpj: configuracao.mostrar_cnpj === true,
    mostrar_horario: configuracao.mostrar_horario === true,
    mostrar_dias: configuracao.mostrar_dias === true,
    pagamento_carteira: configuracao.pagamento_carteira === true,
    pagamento_credito_mastercard: configuracao.pagamento_credito_mastercard === true,
    pagamento_credito_visa: configuracao.pagamento_credito_visa === true,
    pagamento_credito_elo: configuracao.pagamento_credito_elo === true,
    pagamento_credito_amex: configuracao.pagamento_credito_amex === true,
    pagamento_credito_hipercard: configuracao.pagamento_credito_hipercard === true,
    pagamento_debito_mastercard: configuracao.pagamento_debito_mastercard === true,
    pagamento_debito_visa: configuracao.pagamento_debito_visa === true,
    pagamento_debito_elo: configuracao.pagamento_debito_elo === true,
    pagamento_pix: configuracao.pagamento_pix === true,
    pagamento_dinheiro: configuracao.pagamento_dinheiro === true
  };
  
  // Verificar se há alguma informação para mostrar
  const temInformacoes = (config.mostrar_endereco && config.endereco) || 
                        (config.mostrar_cnpj && config.cnpj) || 
                        (config.mostrar_horario && config.horario_funcionamento) || 
                        (config.mostrar_dias && config.dias_funcionamento);
  
  // Verificar se há métodos de pagamento para mostrar
  const temPagamentos = config.pagamento_carteira || 
                       config.pagamento_credito_mastercard || 
                       config.pagamento_credito_visa || 
                       config.pagamento_credito_elo || 
                       config.pagamento_credito_amex || 
                       config.pagamento_credito_hipercard || 
                       config.pagamento_debito_mastercard || 
                       config.pagamento_debito_visa || 
                       config.pagamento_debito_elo || 
                       config.pagamento_pix || 
                       config.pagamento_dinheiro;
  
  // Não renderizar nada se não houver informações ou pagamentos para mostrar
  if (!temInformacoes && !temPagamentos) {
    return null;
  }
  
  return (
    <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
      >
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaInfoCircle className="h-5 w-5 mr-2 text-gray-600" />
          Informações da Loja
        </h2>
        <FaChevronDown 
          className={`h-5 w-5 transition-transform ${expanded ? 'transform rotate-180' : ''}`}
        />
      </button>
      
      {expanded && (
        <div className="p-4 border-t border-gray-200">
          {temInformacoes && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Sobre a Loja</h3>
              <div className="space-y-3">
                {config.mostrar_endereco && config.endereco && (
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-gray-600">{config.endereco}</p>
                  </div>
                )}
                
                {config.mostrar_cnpj && config.cnpj && (
                  <div className="flex items-center">
                    <FaFileAlt className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <p className="text-gray-600">CNPJ: {config.cnpj}</p>
                  </div>
                )}
                
                {config.mostrar_horario && config.horario_funcionamento && (
                  <div className="flex items-center">
                    <FaClock className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <p className="text-gray-600">Horário: {config.horario_funcionamento}</p>
                  </div>
                )}
                
                {config.mostrar_dias && config.dias_funcionamento && (
                  <div className="flex items-center">
                    <FaCalendarAlt className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <p className="text-gray-600">Dias: {config.dias_funcionamento}</p>
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
                  {/* Métodos de pagamento online */}
                  <div className="mb-4">
                    <p className="font-medium text-gray-700 mb-2">Pagamento pelo site</p>
                    
                    {/* Cartões de crédito */}
                    {(config.pagamento_credito_mastercard || 
                      config.pagamento_credito_visa || 
                      config.pagamento_credito_elo || 
                      config.pagamento_credito_amex || 
                      config.pagamento_credito_hipercard) && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Crédito</p>
                        <div className="flex flex-wrap gap-2">
                          {config.pagamento_credito_mastercard && (
                            <span className="payment-tag bg-gray-50 rounded-md border border-gray-200 py-1 px-2 text-xs flex items-center">
                              <SiMastercard className="mr-1 text-orange-600" />
                              Mastercard
                            </span>
                          )}
                          {config.pagamento_credito_visa && (
                            <span className="payment-tag bg-gray-50 rounded-md border border-gray-200 py-1 px-2 text-xs flex items-center">
                              <SiVisa className="mr-1 text-blue-700" />
                              Visa
                            </span>
                          )}
                          {config.pagamento_credito_elo && (
                            <span className="payment-tag bg-gray-50 rounded-md border border-gray-200 py-1 px-2 text-xs flex items-center">
                              <FaCreditCard className="mr-1 text-yellow-600" />
                              Elo
                            </span>
                          )}
                          {config.pagamento_credito_amex && (
                            <span className="payment-tag bg-gray-50 rounded-md border border-gray-200 py-1 px-2 text-xs flex items-center">
                              <SiAmericanexpress className="mr-1 text-blue-500" />
                              Amex
                            </span>
                          )}
                          {config.pagamento_credito_hipercard && (
                            <span className="payment-tag bg-gray-50 rounded-md border border-gray-200 py-1 px-2 text-xs flex items-center">
                              <FaCreditCard className="mr-1 text-red-500" />
                              Hipercard
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Cartões de débito */}
                    {(config.pagamento_debito_mastercard || 
                      config.pagamento_debito_visa || 
                      config.pagamento_debito_elo) && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Débito</p>
                        <div className="flex flex-wrap gap-2">
                          {config.pagamento_debito_mastercard && (
                            <span className="payment-tag bg-gray-50 rounded-md border border-gray-200 py-1 px-2 text-xs flex items-center">
                              <SiMastercard className="mr-1 text-orange-600" />
                              Mastercard Débito
                            </span>
                          )}
                          {config.pagamento_debito_visa && (
                            <span className="payment-tag bg-gray-50 rounded-md border border-gray-200 py-1 px-2 text-xs flex items-center">
                              <SiVisa className="mr-1 text-blue-700" />
                              Visa Débito
                            </span>
                          )}
                          {config.pagamento_debito_elo && (
                            <span className="payment-tag bg-gray-50 rounded-md border border-gray-200 py-1 px-2 text-xs flex items-center">
                              <FaCreditCard className="mr-1 text-yellow-600" />
                              Elo Débito
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Outros métodos online */}
                    <div className="flex flex-wrap gap-2">
                      {config.pagamento_carteira && (
                        <span className="payment-tag bg-gray-50 rounded-md border border-gray-200 py-1 px-2 text-xs flex items-center">
                          <FaWallet className="mr-1 text-gray-600" />
                          Saldo da carteira
                        </span>
                      )}
                      {config.pagamento_pix && (
                        <span className="payment-tag bg-gray-50 rounded-md border border-gray-200 py-1 px-2 text-xs flex items-center">
                          <RiPixelfedFill className="mr-1 text-green-500" />
                          PIX
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Pagamento na entrega */}
                {config.pagamento_dinheiro && (
                  <div className="merchant-details-payment__payment">
                    <p className="font-medium text-gray-700 mb-2">Pagamento na entrega</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="payment-tag bg-gray-50 rounded-md border border-gray-200 py-1 px-2 text-xs flex items-center">
                        <BsCashCoin className="mr-1 text-green-600" />
                        Dinheiro
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 