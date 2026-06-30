import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken } from '@/lib/auth/jwt'

//Add all protected admin page routes here
const protectedRoutes = [
  '/admin/dashboard',
  '/admin/alumni',
  '/admin/events',
  '/admin/import',
  '/admin/requests',
  '/admin/yearbook',
  '/admin/jobs',    
  '/admin/startups',
]

const authRoutes = ['/admin/auth/login', '/admin/auth/register']

export function adminMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname === route)

  const accessToken = request.cookies.get('accessToken')?.value

  const redirectToLogin = () => {
    const url = new URL('/admin/auth/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  if (isProtected) {
    if (!accessToken) {
      return redirectToLogin()
    }
    try {
      verifyAccessToken(accessToken) // throws if invalid
    } catch {
      return redirectToLogin()
    }
    return NextResponse.next()
  }

  if (isAuthRoute && accessToken) {
    try {
      verifyAccessToken(accessToken)
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } catch {
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}