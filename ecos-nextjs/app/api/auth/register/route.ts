import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function POST(req: NextRequest) {
  let body: { username?: string; email?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }

  const username = body.username?.trim()
  const email = body.email?.trim().toLowerCase()
  const password = body.password

  if (!username || username.length < 3) {
    return NextResponse.json({ error: 'Nome de usuário deve ter ao menos 3 caracteres' }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 })
  }

  if (!password || password.length < 6) {
    return NextResponse.json({ error: 'Senha deve ter ao menos 6 caracteres' }, { status: 400 })
  }

  const conn = await pool.getConnection()
  try {
    const [existing] = await conn.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    )

    if (existing.length > 0) {
      return NextResponse.json({ error: 'E-mail ou nome de usuário já cadastrado' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await conn.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    )

    return NextResponse.json({ success: true, message: 'Conta criada com sucesso!' })
  } finally {
    conn.release()
  }
}
