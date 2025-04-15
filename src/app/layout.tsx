import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { initializeDatabase } from "@/lib/init-db";
import { gerarMetadata } from "./metadata";
import Image from "next/image";
import { Providers } from "./providers";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const generateMetadata = gerarMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Inicializar banco de dados para garantir que as tabelas existam
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  }
  
  // Buscar configurações da loja
  let nomeLoja = 'NetFood';
  let descricaoLoja = 'Seu cardápio digital completo';
  let corPrimaria = '#16a34a'; // green-600
  let corSecundaria = '#15803d'; // green-700
  let logoUrl = null;
  
  try {
    // Buscar configuração da loja diretamente
    const { data, error } = await supabase
      .from('configuracao_loja')
      .select('*')
      .limit(1);
      
    if (!error && data && data.length > 0) {
      const configuracao = data[0];
      nomeLoja = configuracao.nome_loja;
      descricaoLoja = configuracao.descricao_loja || 'Seu cardápio digital completo';
      corPrimaria = configuracao.cor_primaria || '#16a34a';
      corSecundaria = configuracao.cor_secundaria || '#15803d';
      logoUrl = configuracao.logo_url;
    }
  } catch (err) {
    console.error('Erro ao buscar configuração:', err);
  }
  
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} min-h-screen bg-white`}>
        <Providers>
          {/* O cabeçalho será gerenciado por cada página */}
          <main className="container mx-auto px-0 sm:px-4 py-0 max-w-md">
            {children}
          </main>
          
          <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm mb-4 md:mb-0">
                  &copy; {new Date().getFullYear()} {nomeLoja} - Todos os direitos reservados
                </p>
                <div className="flex space-x-4">
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Sobre
                  </Link>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Contato
                  </Link>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Política de Privacidade
                  </Link>
                </div>
              </div>
            </div>
          </footer>
          
          {/* Script para controlar o comportamento de scroll da barra de categorias */}
          <script dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                // Função para lidar com o scroll
                let lastScrollY = window.scrollY;
                let originalTop = 0;
                let barraPlaceholder = null;
                let barraOriginalParent = null;
                
                function handleScroll() {
                  const header = document.querySelector('.header-wrapper');
                  const categoriesBar = document.querySelector('.categories-list-mobile');
                  
                  if (!header || !categoriesBar) return;
                  
                  // Na primeira vez, salvar a posição original da barra
                  if (originalTop === 0) {
                    const rect = categoriesBar.getBoundingClientRect();
                    originalTop = rect.top + window.scrollY;
                    barraOriginalParent = categoriesBar.parentElement;
                  }
                  
                  const headerRect = header.getBoundingClientRect();
                  const currentScrollY = window.scrollY;
                  
                  // Se a posição de rolagem é maior que a posição original da barra de categorias - altura do cabeçalho
                  if (currentScrollY > originalTop - headerRect.height) {
                    // Se a barra ainda não está fixa, fixá-la
                    if (!categoriesBar.classList.contains('fixed')) {
                      categoriesBar.classList.add('fixed');
                      
                      // Posicionar corretamente a barra para eliminar espaço entre ela e o cabeçalho
                      const headerHeight = headerRect.height;
                      categoriesBar.style.top = headerHeight + 'px';
                      categoriesBar.style.position = 'fixed';
                      categoriesBar.style.left = '0';
                      categoriesBar.style.right = '0';
                      categoriesBar.style.zIndex = '40';
                      categoriesBar.style.marginTop = '0';
                      categoriesBar.style.paddingTop = '0';
                      categoriesBar.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                      
                      // Criar um espaço reservado para evitar saltos no layout
                      if (!barraPlaceholder) {
                        barraPlaceholder = document.createElement('div');
                        barraPlaceholder.style.height = categoriesBar.offsetHeight + 'px';
                        barraOriginalParent.insertBefore(barraPlaceholder, categoriesBar.nextSibling);
                      }
                    }
                  } else {
                    // Se estamos acima da posição original, remover a classe 'fixed'
                    if (categoriesBar.classList.contains('fixed')) {
                      categoriesBar.classList.remove('fixed');
                      categoriesBar.style.position = '';
                      categoriesBar.style.top = '';
                      categoriesBar.style.left = '';
                      categoriesBar.style.right = '';
                      categoriesBar.style.zIndex = '';
                      categoriesBar.style.boxShadow = '';
                      
                      if (barraPlaceholder) {
                        barraPlaceholder.remove();
                        barraPlaceholder = null;
                      }
                    }
                  }
                  
                  lastScrollY = currentScrollY;
                }
                
                // Adicionar evento de scroll
                window.addEventListener('scroll', handleScroll);
                
                // Verificar posição inicial após o DOM estar totalmente carregado
                setTimeout(handleScroll, 300);
                
                // Verificar novamente após o carregamento completo da página
                window.addEventListener('load', function() {
                  setTimeout(handleScroll, 500);
                });
              });
            `
          }} />
        </Providers>
      </body>
    </html>
  );
}