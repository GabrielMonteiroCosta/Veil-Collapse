import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { rateLimit } from '@/lib/rateLimit'

// 3 submissões por IP a cada 10 minutos
const limiter = rateLimit({ uniqueTokenPerInterval: 500, interval: 10 * 60_000 })

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { success } = limiter.check(3, ip)
  if (!success) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.' },
      { status: 429 }
    )
  }

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

  if (!['viajante', 'pesquisador', 'sentinela', 'rifter'].includes(tier)) {
    return NextResponse.json({ error: 'Tier inválido' }, { status: 400 })
  }

  await db(
    `INSERT INTO donations
      (name, email, tier, amount, npc_name, npc_description, item_name, item_description, quest_name, quest_description, message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
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
}
