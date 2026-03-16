import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import pool from '@/lib/db'

async function getAdmin(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return null
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as {
      id: number; is_admin: number
    }
    if (!payload.is_admin) return null
    return payload
  } catch {
    return null
  }
}

// GET — list all donations
export async function GET(req: NextRequest) {
  if (!await getAdmin(req))
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') // 'pending' | 'confirmed' | 'rejected' | null = all

  const conn = await pool.getConnection()
  try {
    const where = status ? 'WHERE status = ?' : ''
    const params = status ? [status] : []
    const [rows] = await conn.execute(
      `SELECT id, name, email, tier, amount, status,
              npc_name, npc_description, item_name, item_description,
              quest_name, quest_description, message, created_at
       FROM donations
       ${where}
       ORDER BY created_at DESC`,
      params
    )
    return NextResponse.json({ donations: rows })
  } finally {
    conn.release()
  }
}

// PATCH — update status
export async function PATCH(req: NextRequest) {
  if (!await getAdmin(req))
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id, status } = await req.json()
  if (!id || !['confirmed', 'rejected', 'pending'].includes(status))
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

  const conn = await pool.getConnection()
  try {
    await conn.execute('UPDATE donations SET status = ? WHERE id = ?', [status, id])
    return NextResponse.json({ success: true })
  } finally {
    conn.release()
  }
}
