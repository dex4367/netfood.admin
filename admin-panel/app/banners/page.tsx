"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash, MoveUp, MoveDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// Dados de exemplo
const banners = [
  {
    id: 1,
    titulo: "Promoção de Lanches",
    imagem: "/placeholder.svg?height=200&width=600",
    ativo: true,
  },
  {
    id: 2,
    titulo: "Novos Sabores de Pizza",
    imagem: "/placeholder.svg?height=200&width=600",
    ativo: true,
  },
  {
    id: 3,
    titulo: "Combos para Família",
    imagem: "/placeholder.svg?height=200&width=600",
    ativo: false,
  },
]

export default function BannersPage() {
  const [bannerSelecionado, setBannerSelecionado] = useState<any>(null)
  const [dialogAberto, setDialogAberto] = useState(false)

  // Abrir formulário para editar banner
  const editarBanner = (banner: any) => {
    setBannerSelecionado(banner)
    setDialogAberto(true)
  }

  // Abrir formulário para novo banner
  const novoBanner = () => {
    setBannerSelecionado(null)
    setDialogAberto(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Banners</h1>
        <p className="text-gray-500">Gerencie os banners promocionais do seu cardápio.</p>
      </div>

      {/* Botão para adicionar novo banner */}
      <div className="flex justify-end">
        <Button onClick={novoBanner}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Banner
        </Button>
      </div>

      {/* Lista de banners */}
      <div className="space-y-4">
        {banners.map((banner, index) => (
          <Card key={banner.id} className={`overflow-hidden ${!banner.ativo ? "opacity-60" : ""}`}>
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={banner.imagem || "/placeholder.svg"}
                  alt={banner.titulo}
                  className="h-[150px] w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                  <Button variant="secondary" size="sm" onClick={() => editarBanner(banner)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-medium">{banner.titulo}</h3>
                  <div className="flex items-center gap-2">
                    <Switch checked={banner.ativo} />
                    <Label className="text-sm">Ativo</Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  {index > 0 && (
                    <Button size="sm" variant="ghost">
                      <MoveUp className="h-4 w-4" />
                    </Button>
                  )}
                  {index < banners.length - 1 && (
                    <Button size="sm" variant="ghost">
                      <MoveDown className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulário de banner */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{bannerSelecionado ? "Editar Banner" : "Novo Banner"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="titulo">Título do banner</Label>
              <Input id="titulo" defaultValue={bannerSelecionado?.titulo || ""} placeholder="Ex: Promoção de Lanches" />
            </div>
            <div className="grid gap-2">
              <Label>Imagem do banner</Label>
              {bannerSelecionado?.imagem ? (
                <div className="relative">
                  <img
                    src={bannerSelecionado.imagem || "/placeholder.svg"}
                    alt={bannerSelecionado.titulo}
                    className="h-[150px] w-full rounded-md object-cover"
                  />
                  <Button variant="destructive" size="sm" className="absolute right-2 top-2">
                    Remover
                  </Button>
                </div>
              ) : (
                <div className="flex h-[150px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed">
                  <Plus className="mb-2 h-6 w-6 text-gray-400" />
                  <p className="text-sm text-gray-500">Clique para adicionar uma imagem</p>
                  <p className="text-xs text-gray-400">Tamanho recomendado: 1200x400 pixels</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch defaultChecked={bannerSelecionado?.ativo || true} />
              <Label>Banner ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setDialogAberto(false)}>
              {bannerSelecionado ? "Salvar alterações" : "Criar banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
