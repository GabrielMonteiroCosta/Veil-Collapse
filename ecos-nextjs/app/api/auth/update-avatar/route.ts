import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import pool from '@/lib/db'

const VALID_AVATARS = ['⚔️', '🌟', '🌙', '⚓', '⚙️', '🔬', '👑', '🌿', '🥊', '📖', '🗡️', '🔮', '🛡️', '⚡']

function getUser(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: number }
  } catch { return null }
}

export async function POST(req: NextRequest) {
  const user = getUser(req)
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  let body: { avatar?: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }

  const avatar = body.avatar ?? null
  if (avatar !== null && !VALID_AVATARS.includes(avatar)) {
    return NextResponse.json({ error: 'Avatar inválido' }, { status: 400 })
  }

  const conn = await pool.getConnection()
  try {
    await conn.execute('UPDATE users SET avatar = ? WHERE id = ?', [avatar, user.id])
    return NextResponse.json({ success: true, avatar })
  } finally {
    conn.release()
  }
}
