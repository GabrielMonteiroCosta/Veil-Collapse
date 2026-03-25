import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import db from '@/lib/db'

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

  await db('UPDATE users SET avatar = $1 WHERE id = $2', [avatar, user.id])
  return NextResponse.json({ success: true, avatar })
}
