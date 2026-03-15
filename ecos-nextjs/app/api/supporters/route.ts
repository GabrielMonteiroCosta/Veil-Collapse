import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'

const TIER_WEIGHT: Record<string, number> = { lenda: 3, criador: 2, apoiador: 1 }

export async function GET() {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT name, tier, amount, created_at
       FROM donations
       WHERE status = 'confirmed'
       ORDER BY
         FIELD(tier, 'lenda', 'criador', 'apoiador'),
         amount DESC,
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
  } finally {
    conn.release()
  }
}
