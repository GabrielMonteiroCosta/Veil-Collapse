import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import db from '@/lib/db'
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

  const existing = await db(
    'SELECT id FROM users WHERE email = $1 OR username = $2',
    [email, username]
  )

  if (existing.length > 0) {
    return NextResponse.json({ error: 'E-mail ou nome de usuário já cadastrado' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const [newUser] = await db(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
    [username, email, passwordHash]
  )

  await db(
    `INSERT INTO notifications (user_id, message_pt, message_en) VALUES ($1, $2, $3)`,
    [
      newUser.id,
      `Bem-vindo ao E.M.Q, ${username}! Obrigado por se cadastrar. Fique de olho nas atualizações do jogo.`,
      `Welcome to E.M.Q, ${username}! Thanks for signing up. Stay tuned for game updates.`,
    ]
  )

  // Badges: welcome sempre; pioneer se entre os primeiros 100
  try {
    await db(
      'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [newUser.id, 'welcome']
    )
    const [{ count }] = await db('SELECT COUNT(*) as count FROM users')
    if (Number(count) <= 100) {
      await db(
        'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [newUser.id, 'pioneer']
      )
    }
  } catch { /* badges table may not exist yet */ }

  return NextResponse.json({ success: true, message: 'Conta criada com sucesso!' })
}
