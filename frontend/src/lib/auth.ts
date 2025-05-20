// lib/auth.ts
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export function requireAdmin() {
  const cookieStore = cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) throw new Error('NO_TOKEN')
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as { role: string }
  if (payload.role !== 'ADMIN') throw new Error('NOT_ADMIN')
  return payload
}

export function notAdmin() {
  const cookieStore = cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) throw new Error('NO_TOKEN')
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as { role: string }
  if (payload.role === 'ADMIN') throw new Error('ADMIN')
  return payload
}