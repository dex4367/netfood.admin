import type { Metadata } from "next";
import "../globals.css";
import { Providers } from "../providers";

export const metadata: Metadata = {
  title: "Detalhes do Produto | Bob's",
  description: "Detalhes do produto selecionado",
  icons: {
    icon: "/images/bobs-logo.png",
  },
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  )
} 