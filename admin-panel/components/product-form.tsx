"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const categories = [
  { id: 1, name: "Lanches" },
  { id: 2, name: "Pizzas" },
  { id: 3, name: "Sobremesas" },
  { id: 4, name: "Bebidas" },
  { id: 5, name: "Combos" },
]

const complements = [
  { id: 1, name: "Molhos", price: "R$ 2,00" },
  { id: 2, name: "Queijos", price: "R$ 3,00" },
  { id: 3, name: "Coberturas", price: "R$ 4,00" },
  { id: 4, name: "Adicionais", price: "R$ 5,00" },
  { id: 5, name: "Bebidas", price: "R$ 6,00" },
]

interface ProductFormProps {
  product: any
  onClose: () => void
  onSave: (product: any) => void
}

export function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  const { toast } = useToast()
  const isMobile = useMobile()
  const [formData, setFormData] = useState({
    id: product?.id || null,
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.replace("R$ ", "") || "",
    category: product?.category || "",
    prepTime: product?.prepTime?.replace(" min", "") || "",
    available: product?.available ?? true,
    featured: product?.featured ?? false,
    image: product?.image || null,
    selectedComplements: product?.selectedComplements || ([] as number[]),
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    // Implementação real usaria FileReader para preview
    setFormData((prev) => ({ ...prev, image: "/placeholder.svg?height=200&width=200" }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implementação real usaria FileReader para preview
    setFormData((prev) => ({ ...prev, image: "/placeholder.svg?height=200&width=200" }))
  }

  const toggleComplement = (id: number) => {
    setFormData((prev) => {
      const selectedComplements = [...prev.selectedComplements]
      if (selectedComplements.includes(id)) {
        return {
          ...prev,
          selectedComplements: selectedComplements.filter((item) => item !== id),
        }
      } else {
        return {
          ...prev,
          selectedComplements: [...selectedComplements, id],
        }
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    // Formatar dados para salvar
    const productData = {
      ...formData,
      price: `R$ ${formData.price}`,
      prepTime: `${formData.prepTime} min`,
    }

    onSave(productData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Informações Básicas</TabsTrigger>
          <TabsTrigger value="complements">Complementos</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nome do Produto <span className="text-red-500">*</span>
              </Label>
              <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">
                Preço (R$) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">
                Categoria <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prepTime">Tempo de Preparo (min)</Label>
              <Input
                id="prepTime"
                type="number"
                value={formData.prepTime}
                onChange={(e) => handleChange("prepTime", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => handleChange("available", checked)}
              />
              <Label htmlFor="available">Disponível</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleChange("featured", checked)}
              />
              <Label htmlFor="featured">Destaque</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Imagem do Produto</Label>
            <div
              className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleImageDrop}
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              {formData.image ? (
                <div className="relative h-full w-full">
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-0 top-0 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFormData((prev) => ({ ...prev, image: null }))
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Arraste uma imagem ou clique para fazer upload</p>
                </>
              )}
              <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="complements" className="space-y-4 py-4">
          <div className="space-y-4">
            <Label>Complementos Disponíveis</Label>
            <div className="space-y-2">
              {complements.map((complement) => (
                <div key={complement.id} className="flex items-center justify-between space-x-2 rounded-md border p-3">
                  <div className="flex flex-1 items-center space-x-2">
                    <Switch
                      id={`complement-${complement.id}`}
                      checked={formData.selectedComplements.includes(complement.id)}
                      onCheckedChange={() => toggleComplement(complement.id)}
                    />
                    <Label htmlFor={`complement-${complement.id}`} className="flex-1">
                      {complement.name}
                    </Label>
                  </div>
                  <span className="text-sm text-muted-foreground">{complement.price}</span>
                </div>
              ))}
            </div>

            {formData.selectedComplements.length > 0 && (
              <div className="mt-4">
                <Label>Complementos selecionados:</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.selectedComplements.map((id) => {
                    const complement = complements.find((c) => c.id === id)
                    return complement ? (
                      <Badge key={id} variant="secondary" className="flex items-center gap-1">
                        {complement.name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0"
                          onClick={() => toggleComplement(id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">{product ? "Salvar Alterações" : "Criar Produto"}</Button>
      </DialogFooter>
    </form>
  )
}
