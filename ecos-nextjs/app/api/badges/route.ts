import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'

function getUser(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: number }
  } catch { return null }
}

export async function GET(req: NextRequest) {
  const user = getUser(req)
  if (!user) return NextResponse.json({ badges: [] })

  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT badge_id, awarded_at FROM user_badges WHERE user_id = ? ORDER BY awarded_at ASC',
      [user.id]
    )
    return NextResponse.json({ badges: rows })
  } catch {
    // table may not exist yet
    return NextResponse.json({ badges: [] })
  } finally {
    conn.release()
  }
}
