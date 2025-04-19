"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Phone } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dados de exemplo
const pedidos = [
  {
    id: "P001",
    cliente: "João Silva",
    telefone: "(11) 98765-4321",
    itens: [
      { nome: "X-Tudo", quantidade: 1, preco: "R$ 30,00" },
      { nome: "Refrigerante 2L", quantidade: 1, preco: "R$ 10,00" },
    ],
    total: "R$ 40,00",
    status: "pendente",
    data: "19/04/2023 14:30",
    pagamento: "Dinheiro",
  },
  {
    id: "P002",
    cliente: "Maria Oliveira",
    telefone: "(11) 91234-5678",
    itens: [
      { nome: "Pizza Calabresa", quantidade: 1, preco: "R$ 35,00" },
      { nome: "Refrigerante 2L", quantidade: 1, preco: "R$ 10,00" },
    ],
    total: "R$ 45,00",
    status: "preparo",
    data: "19/04/2023 14:15",
    pagamento: "PIX",
  },
  {
    id: "P003",
    cliente: "Pedro Santos",
    telefone: "(11) 99876-5432",
    itens: [
      { nome: "Combo Família", quantidade: 1, preco: "R$ 50,00" },
      { nome: "Açaí 500ml", quantidade: 2, preco: "R$ 40,00" },
    ],
    total: "R$ 90,00",
    status: "entregue",
    data: "19/04/2023 13:45",
    pagamento: "Cartão",
  },
  {
    id: "P004",
    cliente: "Ana Souza",
    telefone: "(11) 97654-3210",
    itens: [{ nome: "X-Tudo", quantidade: 2, preco: "R$ 60,00" }],
    total: "R$ 60,00",
    status: "cancelado",
    data: "19/04/2023 13:30",
    pagamento: "PIX",
  },
]

export default function PedidosPage() {
  const [statusAtivo, setStatusAtivo] = useState("todos")
  const [pedidoSelecionado, setPedidoSelecionado] = useState<any>(null)
  const [dialogAberto, setDialogAberto] = useState(false)

  // Filtrar pedidos por status
  const pedidosFiltrados = statusAtivo === "todos" ? pedidos : pedidos.filter((pedido) => pedido.status === statusAtivo)

  // Abrir detalhes do pedido
  const verPedido = (pedido: any) => {
    setPedidoSelecionado(pedido)
    setDialogAberto(true)
  }

  // Obter badge de status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case "preparo":
        return <Badge className="bg-blue-100 text-blue-800">Em preparo</Badge>
      case "entregue":
        return <Badge className="bg-green-100 text-green-800">Entregue</Badge>
      case "cancelado":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <p className="text-gray-500">Gerencie os pedidos recebidos.</p>
      </div>

      {/* Filtros de status */}
      <Tabs value={statusAtivo} onValueChange={setStatusAtivo} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pendente">Pendentes</TabsTrigger>
          <TabsTrigger value="preparo">Em preparo</TabsTrigger>
          <TabsTrigger value="entregue">Entregues</TabsTrigger>
          <TabsTrigger value="cancelado">Cancelados</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Lista de pedidos */}
      <div className="space-y-4">
        {pedidosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <div className="text-gray-500">Nenhum pedido encontrado</div>
          </div>
        ) : (
          pedidosFiltrados.map((pedido) => (
            <Card key={pedido.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pedido {pedido.id}</CardTitle>
                  {getStatusBadge(pedido.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <p className="font-medium">{pedido.cliente}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Phone className="h-3 w-3" />
                        {pedido.telefone}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{pedido.data}</p>
                      <p className="font-medium">{pedido.total}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">
                      <span className="text-gray-500">Pagamento: </span>
                      {pedido.pagamento}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => verPedido(pedido)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detalhes do pedido */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido {pedidoSelecionado?.id}</DialogTitle>
          </DialogHeader>
          {pedidoSelecionado && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">Cliente</h3>
                  <p>{pedidoSelecionado.cliente}</p>
                  <p className="text-sm text-gray-500">{pedidoSelecionado.telefone}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-medium">Data e Hora</h3>
                  <p>{pedidoSelecionado.data}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Status</h3>
                <div className="mt-2">
                  <Select defaultValue={pedidoSelecionado.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="preparo">Em preparo</SelectItem>
                      <SelectItem value="entregue">Entregue</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Itens do pedido</h3>
                <div className="mt-2 space-y-2 rounded-md border p-2">
                  {pedidoSelecionado.itens.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p>
                          {item.quantidade}x {item.nome}
                        </p>
                      </div>
                      <p>{item.preco}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between border-t pt-4">
                <h3 className="font-medium">Total</h3>
                <p className="font-bold">{pedidoSelecionado.total}</p>
              </div>

              <div>
                <h3 className="font-medium">Forma de pagamento</h3>
                <p>{pedidoSelecionado.pagamento}</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogAberto(false)}>
                  Fechar
                </Button>
                <Button>Atualizar pedido</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
