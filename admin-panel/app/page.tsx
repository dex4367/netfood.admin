"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProdutos, getPedidos, getConfiguracao } from "@/lib/supabase"
import { Loader2, ShoppingBag, UtensilsCrossed, Wallet, TrendingUp } from "lucide-react"
import { SalesChart } from "@/components/sales-chart"
import { RecentOrdersTable } from "@/components/recent-orders-table"
import Link from "next/link"

// Definindo tipos
interface Pedido {
  id: string;
  cliente_id?: string;
  status: string;
  forma_pagamento: string;
  valor_produtos: number;
  valor_entrega: number;
  valor_total: number;
  created_at: string;
  [key: string]: any; // Para outras propriedades que possam existir
}

interface DashboardStats {
  totalProdutos: number;
  totalPedidos: number;
  faturamentoTotal: number;
  ticketMedio: number;
  pedidosRecentes: Pedido[];
}

export default function DashboardPage() {
  const [carregando, setCarregando] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalProdutos: 0,
    totalPedidos: 0,
    faturamentoTotal: 0,
    ticketMedio: 0,
    pedidosRecentes: []
  })
  const [nomeLoja, setNomeLoja] = useState("NetFood")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCarregando(true)
        
        // Buscar dados do painel
        const produtos = await getProdutos()
        const pedidos = await getPedidos() as Pedido[]
        const config = await getConfiguracao()
        
        // Calcular estatísticas
        const totalProdutos = produtos.length
        const totalPedidos = pedidos.length
        
        // Calcular faturamento usando valor_total dos pedidos
        const faturamentoTotal = pedidos.reduce((acc: number, pedido: Pedido) => 
          acc + (parseFloat(pedido.valor_total as any) || 0), 0)
        
        // Calcular ticket médio (faturamento / número de pedidos)
        const ticketMedio = totalPedidos > 0 
          ? faturamentoTotal / totalPedidos 
          : 0
        
        // Atualizar estado com as estatísticas
        setStats({
          totalProdutos,
          totalPedidos,
          faturamentoTotal,
          ticketMedio,
          pedidosRecentes: pedidos.slice(0, 5)
        })
        
        // Atualizar nome da loja se disponível
        if (config?.nome_loja) {
          setNomeLoja(config.nome_loja)
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error)
      } finally {
        setCarregando(false)
      }
    }
    
    fetchData()
  }, [])

  // Formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`
  }

  if (carregando) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bem-vindo ao painel do {nomeLoja}</h1>
        <p className="text-gray-500">Visualize todas as informações do seu negócio de forma simplificada.</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Produtos Cadastrados</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProdutos}</div>
            <p className="text-xs text-gray-500">
              <Link href="/produtos" className="text-blue-600 hover:underline">
                Gerenciar produtos
              </Link>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPedidos}</div>
            <p className="text-xs text-gray-500">
              <Link href="/pedidos" className="text-blue-600 hover:underline">
                Ver todos os pedidos
              </Link>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <Wallet className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(stats.faturamentoTotal)}</div>
            <p className="text-xs text-gray-500">De todos os pedidos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(stats.ticketMedio)}</div>
            <p className="text-xs text-gray-500">Por pedido</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Vendas & Pedidos Recentes */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Vendas Semanais</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrdersTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
