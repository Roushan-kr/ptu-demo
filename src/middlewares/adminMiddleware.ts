import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/admin/dashboard', '/admin/alumni', '/admin/events', '/admin/import']
const authRoutes = ['/admin/auth/login', '/admin/auth/register']

export const adminMiddlewareMatcher = [
  '/admin/dashboard/:path*',
  '/admin/alumni/:path*',
  '/admin/events/:path*',
  '/admin/import/:path*',
  '/admin/auth/login',
  '/admin/auth/register',
]

export function adminMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname === route)

  const accessToken = request.cookies.get('accessToken')?.value

  // If accessing protected route without token, redirect to login
  if (isProtected && !accessToken) {
    const url = new URL('/admin/auth/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // If already logged in and tries to go to login, redirect to dashboard
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}