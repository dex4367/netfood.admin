import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Verificar se o usuário está autenticado
  const { data: { session } } = await supabase.auth.getSession()
  const path = req.nextUrl.pathname

  // Rotas que não exigem autenticação
  const publicRoutes = ['/login']
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

  // Redirecionar para login se não estiver autenticado e acessar rota protegida
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirecionar para dashboard se já estiver autenticado e acessar rota pública
  if (session && isPublicRoute) {
    const redirectUrl = new URL('/', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Configurar quais rotas devem passar pelo middleware
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 