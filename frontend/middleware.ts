// middleware.ts (di root project)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export const config = {
  matcher: ['/admin-page/:path*'],
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('refresh_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { role } = jwt.verify(token, process.env.JWT_SECRET!) as { role: string }
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}
