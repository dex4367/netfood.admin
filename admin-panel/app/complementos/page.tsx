"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dados de exemplo
const complementos = [
  { id: 1, nome: "Molhos", tipo: "Escolha até 2", preco: "R$ 2,00", disponivel: true },
  { id: 2, nome: "Queijos", tipo: "Escolha 1", preco: "R$ 3,00", disponivel: true },
  { id: 3, nome: "Coberturas", tipo: "Escolha até 3", preco: "R$ 4,00", disponivel: false },
  { id: 4, nome: "Adicionais", tipo: "Opcional", preco: "R$ 5,00", disponivel: true },
]

const tiposComplemento = ["Escolha 1", "Escolha até 2", "Escolha até 3", "Opcional"]

export default function ComplementosPage() {
  const [complementoSelecionado, setComplementoSelecionado] = useState<any>(null)
  const [dialogAberto, setDialogAberto] = useState(false)

  // Abrir formulário para editar complemento
  const editarComplemento = (complemento: any) => {
    setComplementoSelecionado(complemento)
    setDialogAberto(true)
  }

  // Abrir formulário para novo complemento
  const novoComplemento = () => {
    setComplementoSelecionado(null)
    setDialogAberto(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Complementos</h1>
        <p className="text-gray-500">Adicione opções extras aos seus produtos.</p>
      </div>

      {/* Botão para adicionar novo complemento */}
      <div className="flex justify-end">
        <Button onClick={novoComplemento}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Complemento
        </Button>
      </div>

      {/* Lista de complementos */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {complementos.map((complemento) => (
          <Card key={complemento.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-lg">{complemento.nome}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">{complemento.tipo}</p>
                  <p className="font-medium">{complemento.preco}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={complemento.disponivel} />
                    <Label className="text-sm">Disponível</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => editarComplemento(complemento)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulário de complemento */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{complementoSelecionado ? "Editar Complemento" : "Novo Complemento"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome do complemento</Label>
              <Input id="nome" defaultValue={complementoSelecionado?.nome || ""} placeholder="Ex: Molhos" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo de seleção</Label>
                <Select defaultValue={complementoSelecionado?.tipo || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposComplemento.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="preco">Preço</Label>
                <Input
                  id="preco"
                  defaultValue={complementoSelecionado?.preco?.replace("R$ ", "") || ""}
                  placeholder="Ex: 2,00"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch defaultChecked={complementoSelecionado?.disponivel || true} />
              <Label>Disponível para venda</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setDialogAberto(false)}>
              {complementoSelecionado ? "Salvar alterações" : "Criar complemento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
