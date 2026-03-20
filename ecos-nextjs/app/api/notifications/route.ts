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
  if (!user) return NextResponse.json({ notifications: [] })

  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT id, message_pt, message_en, read_at, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 30`,
      [user.id]
    )
    return NextResponse.json({ notifications: rows })
  } finally {
    conn.release()
  }
}
