"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPixPage() {
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState(330); // 5:30 em segundos
  const [isExpanded, setIsExpanded] = useState(false);
  const pixCode = "00020101021226770014BR.GOV...";

  // Timer para contagem regressiva
  useEffect(() => {
    if (!isClient) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient]);

  // Formatar o tempo restante no formato MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Copiar código PIX para a área de transferência
  const copyPix = () => {
    navigator.clipboard.writeText(pixCode);
    alert("Código PIX copiado!");
  };

  // Detectar renderização do cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Indicador de carregamento
  if (!isClient) {
    return (
      <div className="bg-white min-h-[100vh] w-full flex items-center justify-center">
        <div className="flex items-center">
          <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce mr-1" style={{animationDelay: '0ms'}}></div>
          <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce mr-1" style={{animationDelay: '150ms'}}></div>
          <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[100vh] w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Link href="/carrinho-novo" className="text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="font-bold text-lg">PAGAMENTO</span>
        <button className="text-red-500 text-sm font-medium">Ajuda</button>
      </div>
      
      {/* Curved Separator */}
      <div className="h-4 w-full bg-white relative overflow-hidden">
        <div className="absolute w-[120%] h-16 rounded-[50%] bg-[#D1578E] opacity-10 top-[-12px] left-[-10%]"></div>
      </div>
      
      {/* SVG Icon */}
      <div className="flex justify-center my-6">
        <svg width="120" height="114" viewBox="0 0 213 202" fill="none" xmlns="http://www.w3.org/2000/svg" className="order-status__info-image">
          <path d="M99.673 1.96411C154.721 1.96411 199.346 45.731 199.346 99.7206C199.346 153.71 154.721 197.477 99.673 197.477C44.6251 197.477 0 153.71 0 99.7206C0 45.731 44.6251 1.96411 99.673 1.96411Z" fill="#FDE3E1"></path>
          <path d="M110.555 49.5004C111.17 49.0902 117.643 40.0794 123.469 33.6272C138.441 15.4797 160.932 24.7748 132.897 50.5248L113.22 68.1325" fill="#C25D87"></path>
          <path d="M124.456 98.1804C124.661 108.122 120.049 112.017 114.309 112.017L74.8522 112.529C69.1125 112.529 67.0625 107.609 67.0625 101.87V10.3506C67.0625 4.61214 71.6746 0 77.4143 0H114.207C119.947 0 124.558 4.61214 124.558 10.3506L124.661 98.6926L124.456 98.1804Z" fill="#111111"></path>
          <path d="M124.298 81.019V97.0061C124.298 102.438 119.891 106.845 114.459 106.845H76.5388C71.1062 106.845 66.6992 102.438 66.6992 97.0061V14.4026C66.6992 8.97123 71.1062 4.56421 76.5388 4.56421H114.459C119.891 4.56421 124.298 8.97123 124.298 14.4026V47.8128" fill="white"></path>
          <path d="M77.1683 115.598C80.1407 100.84 71.3255 87.8237 70.403 84.543C68.148 76.5494 68.7645 59.5367 68.2511 54.2072C67.8781 40.6683 58.745 38.003 52.9657 42.7099C47.1864 47.4168 48.3547 63.4099 46.4067 78.1688C45.4843 84.7277 42.7158 96.4122 38.0017 101.024L12.0898 122.61C-17.0165 150.404 34.5903 200.205 43.9609 187.953C48.3847 186.411 108.119 121.235 108.119 121.235L77.1683 115.598Z" fill="#C25D87"></path>
          <path d="M77.5 111.457C77.0898 115.248 76.0264 119.348 72.4399 125.6C67.1104 135.029 75.1064 153.079 79 152.464L118.253 111.457H77.5Z" fill="#8C3A5C"></path>
          <path d="M131.35 71.4982C134.835 70.986 149.951 70.3275 143.849 83.3866C137.747 96.4458 122.536 101.526 122.536 101.526C122.536 101.526 114.439 108.701 110.546 99.6808C107.368 92.3026 118.129 82.8732 118.129 82.8732L131.35 71.4982Z" fill="#C25D87"></path>
          <path d="M122.087 81.7613C122.087 81.7613 141.352 63.4159 140.328 57.3703C139.609 52.9621 135.1 44.0257 131.308 45.4603C125.672 47.6123 113.99 61.0384 113.99 61.0384L114.297 60.7302C111.325 63.9077 109.788 69.134 110.3 72.3115C110.916 76.3083 114.604 84.6305 122.394 81.5562" fill="#C25D87"></path>
          <path d="M119.25 82.7137C119.25 82.7137 126.424 77.3831 132.574 71.2344" stroke="#8C3A5C" strokeWidth="1.562" strokeLinecap="round" strokeLinejoin="round"></path>
          <g opacity="0.76">
            <g opacity="0.76" style={{mixBlendMode: "multiply"}}>
              <path d="M84.7335 87.3179C77.4462 90.7419 82.3855 107.537 92.8213 108.842C103.257 110.146 101.022 99.5476 99.2132 95.0143C97.4047 90.481 94.6653 82.915 84.7335 87.3179Z" fill="black"></path>
            </g>
          </g>
          <path d="M161.4 201.323C193.715 199.603 227.5 173.446 205.363 153.873C201.161 150.387 197.368 146.492 193.783 142.393C187.428 135.015 173.286 118.616 173.182 118.411C163.959 108.676 149.045 111.982 135.62 113.315C129.573 113.929 123.014 113.622 120.143 110.24L98.7393 90.561C93.5874 81.5035 77.6722 79.9105 87.3379 101.694C97.0036 123.477 114.185 143.457 114.185 143.457C116.03 146.53 116.337 150.221 115.005 153.5C112.444 160.06 109.191 164.364 102.22 164.569L79.6886 161.584C75.3847 161.995 69.1064 165.786 69.3115 170.091C69.4135 173.883 72.2839 177.164 75.9725 177.88C75.9725 177.88 134.757 202.742 161.4 201.323Z" fill="#C25D87"></path>
          <path d="M84.0038 55.5245C84.7031 55.5245 85.394 55.3685 86.0394 55.0638C86.6847 54.7592 87.2701 54.3129 87.7631 53.7492L93.1981 47.5597C93.3912 47.351 93.6467 47.2334 93.913 47.2334C94.1781 47.2334 94.4348 47.351 94.6267 47.5597L100.083 53.7744C100.578 54.3381 101.165 54.7856 101.812 55.0902C102.458 55.3949 103.152 55.5496 103.851 55.5472H104.939L98.0513 63.3897C97.0185 64.5652 95.6175 65.2261 94.1565 65.2261C92.6967 65.2261 91.2957 64.5652 90.2629 63.3897L83.3477 55.5245H84.0038Z" fill="#77B6A8"></path>
          <path d="M103.85 34.1191C103.152 34.1167 102.46 34.2715 101.815 34.5749C101.171 34.8784 100.584 35.3234 100.091 35.886L94.632 42.0983C94.5384 42.2051 94.4268 42.2902 94.3045 42.3478C94.1821 42.4054 94.0514 42.4354 93.9182 42.4354C93.7851 42.4354 93.6543 42.4054 93.5308 42.3478C93.4084 42.2902 93.2969 42.2051 93.2033 42.0983L87.7671 35.9112C87.2717 35.3498 86.684 34.906 86.0374 34.6037C85.3897 34.3026 84.6976 34.1491 83.9982 34.1539H83.3457L90.2501 26.2791C91.2829 25.1036 92.6839 24.4426 94.1449 24.4426C95.606 24.4426 97.007 25.1036 98.0398 26.2791L104.937 34.1191H103.85Z" fill="#77B6A8"></path>
          <path d="M76.6554 40.7644L81.0108 36.4605H83.3979C84.4426 36.4617 85.4442 36.8708 86.1855 37.5977L91.9408 43.2846C92.1975 43.5389 92.5022 43.7404 92.838 43.8783C93.1739 44.0163 93.5338 44.0871 93.8984 44.0871C94.2619 44.0871 94.6217 44.0163 94.9564 43.8783C95.2935 43.7404 95.5981 43.5389 95.8548 43.2846L101.633 37.5749C102.374 36.848 103.377 36.4401 104.422 36.4377H107.249L111.622 40.7596C112.166 41.2946 112.595 41.9303 112.888 42.6296C113.181 43.3278 113.332 44.0775 113.332 44.8344C113.332 45.5913 113.181 46.3409 112.888 47.0403C112.595 47.7384 112.166 48.3741 111.622 48.9091L107.249 53.231H104.413C103.369 53.2298 102.366 52.8207 101.623 52.0938L95.8452 46.3853C95.3186 45.8863 94.6181 45.608 93.8888 45.608C93.1595 45.608 92.4578 45.8863 91.9312 46.3853L86.1759 52.071C85.4358 52.7979 84.433 53.207 83.3895 53.2082H81.0108L76.6554 48.9139C75.5614 47.8331 74.9473 46.3673 74.9473 44.8392C74.9473 43.311 75.5614 41.8452 76.6554 40.7644Z" fill="#77B6A8"></path>
          <g opacity="0.971961">
            <path d="M151.068 69.2216C151.068 55.9929 161.736 45.2959 174.97 45.2959C188.201 45.2959 198.896 56.0166 198.896 69.2216C198.896 70.2137 198.092 71.0175 197.102 71.0175C196.11 71.0175 195.304 70.2137 195.304 69.2216C195.304 57.9973 186.215 48.8876 174.97 48.8876C163.726 48.8876 154.66 57.9718 154.66 69.2216C154.66 80.468 163.749 89.554 174.994 89.554C181.508 89.554 187.292 86.4982 191.014 81.7416C191.626 80.9598 192.754 80.8225 193.536 81.4346C194.317 82.0451 194.457 83.1745 193.846 83.9546C189.473 89.5438 182.661 93.1474 174.994 93.1474C161.765 93.1474 151.068 82.4521 151.068 69.2216Z" fill="#FC121A"></path>
            <path d="M172.361 69.43V56.304" stroke="#FD110F" strokeWidth="2.23368" strokeMiterlimit="10" strokeLinecap="round"></path>
            <path d="M172.467 69.5066H185.239" stroke="#FD110F" strokeWidth="2.82744" strokeMiterlimit="10" strokeLinecap="round"></path>
          </g>
        </svg>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col items-center">
        <div className="max-w-md w-full flex flex-col items-center">
          {/* Título principal */}
          <h1 className="text-xl font-medium text-gray-700 mb-2">Pedido aguardando pagamento</h1>
          
          {/* Subtítulo */}
          <p className="text-gray-600 text-center text-sm mb-6">
            Copie o código abaixo e utilize o Pix Copia e Cola no aplicativo que você vai fazer o pagamento:
          </p>
          
          {/* PIX Code Box */}
          <div className="w-full p-4 border border-gray-200 rounded-lg mb-4 flex items-center justify-between bg-gray-50">
            <span className="text-gray-800 font-mono text-sm truncate flex-1">{pixCode}</span>
            <button onClick={copyPix} className="text-red-500 ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
          
          {/* Timer */}
          <p className="text-gray-600 text-sm mb-2">O tempo para você pagar acaba em:</p>
          <div className="w-full mb-8">
            <div className="text-2xl font-bold mb-2">{formatTime(timeLeft)}</div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{width: `${(timeLeft / 330) * 100}%`}}
              ></div>
            </div>
          </div>
          
          {/* Como funciona */}
          <button 
            onClick={() => {}} 
            className="text-red-500 font-medium mb-6"
          >
            Como funciona
          </button>
          
          {/* Order Details Card */}
          <div className="w-full border border-gray-200 rounded-lg mb-6">
            <div className="p-4">
              <div className="flex items-center mb-2">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3">
                  <Image 
                    src="/images/bobs-logo.png" 
                    width={48} 
                    height={48} 
                    alt="Logo restaurante" 
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">The Last Burguer - Centro Sul</p>
                  <p className="text-sm text-gray-600">Nº do pedido 3817</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <span className="font-medium">Total</span>
                <span className="font-medium">R$ 49,80</span>
              </div>
              
              <div 
                className="flex items-center justify-between py-2 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <span className="text-gray-700">Ver itens do pedido</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-red-500 transform ${isExpanded ? 'rotate-180' : ''}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              
              {isExpanded && (
                <div className="pt-2 border-t border-gray-100">
                  {/* Aqui você pode adicionar os itens do pedido */}
                  <div className="flex justify-between py-1">
                    <span className="text-sm">1x Hambúrguer</span>
                    <span className="text-sm">R$ 29,90</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-sm">1x Batata Frita</span>
                    <span className="text-sm">R$ 14,90</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-sm">1x Refrigerante</span>
                    <span className="text-sm">R$ 5,00</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm text-center mb-4">
            Você tem até 5 minutos para fazer o pagamento. Após esse tempo, o pedido será cancelado.
          </p>
          
          {/* Action Buttons */}
          <button 
            onClick={copyPix}
            className="w-full bg-red-500 text-white font-medium py-3 rounded-md mb-3"
          >
            Copiar código
          </button>
          
          <button 
            className="w-full text-red-500 font-medium py-3"
          >
            Pagar com banco parceiro
          </button>
        </div>
      </div>
    </div>
  );
} 