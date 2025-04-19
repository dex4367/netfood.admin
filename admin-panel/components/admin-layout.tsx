"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import { fazerLogout } from "@/lib/supabase"
import { useState } from "react"

// Ícones simplificados para cada seção
import {
  LayoutDashboard,
  UtensilsCrossed,
  LayoutList,
  Plus,
  ShoppingBag,
  ImageIcon,
  CreditCard,
  Settings,
  LogOut,
  Loader2
} from "lucide-react"

// Lista de navegação simplificada
const navigation = [
  { name: "Início", href: "/", icon: LayoutDashboard },
  { name: "Produtos", href: "/produtos", icon: UtensilsCrossed },
  { name: "Categorias", href: "/categorias", icon: LayoutList },
  { name: "Complementos", href: "/complementos", icon: Plus },
  { name: "Pedidos", href: "/pedidos", icon: ShoppingBag },
  { name: "Banners", href: "/banners", icon: ImageIcon },
  { name: "Pagamentos", href: "/pagamentos", icon: CreditCard },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [saindo, setSaindo] = useState(false)

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      setSaindo(true)
      await fazerLogout()
      toast.success("Logout realizado com sucesso!")
      router.push("/login")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      toast.error("Erro ao fazer logout")
      setSaindo(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Cabeçalho simplificado */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4">
        <div className="flex items-center gap-3">
          {/* Menu para dispositivos móveis */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] p-0">
              <div className="flex h-16 items-center border-b px-4 font-bold">Cardápio Digital</div>
              <nav className="grid gap-1 p-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                      pathname === item.href ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
                
                {/* Botão de logout no menu mobile */}
                <button
                  onClick={handleLogout}
                  disabled={saindo}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors text-red-600 hover:bg-red-50 mt-4"
                >
                  {saindo ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
                  {saindo ? "Saindo..." : "Sair"}
                </button>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="font-bold text-xl">Cardápio Digital</div>
        </div>

        {/* Título da página atual */}
        <div className="flex items-center gap-4">
          <div className="text-lg font-medium">
            {navigation.find((item) => item.href === pathname)?.name || "Início"}
          </div>
          
          {/* Botão de logout */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            disabled={saindo}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hidden md:flex"
          >
            {saindo ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saindo...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Layout principal com menu lateral e conteúdo */}
      <div className="flex flex-1">
        {/* Menu lateral para desktop */}
        <aside className="hidden w-64 border-r bg-white md:block">
          <nav className="grid gap-1 p-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors ${
                  pathname === item.href ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
            
            {/* Botão de logout no menu lateral */}
            <button
              onClick={handleLogout}
              disabled={saindo}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors text-red-600 hover:bg-red-50 mt-4"
            >
              {saindo ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
              {saindo ? "Saindo..." : "Sair"}
            </button>
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
