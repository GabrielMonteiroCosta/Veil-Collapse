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

export async function POST(req: NextRequest) {
  const user = getUser(req)
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  await db(
    `UPDATE notifications SET read_at = NOW() WHERE user_id = $1 AND read_at IS NULL`,
    [user.id]
  )
  return NextResponse.json({ success: true })
}
