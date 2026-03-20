import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function GET() {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as count FROM users')
    return NextResponse.json({ users: rows[0].count })
  } finally {
    conn.release()
  }
}
