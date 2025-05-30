import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Verificamos o cookie de sessão diretamente
  const hasSession = req.cookies.has('sb-access-token') || req.cookies.has('sb-refresh-token');
  const path = req.nextUrl.pathname;
  
  // Rotas administrativas que exigem autenticação
  const protectedRoutes = ['/admin'];
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  
  // Se for rota protegida e usuário não estiver autenticado, redirecionar para login
  if (isProtectedRoute && !hasSession) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

// Configurar quais rotas devem passar pelo middleware
export const config = {
  matcher: ['/admin/:path*'],
};
