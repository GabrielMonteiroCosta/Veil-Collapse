import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { Resend } from 'resend'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'
import { rateLimit } from '@/lib/rateLimit'

// 3 tentativas por IP a cada 15 minutos
const limiter = rateLimit({ uniqueTokenPerInterval: 500, interval: 15 * 60_000 })

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { success } = limiter.check(3, ip)
  if (!success) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Aguarde 15 minutos.' },
      { status: 429 }
    )
  }

  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 })
  }

  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT id, username FROM users WHERE email = ?',
      [email]
    )

    // Sempre retorna sucesso para não revelar se o e-mail existe
    if (rows.length === 0) {
      return NextResponse.json({ success: true })
    }

    const user = rows[0]
    const token = jwt.sign(
      { email, purpose: 'reset' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '15m' }
    )

    const origin = req.headers.get('origin') || 'http://localhost:3000'
    const resetLink = `${origin}/reset-password?token=${token}`

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error: sendError } = await resend.emails.send({
      from: 'E.M.Q <onboarding@resend.dev>',
      to: email,
      subject: 'Redefinição de senha — E.M.Q',
      html: `
        <div style="background:#0a0a0f;color:#e8e8e8;font-family:monospace;padding:40px;max-width:600px;margin:0 auto;">
          <h1 style="color:#f0c040;letter-spacing:2px;">E.M.Q — Ecos de um Mundo Quebrado</h1>
          <hr style="border-color:#333;margin:24px 0;">
          <p>Olá, <strong>${user.username}</strong>.</p>
          <p>Recebemos uma solicitação para redefinir sua senha.</p>
          <p>Clique no botão abaixo para criar uma nova senha. O link expira em <strong style="color:#f0c040;">15 minutos</strong>.</p>
          <a href="${resetLink}" style="display:inline-block;margin:24px 0;padding:14px 32px;background:#f0c040;color:#080d28;text-decoration:none;font-weight:bold;border-radius:6px;font-family:monospace;letter-spacing:1px;">
            REDEFINIR SENHA
          </a>
          <p style="color:#888;">Se você não solicitou isso, ignore este e-mail. Sua senha não será alterada.</p>
          <hr style="border-color:#333;margin:24px 0;">
          <p style="color:#555;font-size:12px;">Este link expira em 15 minutos.</p>
        </div>
      `,
    })
    if (sendError) {
      console.error('[forgot-password] Resend error:', sendError)
    }
  } finally {
    conn.release()
  }

  return NextResponse.json({ success: true })
}
