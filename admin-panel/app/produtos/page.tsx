"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit, Trash, Eye, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { getProdutos, getCategorias, saveProduto, deleteProduto } from "@/lib/supabase"
import { Textarea } from "@/components/ui/textarea"

// Tipo de produto
interface Produto {
  id: string
  nome: string
  descricao?: string
  categoria: string
  preco: number
  preco_formatado?: string
  disponivel: boolean
  imagem?: string
  destaque?: boolean
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [busca, setBusca] = useState("")
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [visualizacao, setVisualizacao] = useState("cards")
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [excluindo, setExcluindo] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<Partial<Produto>>({
    nome: '',
    descricao: '',
    categoria: '',
    preco: 0,
    disponivel: true,
    destaque: false
  })

  // Buscar produtos e categorias
  useEffect(() => {
    const fetchData = async () => {
      try {
        setCarregando(true)
        const produtosData = await getProdutos()
        const categoriasData = await getCategorias()
        
        // Formatar preços para exibição
        const produtosFormatados = produtosData.map((produto: Produto) => ({
          ...produto,
          preco_formatado: `R$ ${produto.preco.toFixed(2).replace('.', ',')}`
        }))
        
        setProdutos(produtosFormatados)
        setCategorias(categoriasData.map((cat: any) => cat.nome))
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast.error("Erro ao carregar dados")
      } finally {
        setCarregando(false)
      }
    }
    
    fetchData()
  }, [])

  // Filtrar produtos com base na busca
  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.categoria.toLowerCase().includes(busca.toLowerCase()),
  )

  // Abrir formulário para editar produto
  const editarProduto = (produto: Produto) => {
    setProdutoSelecionado(produto)
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao || '',
      categoria: produto.categoria,
      preco: produto.preco,
      disponivel: produto.disponivel,
      destaque: produto.destaque || false,
      imagem: produto.imagem
    })
    setDialogAberto(true)
  }

  // Abrir formulário para novo produto
  const novoProduto = () => {
    setProdutoSelecionado(null)
    setFormData({
      nome: '',
      descricao: '',
      categoria: categorias.length > 0 ? categorias[0] : '',
      preco: 0,
      disponivel: true,
      destaque: false
    })
    setDialogAberto(true)
  }
  
  // Atualizar formulário
  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }
  
  // Salvar produto
  const handleSave = async () => {
    try {
      setSalvando(true)
      
      // Validar campos obrigatórios
      if (!formData.nome || !formData.categoria || formData.preco === undefined) {
        toast.error("Preencha todos os campos obrigatórios")
        return
      }
      
      const produtoData = {
        ...formData,
        id: produtoSelecionado?.id
      }
      
      await saveProduto(produtoData)
      toast.success(produtoSelecionado ? "Produto atualizado com sucesso" : "Produto criado com sucesso")
      
      // Atualizar lista de produtos
      const produtosAtualizados = await getProdutos()
      const produtosFormatados = produtosAtualizados.map((produto: Produto) => ({
        ...produto,
        preco_formatado: `R$ ${produto.preco.toFixed(2).replace('.', ',')}`
      }))
      
      setProdutos(produtosFormatados)
      setDialogAberto(false)
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      toast.error("Erro ao salvar produto")
    } finally {
      setSalvando(false)
    }
  }
  
  // Excluir produto
  const handleDelete = async (id: string) => {
    try {
      setExcluindo(id)
      await deleteProduto(id)
      toast.success("Produto excluído com sucesso")
      
      // Atualizar lista de produtos
      setProdutos(produtos.filter(produto => produto.id !== id))
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
      toast.error("Erro ao excluir produto")
    } finally {
      setExcluindo(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <p className="text-gray-500">Gerencie os produtos do seu cardápio.</p>
      </div>

      {/* Barra de ferramentas */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar produtos..."
            className="pl-8"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Tabs value={visualizacao} onValueChange={setVisualizacao} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="lista">Lista</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={novoProduto}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Estado de carregamento */}
      {carregando && (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-gray-500">Carregando produtos...</p>
        </div>
      )}

      {/* Mensagem quando não há produtos */}
      {!carregando && produtosFiltrados.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <div className="text-gray-500">Nenhum produto encontrado</div>
          <Button variant="outline" className="mt-4" onClick={() => setBusca("")}>
            Limpar busca
          </Button>
        </div>
      )}

      {/* Visualização em cards */}
      {!carregando && visualizacao === "cards" && produtosFiltrados.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {produtosFiltrados.map((produto) => (
            <Card key={produto.id} className="overflow-hidden">
              <div className="aspect-video relative bg-gray-100">
                <img
                  src={produto.imagem || "/placeholder.svg"}
                  alt={produto.nome}
                  className="h-full w-full object-cover"
                />
                <Badge
                  className={`absolute right-2 top-2 ${
                    produto.disponivel ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {produto.disponivel ? "Disponível" : "Indisponível"}
                </Badge>
                {produto.destaque && (
                  <Badge className="absolute left-2 top-2 bg-yellow-100 text-yellow-800">
                    Destaque
                  </Badge>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{produto.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{produto.categoria}</p>
                    <p className="font-medium">{produto.preco_formatado}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => editarProduto(produto)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDelete(produto.id)}
                      disabled={excluindo === produto.id}
                    >
                      {excluindo === produto.id ? 
                        <Loader2 className="h-4 w-4 animate-spin" /> : 
                        <Trash className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Visualização em lista */}
      {!carregando && visualizacao === "lista" && produtosFiltrados.length > 0 && (
        <div className="space-y-2">
          {produtosFiltrados.map((produto) => (
            <div key={produto.id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <img
                  src={produto.imagem || "/placeholder.svg"}
                  alt={produto.nome}
                  className="h-12 w-12 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-medium">{produto.nome}</h3>
                  <div className="flex gap-2">
                    <p className="text-sm text-gray-500">{produto.categoria}</p>
                    {produto.destaque && (
                      <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                        Destaque
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-medium">{produto.preco_formatado}</p>
                <Switch checked={produto.disponivel} disabled />
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => editarProduto(produto)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDelete(produto.id)}
                    disabled={excluindo === produto.id}
                  >
                    {excluindo === produto.id ? 
                      <Loader2 className="h-4 w-4 animate-spin" /> : 
                      <Trash className="h-4 w-4" />
                    }
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulário de produto */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{produtoSelecionado ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome do produto *</Label>
              <Input 
                id="nome" 
                value={formData.nome} 
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Ex: X-Tudo" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select 
                  value={formData.categoria} 
                  onValueChange={(value) => handleChange('categoria', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="preco">Preço *</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => handleChange('preco', parseFloat(e.target.value))}
                  placeholder="Ex: 30.00"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea 
                id="descricao" 
                value={formData.descricao} 
                onChange={(e) => handleChange('descricao', e.target.value)}
                placeholder="Descreva o produto" 
                rows={3}
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={formData.disponivel} 
                  onCheckedChange={(checked) => handleChange('disponivel', checked)} 
                />
                <Label>Disponível para venda</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={formData.destaque} 
                  onCheckedChange={(checked) => handleChange('destaque', checked)} 
                />
                <Label>Produto em destaque</Label>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Imagem do produto</Label>
              <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed">
                <Plus className="mb-2 h-6 w-6 text-gray-400" />
                <p className="text-sm text-gray-500">Clique para adicionar uma imagem</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogAberto(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={salvando}
            >
              {salvando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
