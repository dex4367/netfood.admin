import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Lista de Produtos | NetFood",
  description: "Confira nossa lista completa de produtos disponíveis para entrega",
};

export default function ProdutosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="main-layout">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {children}
        </div>
      </div>
    </main>
  )
} 