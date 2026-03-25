import { neon } from '@neondatabase/serverless'

let _db: ReturnType<typeof neon> | null = null

function getDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL!
    _db = neon(url)
  }
  return _db
}

export default function db(query: string, params?: unknown[]) {
  return getDb()(query, params as never)
}
