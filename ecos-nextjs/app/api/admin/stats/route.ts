import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '@/lib/jwtSecret'
import db from '@/lib/db'

function getUser(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, jwtSecret()) as { id: number; is_admin: number }
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
    const [{ count }] = await db('SELECT COUNT(*) AS count FROM waitlist')
    waitlist = Number(count)
  } catch { /* tabela waitlist ainda não criada (database/migrate_v6.sql) */ }

  return NextResponse.json({
    users: usersRow.count,
    donations: donationsRow,
    waitlist,
  })
}
