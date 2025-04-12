import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { buscarConfiguracaoLoja } from "@/lib/supabase";
import { gerarMetadata } from "./metadata";
import Image from "next/image";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const generateMetadata = gerarMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Carregar configurações da loja
  const configuracao = await buscarConfiguracaoLoja();
  const nomeLoja = configuracao?.nome_loja || 'NetFood';
  const descricaoLoja = configuracao?.descricao_loja || 'Seu cardápio digital completo';
  const corPrimaria = configuracao?.cor_primaria || '#16a34a'; // green-600
  const corSecundaria = configuracao?.cor_secundaria || '#15803d'; // green-700
  const logoUrl = configuracao?.logo_url;
  
  const headerStyles = {
    backgroundColor: corPrimaria,
  };
  
  const buttonStyles = {
    backgroundColor: corSecundaria,
  };
  
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <Providers>
          <header className="text-white shadow-md" style={headerStyles}>
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <Link href="/" className="text-2xl font-bold hover:text-green-100 transition-colors flex items-center gap-3">
                  {logoUrl ? (
                    <>
                      <div className="relative w-[120px] h-[40px]">
                        <Image 
                          src={logoUrl} 
                          alt={nomeLoja} 
                          fill 
                          className="object-contain" 
                        />
                      </div>
                      <span className="sr-only">{nomeLoja}</span>
                    </>
                  ) : (
                    nomeLoja
                  )}
                </Link>
                <div className="flex items-center space-x-4 mt-2 md:mt-0">
                  <p className="text-sm md:text-base text-green-100">
                    {descricaoLoja}
                  </p>
                  <Link 
                    href="/admin" 
                    className="ml-4 px-3 py-1 text-white text-sm rounded-md transition-colors hover:opacity-90"
                    style={buttonStyles}
                  >
                    Admin
                  </Link>
                </div>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
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
        </Providers>
      </body>
    </html>
  );
}
