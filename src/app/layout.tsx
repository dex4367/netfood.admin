import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NetFood - Cardápio Digital",
  description: "Cardápio digital com integração ao Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <header className="bg-green-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <Link href="/" className="text-2xl font-bold hover:text-green-100 transition-colors">
                NetFood
              </Link>
              <p className="text-sm md:text-base text-green-100">
                Seu cardápio digital completo
              </p>
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
                &copy; {new Date().getFullYear()} NetFood - Todos os direitos reservados
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
      </body>
    </html>
  );
}
