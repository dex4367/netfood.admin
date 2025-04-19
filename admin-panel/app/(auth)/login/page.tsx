"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fazerLogin, verificarSessao } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [verificandoSessao, setVerificandoSessao] = useState(true)
  const router = useRouter()

  // Verificar se o usuário já está logado
  useEffect(() => {
    async function checarSessao() {
      try {
        const session = await verificarSessao()
        if (session) {
          // Se já estiver logado, redirecionar para o dashboard
          router.push("/")
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error)
      } finally {
        setVerificandoSessao(false)
      }
    }

    checarSessao()
  }, [router])

  // Função para fazer login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !senha) {
      toast.error("Preencha todos os campos")
      return
    }
    
    try {
      setCarregando(true)
      await fazerLogin(email, senha)
      toast.success("Login realizado com sucesso!")
      
      // Redirecionar para o dashboard
      router.push("/")
    } catch (error: any) {
      console.error("Erro ao fazer login:", error)
      
      // Mensagens de erro personalizadas
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Email ou senha incorretos")
      } else {
        toast.error("Erro ao fazer login. Tente novamente.")
      }
    } finally {
      setCarregando(false)
    }
  }

  // Exibir spinner enquanto verifica a sessão
  if (verificandoSessao) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-primary/20 to-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-gray-500">Faça login para acessar o sistema</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input 
                id="senha" 
                type="password" 
                placeholder="••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
} 