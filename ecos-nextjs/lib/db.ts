import mysql from 'mysql2/promise'

// Singleton para evitar múltiplos pools durante hot reload no dev
const globalForDb = global as typeof global & { dbPool?: mysql.Pool }

if (!globalForDb.dbPool) {
  globalForDb.dbPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecos_db',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
}

export default globalForDb.dbPool
