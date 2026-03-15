import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return NextResponse.json({ user: null }, { status: 401 })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as {
      id: number; username: string; email: string; is_admin: number
    }
    return NextResponse.json({ user: { id: payload.id, username: payload.username, email: payload.email, is_admin: payload.is_admin } })
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
