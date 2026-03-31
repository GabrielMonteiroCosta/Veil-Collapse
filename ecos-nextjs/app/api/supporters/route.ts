import { NextResponse } from 'next/server'
import db from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const rows = await db(
    `SELECT
       name,
       MAX(CASE
         WHEN tier IN ('lenda', 'rifter')         THEN 1
         WHEN tier IN ('criador', 'sentinela')    THEN 2
         WHEN tier IN ('apoiador', 'pesquisador') THEN 3
         ELSE 4
       END) AS tier_rank,
       CASE MAX(CASE
         WHEN tier IN ('lenda', 'rifter')         THEN 1
         WHEN tier IN ('criador', 'sentinela')    THEN 2
         WHEN tier IN ('apoiador', 'pesquisador') THEN 3
         ELSE 4
       END)
         WHEN 1 THEN MAX(CASE WHEN tier IN ('lenda','rifter')         THEN tier END)
         WHEN 2 THEN MAX(CASE WHEN tier IN ('criador','sentinela')    THEN tier END)
         WHEN 3 THEN MAX(CASE WHEN tier IN ('apoiador','pesquisador') THEN tier END)
         ELSE MAX(tier)
       END AS tier,
       SUM(amount) AS amount,
       MIN(created_at) AS created_at
     FROM donations
     WHERE status = 'confirmed'
     GROUP BY name
     ORDER BY
       tier_rank ASC,
       amount DESC NULLS LAST,
       created_at ASC`
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
