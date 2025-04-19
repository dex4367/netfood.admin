"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, MoreHorizontal } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

const orders = [
  {
    id: "ORD-001",
    customer: "João Silva",
    status: "pendente",
    items: 3,
    total: "R$ 78,90",
    date: "2023-04-19 14:32",
    payment: "Cartão de Crédito",
  },
  {
    id: "ORD-002",
    customer: "Maria Oliveira",
    status: "em preparo",
    items: 2,
    total: "R$ 45,50",
    date: "2023-04-19 14:28",
    payment: "PIX",
  },
  {
    id: "ORD-003",
    customer: "Pedro Santos",
    status: "entregue",
    items: 5,
    total: "R$ 112,30",
    date: "2023-04-19 13:45",
    payment: "Dinheiro",
  },
  {
    id: "ORD-004",
    customer: "Ana Souza",
    status: "cancelado",
    items: 1,
    total: "R$ 22,90",
    date: "2023-04-19 13:30",
    payment: "Cartão de Débito",
  },
  {
    id: "ORD-005",
    customer: "Carlos Ferreira",
    status: "entregue",
    items: 4,
    total: "R$ 89,70",
    date: "2023-04-19 12:55",
    payment: "PIX",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pendente":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
          Pendente
        </Badge>
      )
    case "em preparo":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          Em Preparo
        </Badge>
      )
    case "entregue":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700">
          Entregue
        </Badge>
      )
    case "cancelado":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700">
          Cancelado
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function RecentOrdersTable() {
  const isMobile = useMobile()
  const { toast } = useToast()

  const handleStatusChange = (orderId: string, status: string) => {
    toast({
      title: "Status atualizado",
      description: `Pedido ${orderId} atualizado para ${status}`,
    })
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b p-3">
                <div className="font-medium">{order.id}</div>
                <Select defaultValue={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue>{getStatusBadge(order.status)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Pendente
                      </Badge>
                    </SelectItem>
                    <SelectItem value="em preparo">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Em Preparo
                      </Badge>
                    </SelectItem>
                    <SelectItem value="entregue">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Entregue
                      </Badge>
                    </SelectItem>
                    <SelectItem value="cancelado">
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        Cancelado
                      </Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Cliente</div>
                  <div>{order.customer}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total</div>
                  <div>{order.total}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Itens</div>
                  <div>{order.items}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Pagamento</div>
                  <div>{order.payment}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-muted-foreground">Data</div>
                  <div>{order.date}</div>
                </div>
              </div>
              <div className="flex justify-end border-t p-2">
                <Button variant="ghost" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pedido</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Itens</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="hidden md:table-cell">Data</TableHead>
          <TableHead className="hidden md:table-cell">Pagamento</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>
              <Select defaultValue={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue>{getStatusBadge(order.status)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      Pendente
                    </Badge>
                  </SelectItem>
                  <SelectItem value="em preparo">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Em Preparo
                    </Badge>
                  </SelectItem>
                  <SelectItem value="entregue">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Entregue
                    </Badge>
                  </SelectItem>
                  <SelectItem value="cancelado">
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      Cancelado
                    </Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>{order.items}</TableCell>
            <TableCell>{order.total}</TableCell>
            <TableCell className="hidden md:table-cell">{order.date}</TableCell>
            <TableCell className="hidden md:table-cell">{order.payment}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem>Imprimir</DropdownMenuItem>
                  <DropdownMenuItem>Cancelar pedido</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
