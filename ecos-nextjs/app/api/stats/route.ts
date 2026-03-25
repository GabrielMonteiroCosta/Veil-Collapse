import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  const [row] = await db('SELECT COUNT(*) as count FROM users')
  return NextResponse.json({ users: row.count })
}
