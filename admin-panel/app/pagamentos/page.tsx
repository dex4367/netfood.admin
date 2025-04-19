"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Banknote, QrCode, Wallet } from "lucide-react"

// Dados de exemplo
const metodosPagamento = {
  cartoes: [
    { id: 1, nome: "Visa", ativo: true },
    { id: 2, nome: "Mastercard", ativo: true },
    { id: 3, nome: "American Express", ativo: false },
    { id: 4, nome: "Elo", ativo: true },
  ],
  outros: [
    { id: 5, nome: "PIX", ativo: true },
    { id: 6, nome: "Dinheiro", ativo: true },
    { id: 7, nome: "Vale Refeição", ativo: false },
  ],
}

export default function PagamentosPage() {
  const [abaSelecionada, setAbaSelecionada] = useState("cartoes")
  const [metodos, setMetodos] = useState(metodosPagamento)

  // Alternar status de um método de pagamento
  const alternarStatus = (tipo: "cartoes" | "outros", id: number) => {
    setMetodos((prev) => ({
      ...prev,
      [tipo]: prev[tipo].map((metodo) => (metodo.id === id ? { ...metodo, ativo: !metodo.ativo } : metodo)),
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Métodos de Pagamento</h1>
        <p className="text-gray-500">Configure os métodos de pagamento aceitos.</p>
      </div>

      <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cartoes">Cartões</TabsTrigger>
          <TabsTrigger value="outros">Outros Métodos</TabsTrigger>
        </TabsList>

        <TabsContent value="cartoes" className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {metodos.cartoes.map((metodo) => (
              <Card key={metodo.id} className={!metodo.ativo ? "opacity-60" : ""}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                    <h3 className="font-medium">{metodo.nome}</h3>
                  </div>
                  <Switch checked={metodo.ativo} onCheckedChange={() => alternarStatus("cartoes", metodo.id)} />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de Cartão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="taxa">Taxa de cartão (%)</Label>
                <Input id="taxa" defaultValue="2.5" />
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Label>Permitir parcelamento</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parcelas">Número máximo de parcelas</Label>
                <Input id="parcelas" type="number" defaultValue="3" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outros" className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {metodos.outros.map((metodo) => (
              <Card key={metodo.id} className={!metodo.ativo ? "opacity-60" : ""}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {metodo.nome === "PIX" ? (
                      <QrCode className="h-8 w-8 text-green-600" />
                    ) : metodo.nome === "Dinheiro" ? (
                      <Banknote className="h-8 w-8 text-green-600" />
                    ) : (
                      <Wallet className="h-8 w-8 text-orange-600" />
                    )}
                    <h3 className="font-medium">{metodo.nome}</h3>
                  </div>
                  <Switch checked={metodo.ativo} onCheckedChange={() => alternarStatus("outros", metodo.id)} />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de PIX</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="chave">Chave PIX</Label>
                <Input id="chave" placeholder="CPF, CNPJ, E-mail ou Telefone" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome do beneficiário</Label>
                <Input id="nome" placeholder="Nome que aparecerá no pagamento" />
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Label>Gerar QR Code automaticamente</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button>Salvar configurações</Button>
      </div>
    </div>
  )
}
