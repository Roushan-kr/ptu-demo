import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { adminMiddleware } from '@/middlewares/adminMiddleware'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    return adminMiddleware(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/alumni/:path*',
    '/admin/events/:path*',
    '/admin/import/:path*',
    '/admin/auth/login',
    '/admin/auth/register',
  ],
}
