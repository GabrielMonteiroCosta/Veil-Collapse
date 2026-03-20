import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import pool from '@/lib/db'

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

  const conn = await pool.getConnection()
  try {
    await conn.execute(
      `UPDATE notifications SET read_at = NOW() WHERE user_id = ? AND read_at IS NULL`,
      [user.id]
    )
    return NextResponse.json({ success: true })
  } finally {
    conn.release()
  }
}
