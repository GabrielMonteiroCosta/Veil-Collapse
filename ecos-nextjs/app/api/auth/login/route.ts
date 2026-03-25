import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '@/lib/db'
import { rateLimit } from '@/lib/rateLimit'

// 10 tentativas de login por IP a cada 15 minutos
const limiter = rateLimit({ uniqueTokenPerInterval: 500, interval: 15 * 60_000 })

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { success } = limiter.check(10, ip)
  if (!success) {
    return NextResponse.json(
      { error: 'Muitas tentativas de login. Aguarde 15 minutos.' },
      { status: 429 }
    )
  }

  let body: { email?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  const password = body.password

  if (!email || !password) {
    return NextResponse.json({ error: 'E-mail e senha são obrigatórios' }, { status: 400 })
  }

  const rows = await db(
    'SELECT id, username, email, password_hash, is_admin, avatar, created_at FROM users WHERE email = $1',
    [email]
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 })
  }

  const user = rows[0]
  const passwordMatch = await bcrypt.compare(password, user.password_hash)

  if (!passwordMatch) {
    return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 })
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email, is_admin: user.is_admin },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '7d' }
  )

  const response = NextResponse.json({
    success: true,
    user: { id: user.id, username: user.username, email: user.email, is_admin: user.is_admin, avatar: user.avatar ?? null, created_at: user.created_at ?? null },
  })

  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  })

  return response
}
