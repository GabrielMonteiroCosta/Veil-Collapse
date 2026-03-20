import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'
import { rateLimit } from '@/lib/rateLimit'
import { validateUsername, validateEmail, validatePassword } from '@/lib/validators'

// 5 cadastros por IP a cada hora
const limiter = rateLimit({ uniqueTokenPerInterval: 500, interval: 60 * 60_000 })

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { success } = limiter.check(5, ip)
  if (!success) {
    return NextResponse.json(
      { error: 'Muitas tentativas de cadastro. Tente novamente mais tarde.' },
      { status: 429 }
    )
  }
  let body: { username?: string; email?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }

  const username = body.username?.trim()
  const email = body.email?.trim().toLowerCase()
  const password = body.password

  const usernameErr = validateUsername(username ?? '')
  if (usernameErr) return NextResponse.json({ error: usernameErr }, { status: 400 })

  const emailErr = validateEmail(email ?? '')
  if (emailErr) return NextResponse.json({ error: emailErr }, { status: 400 })

  const passwordErr = validatePassword(password ?? '')
  if (passwordErr) return NextResponse.json({ error: passwordErr }, { status: 400 })

  const conn = await pool.getConnection()
  try {
    const [existing] = await conn.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    )

    if (existing.length > 0) {
      return NextResponse.json({ error: 'E-mail ou nome de usuário já cadastrado' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const [result] = await conn.execute<import('mysql2').ResultSetHeader>(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    )

    await conn.execute(
      `INSERT INTO notifications (user_id, message_pt, message_en) VALUES (?, ?, ?)`,
      [
        result.insertId,
        `Bem-vindo ao E.M.Q, ${username}! Obrigado por se cadastrar. Fique de olho nas atualizações do jogo.`,
        `Welcome to E.M.Q, ${username}! Thanks for signing up. Stay tuned for game updates.`,
      ]
    )

    // Badges: welcome sempre; pioneer se entre os primeiros 100
    try {
      await conn.execute(
        'INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)',
        [result.insertId, 'welcome']
      )
      const [[{ count }]] = await conn.execute<import('mysql2').RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM users'
      ) as [import('mysql2').RowDataPacket[], unknown]
      if (Number(count) <= 100) {
        await conn.execute(
          'INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)',
          [result.insertId, 'pioneer']
        )
      }
    } catch { /* badges table may not exist yet */ }

    return NextResponse.json({ success: true, message: 'Conta criada com sucesso!' })
  } finally {
    conn.release()
  }
}
