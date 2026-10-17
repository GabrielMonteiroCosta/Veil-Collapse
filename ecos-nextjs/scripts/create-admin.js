/**
 * Cria (ou atualiza) o usuário admin no banco.
 * Usuário, e-mail e senha vêm de variáveis de ambiente, nunca do código.
 *
 * Rodar com (PowerShell):
 *   $env:ADMIN_USERNAME="..."; $env:ADMIN_EMAIL="..."; $env:ADMIN_PASSWORD="..."; node scripts/create-admin.js
 */

const bcrypt = require('bcryptjs')
const mysql  = require('mysql2/promise')

function lerVariavel(nome) {
  const valor = process.env[nome]
  if (!valor) {
    console.error(`❌ Defina a variável de ambiente ${nome} antes de rodar o script.`)
    process.exit(1)
  }
  return valor
}

async function main() {
  const USERNAME = lerVariavel('ADMIN_USERNAME')
  const EMAIL    = lerVariavel('ADMIN_EMAIL')
  const PASSWORD = lerVariavel('ADMIN_PASSWORD')

  console.log('🔐 Gerando hash da senha...')
  const hash = await bcrypt.hash(PASSWORD, 12)

  const pool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.DB_PORT || 3306),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME     || 'ecos_db',
  })

  const conn = await pool.getConnection()
  try {
    // Insere se não existir, atualiza is_admin e senha se já existir
    await conn.execute(
      `INSERT INTO users (username, email, password_hash, is_admin)
       VALUES (?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE
         username      = VALUES(username),
         password_hash = VALUES(password_hash),
         is_admin      = 1`,
      [USERNAME, EMAIL, hash]
    )
    console.log(`✅ Admin criado/atualizado: ${USERNAME} (${EMAIL})`)
  } finally {
    conn.release()
    await pool.end()
  }
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
