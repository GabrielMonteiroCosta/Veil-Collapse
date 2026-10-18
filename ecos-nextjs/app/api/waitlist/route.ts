import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { rateLimit } from '@/lib/rateLimit'
import { Resend } from 'resend'

// 3 inscrições por IP a cada hora
const limiter = rateLimit({ uniqueTokenPerInterval: 500, interval: 60 * 60_000 })

// Endereço exibido no rodapé do e-mail (sem o https://)
const SITE_HOST = (process.env.NEXT_PUBLIC_SITE_URL || 'https://e-m-q.vercel.app').replace(/^https?:\/\//, '').replace(/\/$/, '')

async function contarInscritos(): Promise<number> {
  const [{ count }] = await db('SELECT COUNT(*) AS count FROM waitlist')
  return Number(count)
}

export async function GET() {
  return NextResponse.json({ count: await contarInscritos() })
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { success } = limiter.check(3, ip)
  if (!success) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente mais tarde.' },
      { status: 429 }
    )
  }

  let body: { email?: string; prefs?: string[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  const prefs = Array.isArray(body.prefs) ? body.prefs.slice(0, 5) : []

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // ON CONFLICT evita duplicata mesmo com dois cadastros simultâneos do mesmo e-mail
  const inseridos = await db(
    `INSERT INTO waitlist (email, prefs) VALUES ($1, $2::jsonb)
     ON CONFLICT (email) DO NOTHING
     RETURNING id`,
    [email, JSON.stringify(prefs)]
  )
  const count = await contarInscritos()

  if (inseridos.length === 0) {
    return NextResponse.json({ count, alreadyRegistered: true })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'VEIL <onboarding@resend.dev>',
    to: email,
    subject: 'Você entrou na lista de espera de Veil: Collapse!',
    html: `
      <div style="background:#0a0a0f;color:#e8e8e8;font-family:monospace;padding:40px;max-width:600px;margin:0 auto;">
        <h1 style="color:#f0c040;letter-spacing:2px;">Veil: Collapse</h1>
        <hr style="border-color:#333;margin:24px 0;">
        <p>Olá,</p>
        <p>Seu cadastro na lista de espera foi confirmado. Você é um dos primeiros a saber quando o jogo estiver disponível.</p>
        <p style="color:#f0c040;">Quando os dois universos colidirem, você será o primeiro a saber.</p>
        <hr style="border-color:#333;margin:24px 0;">
        <p style="color:#666;font-size:12px;">Você recebeu este email porque se cadastrou em ${SITE_HOST}</p>
      </div>
    `,
  }).catch(() => {}) // silencia erro de email para não bloquear o cadastro

  return NextResponse.json({ count, success: true })
}
