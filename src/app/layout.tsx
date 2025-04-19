import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { initializeDatabase } from "@/lib/init-db";
import { gerarMetadata } from "./metadata";
import Image from "next/image";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { buscarConfiguracaoLoja } from '@/lib/supabase';

const inter = Inter({ subsets: ["latin"] });

export const generateMetadata = gerarMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Inicializar banco de dados na primeira carga
  initializeDatabase().catch(error => {
    console.error("Erro ao inicializar banco de dados:", error);
  });
  
  // Buscar configurações da loja
  let nomeLoja = 'NetFood';
  let descricaoLoja = 'Seu cardápio digital completo';
  let corPrimaria = '#16a34a'; // green-600
  let corSecundaria = '#15803d'; // green-700
  let logoUrl = null;
  
  try {
    // Buscar configuração da loja diretamente
    const configuracao = await buscarConfiguracaoLoja();
    if (configuracao) {
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
                
                function handleScroll() {
                  const header = document.querySelector('.header-wrapper');
                  const categoryBar = document.querySelector('.category-bar');
                  
                  if (!header || !categoryBar) return;
                  
                  const currentScrollY = window.scrollY;
                  const sections = document.querySelectorAll('section');
                  const headerHeight = header.getBoundingClientRect().height;
                  
                  // Quando rolar para baixo, identificar qual seção está visível
                  if (sections.length > 0) {
                    for (let i = 0; i < sections.length; i++) {
                      const section = sections[i];
                      const sectionTop = section.getBoundingClientRect().top;
                      
                      // Se a seção estiver próxima ao topo da tela (considerando a altura do header)
                      if (sectionTop <= headerHeight + 100) {
                        // Verificar se a seção tem um id que corresponde a uma categoria
                        const categoryId = section.getAttribute('data-category-id');
                        
                        if (categoryId) {
                          // Encontrar o botão correspondente e ativá-lo
                          const categoryBtn = document.querySelector(\`button[data-category-id="\${categoryId}"]\`);
                          if (categoryBtn) {
                            // Simular um clique no botão para ativar a categoria
                            categoryBtn.click();
                          }
                        }
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