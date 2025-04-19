"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// Dados de exemplo
const categorias = [
  { id: 1, nome: "Lanches", produtos: 12 },
  { id: 2, nome: "Pizzas", produtos: 8 },
  { id: 3, nome: "Sobremesas", produtos: 5 },
  { id: 4, nome: "Bebidas", produtos: 10 },
  { id: 5, nome: "Combos", produtos: 3 },
]

export default function CategoriasPage() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<any>(null)
  const [dialogAberto, setDialogAberto] = useState(false)

  // Abrir formulário para editar categoria
  const editarCategoria = (categoria: any) => {
    setCategoriaSelecionada(categoria)
    setDialogAberto(true)
  }

  // Abrir formulário para nova categoria
  const novaCategoria = () => {
    setCategoriaSelecionada(null)
    setDialogAberto(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <p className="text-gray-500">Organize seus produtos em categorias.</p>
      </div>

      {/* Botão para adicionar nova categoria */}
      <div className="flex justify-end">
        <Button onClick={novaCategoria}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      {/* Lista de categorias */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map((categoria) => (
          <Card key={categoria.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-lg">{categoria.nome}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">{categoria.produtos} produtos</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => editarCategoria(categoria)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulário de categoria */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{categoriaSelecionada ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome da categoria</Label>
              <Input id="nome" defaultValue={categoriaSelecionada?.nome || ""} placeholder="Ex: Lanches" />
            </div>
            <div className="grid gap-2">
              <Label>Imagem da categoria (opcional)</Label>
              <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed">
                <Plus className="mb-2 h-6 w-6 text-gray-400" />
                <p className="text-sm text-gray-500">Clique para adicionar uma imagem</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setDialogAberto(false)}>
              {categoriaSelecionada ? "Salvar alterações" : "Criar categoria"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
