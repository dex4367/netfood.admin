"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useMobile } from "@/hooks/use-mobile"

// Dados dinâmicos para o gráfico
const generateData = (period: string) => {
  let data = []

  switch (period) {
    case "week":
      data = [
        { name: "Seg", vendas: 1200, pedidos: 12 },
        { name: "Ter", vendas: 1800, pedidos: 18 },
        { name: "Qua", vendas: 1400, pedidos: 14 },
        { name: "Qui", vendas: 2200, pedidos: 22 },
        { name: "Sex", vendas: 2800, pedidos: 28 },
        { name: "Sáb", vendas: 3600, pedidos: 36 },
        { name: "Dom", vendas: 2400, pedidos: 24 },
      ]
      break
    case "month":
      data = [
        { name: "Semana 1", vendas: 8500, pedidos: 85 },
        { name: "Semana 2", vendas: 9200, pedidos: 92 },
        { name: "Semana 3", vendas: 7800, pedidos: 78 },
        { name: "Semana 4", vendas: 10500, pedidos: 105 },
      ]
      break
    case "year":
      data = [
        { name: "Jan", vendas: 35000, pedidos: 350 },
        { name: "Fev", vendas: 32000, pedidos: 320 },
        { name: "Mar", vendas: 38000, pedidos: 380 },
        { name: "Abr", vendas: 42000, pedidos: 420 },
        { name: "Mai", vendas: 39000, pedidos: 390 },
        { name: "Jun", vendas: 45000, pedidos: 450 },
        { name: "Jul", vendas: 48000, pedidos: 480 },
        { name: "Ago", vendas: 51000, pedidos: 510 },
        { name: "Set", vendas: 47000, pedidos: 470 },
        { name: "Out", vendas: 49000, pedidos: 490 },
        { name: "Nov", vendas: 53000, pedidos: 530 },
        { name: "Dez", vendas: 58000, pedidos: 580 },
      ]
      break
    default:
      data = [
        { name: "Seg", vendas: 1200, pedidos: 12 },
        { name: "Ter", vendas: 1800, pedidos: 18 },
        { name: "Qua", vendas: 1400, pedidos: 14 },
        { name: "Qui", vendas: 2200, pedidos: 22 },
        { name: "Sex", vendas: 2800, pedidos: 28 },
        { name: "Sáb", vendas: 3600, pedidos: 36 },
        { name: "Dom", vendas: 2400, pedidos: 24 },
      ]
  }

  return data
}

export function SalesChart() {
  const [mounted, setMounted] = useState(false)
  const [period, setPeriod] = useState("week")
  const [data, setData] = useState(generateData("week"))
  const isMobile = useMobile()

  useEffect(() => {
    setMounted(true)
    setData(generateData(period))
  }, [period])

  if (!mounted) {
    return null
  }

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
    setData(generateData(newPeriod))
  }

  return (
    <div className="h-full w-full">
      <div className="mb-4 flex justify-end gap-2">
        <button
          onClick={() => handlePeriodChange("week")}
          className={`rounded-md px-3 py-1 text-xs ${
            period === "week" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          Semana
        </button>
        <button
          onClick={() => handlePeriodChange("month")}
          className={`rounded-md px-3 py-1 text-xs ${
            period === "month" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          Mês
        </button>
        <button
          onClick={() => handlePeriodChange("year")}
          className={`rounded-md px-3 py-1 text-xs ${
            period === "year" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          Ano
        </button>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="vendas" fill="#8884d8" name="Vendas (R$)" />
          <Bar yAxisId="right" dataKey="pedidos" fill="#82ca9d" name="Pedidos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
