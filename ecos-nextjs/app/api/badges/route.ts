import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '@/lib/jwtSecret'
import db from '@/lib/db'

function getUser(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, jwtSecret()) as { id: number }
  } catch { return null }
}

export async function GET(req: NextRequest) {
  const user = getUser(req)
  if (!user) return NextResponse.json({ badges: [] })

  try {
    const rows = await db(
      'SELECT badge_id, awarded_at FROM user_badges WHERE user_id = $1 ORDER BY awarded_at ASC',
      [user.id]
    )
    return NextResponse.json({ badges: rows })
  } catch {
    // table may not exist yet
    return NextResponse.json({ badges: [] })
  }
}
