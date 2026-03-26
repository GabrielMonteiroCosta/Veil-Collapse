import { NextResponse } from 'next/server'
import db from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const rows = await db(
    `SELECT name, tier, amount, created_at
     FROM donations
     WHERE status = 'confirmed'
     ORDER BY
       CASE
         WHEN tier IN ('lenda', 'rifter')      THEN 1
         WHEN tier IN ('criador', 'sentinela') THEN 2
         WHEN tier IN ('apoiador', 'pesquisador') THEN 3
         ELSE 4
       END,
       amount DESC NULLS LAST,
       created_at ASC
     LIMIT 10`
  )

  const supporters = rows.map((r, i) => ({
    rank:       i + 1,
    name:       r.name,
    tier:       r.tier as string,
    amount:     r.amount as number | null,
    created_at: r.created_at,
  }))

  return NextResponse.json({ supporters })
}
