"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ColorPicker } from "@/components/color-picker"
import { BusinessHours } from "@/components/business-hours"

export default function SettingsPage() {
  const { toast } = useToast()
  const [storeData, setStoreData] = useState({
    name: "Meu Cardápio Digital",
    description: "Restaurante especializado em comida caseira com o melhor sabor da cidade.",
    logo: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=200&width=400",
    primaryColor: "#FF5722",
    secondaryColor: "#2196F3",
    address: "Rua Exemplo, 123 - Centro",
    cnpj: "12.345.678/0001-90",
    phone: "(11) 98765-4321",
    email: "contato@meucardapio.com",
  })

  const handleChange = (field: string, value: any) => {
    setStoreData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (field: string) => {
    // Implementação real usaria FileReader para preview
    const imagePath =
      field === "logo" ? "/placeholder.svg?height=100&width=100" : "/placeholder.svg?height=200&width=400"

    setStoreData((prev) => ({ ...prev, [field]: imagePath }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Configurações salvas",
      description: "As configurações da loja foram atualizadas com sucesso.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua loja e personalize seu cardápio digital.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="business">Funcionamento</TabsTrigger>
            <TabsTrigger value="payment">Pagamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Loja</CardTitle>
                <CardDescription>Configure as informações básicas da sua loja.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Loja</Label>
                    <Input id="name" value={storeData.name} onChange={(e) => handleChange("name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" value={storeData.cnpj} onChange={(e) => handleChange("cnpj", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={storeData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" value={storeData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={storeData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={storeData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Identidade Visual</CardTitle>
                <CardDescription>Personalize a aparência do seu cardápio digital.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="flex flex-col items-center justify-center gap-4 rounded-md border p-4">
                      {storeData.logo && (
                        <img
                          src={storeData.logo || "/placeholder.svg"}
                          alt="Logo"
                          className="h-24 w-24 object-contain"
                        />
                      )}
                      <Button type="button" variant="outline" onClick={() => handleImageChange("logo")}>
                        <Upload className="mr-2 h-4 w-4" />
                        Alterar Logo
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Imagem de Capa</Label>
                    <div className="flex flex-col items-center justify-center gap-4 rounded-md border p-4">
                      {storeData.coverImage && (
                        <img
                          src={storeData.coverImage || "/placeholder.svg"}
                          alt="Capa"
                          className="h-24 w-full object-cover"
                        />
                      )}
                      <Button type="button" variant="outline" onClick={() => handleImageChange("coverImage")}>
                        <Upload className="mr-2 h-4 w-4" />
                        Alterar Capa
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Cores do Tema</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Cor Primária</Label>
                      <ColorPicker
                        color={storeData.primaryColor}
                        onChange={(color) => handleChange("primaryColor", color)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cor Secundária</Label>
                      <ColorPicker
                        color={storeData.secondaryColor}
                        onChange={(color) => handleChange("secondaryColor", color)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Horário de Funcionamento</CardTitle>
                <CardDescription>Configure os dias e horários em que sua loja estará aberta.</CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessHours />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
                <CardDescription>Configure os métodos de pagamento aceitos pela sua loja.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Cartões</h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="visa" defaultChecked />
                      <Label htmlFor="visa">Visa</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="mastercard" defaultChecked />
                      <Label htmlFor="mastercard">Mastercard</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="amex" />
                      <Label htmlFor="amex">American Express</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="elo" defaultChecked />
                      <Label htmlFor="elo">Elo</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Outros Métodos</h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                      <Switch id="pix" defaultChecked />
                      <Label htmlFor="pix">PIX</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="cash" defaultChecked />
                      <Label htmlFor="cash">Dinheiro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="wallet" />
                      <Label htmlFor="wallet">Carteira Digital</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit">Salvar Configurações</Button>
        </div>
      </form>
    </div>
  )
}
