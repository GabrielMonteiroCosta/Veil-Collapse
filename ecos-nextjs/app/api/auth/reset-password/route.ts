import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import pool from '@/lib/db'
import { validatePassword } from '@/lib/validators'

export async function POST(req: NextRequest) {
  let body: { token?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }

  const { token, password } = body

  if (!token || !password) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const passwordErr = validatePassword(password)
  if (passwordErr) return NextResponse.json({ error: passwordErr }, { status: 400 })

  let payload: { email: string; purpose: string }
  try {
    payload = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as { email: string; purpose: string }
  } catch {
    return NextResponse.json({ error: 'Link inválido ou expirado' }, { status: 400 })
  }

  if (payload.purpose !== 'reset') {
    return NextResponse.json({ error: 'Token inválido' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 12)
  const conn = await pool.getConnection()
  try {
    await conn.execute(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [hash, payload.email]
    )
  } finally {
    conn.release()
  }

  return NextResponse.json({ success: true })
}
