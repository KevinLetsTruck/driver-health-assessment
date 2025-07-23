import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // List of protected routes
  const protectedRoutes = ['/dashboard', '/admin']
  const authRoutes = ['/login', '/signup']
  const pathname = req.nextUrl.pathname

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Redirect if not authenticated and trying to access protected route
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect if authenticated and trying to access auth routes
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

// Configure which routes use this middleware
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup']
} 