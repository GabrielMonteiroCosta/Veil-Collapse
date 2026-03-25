import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import db from '@/lib/db'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return NextResponse.json({ user: null }, { status: 401 })

  let payload: { id: number; username: string; email: string; is_admin: number }
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as typeof payload
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  // Base user from JWT — always valid
  const base = {
    id: payload.id,
    username: payload.username,
    email: payload.email,
    is_admin: payload.is_admin,
    created_at: null as string | null,
    avatar: null as string | null,
  }

  // Try to fetch extra fields — gracefully skip if columns don't exist yet
  try {
    const rows = await db('SELECT created_at, avatar FROM users WHERE id = $1', [payload.id])
    if (rows[0]) {
      base.created_at = rows[0].created_at ?? null
      base.avatar = rows[0].avatar ?? null
    }
  } catch { /* columns may not exist yet — return base user */ }

  return NextResponse.json({ user: base })
}
