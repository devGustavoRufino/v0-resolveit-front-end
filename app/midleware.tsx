import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Pega o cookie de sessão (o nome deve ser o mesmo que sua API Python define)
  const session = request.cookies.get('session_id') // Ajuste 'session_id' para o nome exato do seu cookie

  // Se não estiver logado e tentar acessar o dashboard, manda pro login
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se já estiver logado e tentar acessar o login, manda pro dashboard
  if (session && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Define em quais rotas o middleware deve rodar
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}