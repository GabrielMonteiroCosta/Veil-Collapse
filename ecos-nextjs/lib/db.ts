import { neon } from '@neondatabase/serverless'

let _db: ReturnType<typeof neon> | null = null

function getDb() {
  if (!_db) {
    // Remove channel_binding que o driver não suporta
    const url = (process.env.DATABASE_URL || '')
      .trim()
      .replace('&channel_binding=require', '')
      .replace('?channel_binding=require', '')
    _db = neon(url)
  }
  return _db
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function db(query: string, params?: unknown[]): Promise<any[]> {
  return getDb()(query, params as never) as Promise<any[]>
}
