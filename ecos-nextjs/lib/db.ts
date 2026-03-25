import { neon } from '@neondatabase/serverless'

let _db: ReturnType<typeof neon> | null = null

function getDb() {
  if (!_db) {
    _db = neon(process.env.DATABASE_URL!)
  }
  return _db
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function db(query: string, params?: unknown[]): Promise<any[]> {
  return getDb()(query, params as never) as Promise<any[]>
}
