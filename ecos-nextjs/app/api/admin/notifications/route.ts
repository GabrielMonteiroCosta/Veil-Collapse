import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'

function getUser(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: number; is_admin: number }
  } catch { return null }
}

export async function POST(req: NextRequest) {
  const user = getUser(req)
  if (!user?.is_admin) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  let body: { message_pt?: string; message_en?: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }

  const message_pt = body.message_pt?.trim()
  const message_en = body.message_en?.trim()
  if (!message_pt || !message_en) {
    return NextResponse.json({ error: 'Mensagem em PT e EN são obrigatórias' }, { status: 400 })
  }

  const conn = await pool.getConnection()
  try {
    const [users] = await conn.execute<RowDataPacket[]>('SELECT id FROM users')
    for (const u of users) {
      await conn.execute(
        'INSERT INTO notifications (user_id, message_pt, message_en) VALUES (?, ?, ?)',
        [u.id, message_pt, message_en]
      )
    }
    return NextResponse.json({ success: true, count: users.length })
  } finally {
    conn.release()
  }
}
