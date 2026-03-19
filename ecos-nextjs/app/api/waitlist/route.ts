import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { rateLimit } from '@/lib/rateLimit'
import { Resend } from 'resend'

// 3 inscrições por IP a cada hora
const limiter = rateLimit({ uniqueTokenPerInterval: 500, interval: 60 * 60_000 })

const WAITLIST_PATH = join(process.cwd(), 'data', 'waitlist.json')

interface WaitlistData {
  emails: string[]
  count: number
}

function readWaitlist(): WaitlistData {
  if (!existsSync(WAITLIST_PATH)) {
    return { emails: [], count: 0 }
  }
  try {
    return JSON.parse(readFileSync(WAITLIST_PATH, 'utf-8'))
  } catch {
    return { emails: [], count: 0 }
  }
}

function saveWaitlist(data: WaitlistData) {
  writeFileSync(WAITLIST_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET() {
  const data = readWaitlist()
  return NextResponse.json({ count: data.count })
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

  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const data = readWaitlist()

  if (data.emails.includes(email)) {
    return NextResponse.json({ count: data.count, alreadyRegistered: true })
  }

  data.emails.push(email)
  data.count = data.emails.length
  saveWaitlist(data)

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'E.M.Q <onboarding@resend.dev>',
    to: email,
    subject: 'Você entrou na lista de espera de E.M.Q!',
    html: `
      <div style="background:#0a0a0f;color:#e8e8e8;font-family:monospace;padding:40px;max-width:600px;margin:0 auto;">
        <h1 style="color:#f0c040;letter-spacing:2px;">E.M.Q — Ecos de um Mundo Quebrado</h1>
        <hr style="border-color:#333;margin:24px 0;">
        <p>Olá,</p>
        <p>Seu cadastro na lista de espera foi confirmado. Você é um dos primeiros a saber quando o jogo estiver disponível.</p>
        <p style="color:#f0c040;">Quando os dois universos colidirem, você será o primeiro a saber.</p>
        <hr style="border-color:#333;margin:24px 0;">
        <p style="color:#666;font-size:12px;">Você recebeu este email porque se cadastrou em ecos-emq.vercel.app</p>
      </div>
    `,
  }).catch(() => {}) // silencia erro de email para não bloquear o cadastro

  return NextResponse.json({ count: data.count, success: true })
}
