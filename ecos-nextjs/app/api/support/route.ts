import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  let body: {
    name?: string
    email?: string
    tier?: string
    amount?: number
    npcOrItem?: string
    npcName?: string
    npcDescription?: string
    itemName?: string
    itemDescription?: string
    questName?: string
    questDescription?: string
    message?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }

  const { name, email, tier } = body

  if (!name?.trim() || !email?.trim() || !tier) {
    return NextResponse.json({ error: 'Nome, e-mail e tier são obrigatórios' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 })
  }

  if (!['apoiador', 'criador', 'lenda'].includes(tier)) {
    return NextResponse.json({ error: 'Tier inválido' }, { status: 400 })
  }

  const conn = await pool.getConnection()
  try {
    await conn.execute(
      `INSERT INTO donations
        (name, email, tier, amount, npc_name, npc_description, item_name, item_description, quest_name, quest_description, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        tier,
        body.amount ?? null,
        body.npcOrItem ?? body.npcName ?? null,
        body.npcDescription ?? null,
        body.itemName ?? null,
        body.itemDescription ?? null,
        body.questName ?? null,
        body.questDescription ?? null,
        body.message ?? null,
      ]
    )

    return NextResponse.json({ success: true })
  } finally {
    conn.release()
  }
}
