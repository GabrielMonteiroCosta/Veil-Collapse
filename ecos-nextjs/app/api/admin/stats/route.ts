import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import db from '@/lib/db'
import fs from 'fs'
import path from 'path'

function getUser(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: number; is_admin: number }
  } catch { return null }
}

export async function GET(req: NextRequest) {
  const user = getUser(req)
  if (!user?.is_admin) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const [usersRow] = await db('SELECT COUNT(*) as count FROM users')
  const [donationsRow] = await db(
    `SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
      SUM(CASE WHEN status = 'pending'   THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'rejected'  THEN 1 ELSE 0 END) as rejected,
      COALESCE(SUM(CASE WHEN status = 'confirmed' THEN amount ELSE 0 END), 0) as total_raised
     FROM donations`
  )

  let waitlist = 0
  try {
    const wlPath = path.join(process.cwd(), 'data', 'waitlist.json')
    const wlData = JSON.parse(fs.readFileSync(wlPath, 'utf-8'))
    // O arquivo salvo pela rota /api/waitlist é um objeto { emails, count }, não uma lista
    waitlist = Array.isArray(wlData) ? wlData.length : (wlData.count ?? wlData.emails?.length ?? 0)
  } catch { /* file may not exist */ }

  return NextResponse.json({
    users: usersRow.count,
    donations: donationsRow,
    waitlist,
  })
}
