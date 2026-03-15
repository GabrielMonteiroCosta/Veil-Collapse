import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  let payload: { id: number; username: string; email: string }
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as typeof payload
  } catch {
    return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })
  }

  let body: { type: string; value?: string; currentPassword?: string; newPassword?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }

  const conn = await pool.getConnection()
  try {
    if (body.type === 'email') {
      const email = body.value?.trim().toLowerCase()
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 })
      }

      const [existing] = await conn.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, payload.id]
      )
      if (existing.length > 0) {
        return NextResponse.json({ error: 'E-mail já está em uso' }, { status: 409 })
      }

      await conn.execute('UPDATE users SET email = ? WHERE id = ?', [email, payload.id])

      const newToken = jwt.sign(
        { id: payload.id, username: payload.username, email },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
      )

      const response = NextResponse.json({ success: true, email })
      response.cookies.set('auth_token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
      return response
    }

    if (body.type === 'password') {
      if (!body.currentPassword || !body.newPassword) {
        return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 })
      }
      if (body.newPassword.length < 6) {
        return NextResponse.json({ error: 'Nova senha deve ter ao menos 6 caracteres' }, { status: 400 })
      }

      const [rows] = await conn.execute<RowDataPacket[]>(
        'SELECT password_hash FROM users WHERE id = ?',
        [payload.id]
      )
      if (rows.length === 0) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

      const match = await bcrypt.compare(body.currentPassword, rows[0].password_hash)
      if (!match) return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 401 })

      const newHash = await bcrypt.hash(body.newPassword, 12)
      await conn.execute('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, payload.id])

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Tipo de atualização inválido' }, { status: 400 })
  } finally {
    conn.release()
  }
}
