import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import db from '@/lib/db'

interface JwtPayload { id: number; username: string; email: string; is_admin: number }

function getUser(req: NextRequest): JwtPayload | null {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) return null
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as JwtPayload
  } catch { return null }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const faqId = parseInt(params.id)
  if (isNaN(faqId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const rows = await db(
    `SELECT fc.id, fc.parent_id, fc.content, fc.is_admin_reply, fc.created_at,
            u.username, u.avatar
     FROM faq_comments fc
     JOIN users u ON u.id = fc.user_id
     WHERE fc.faq_id = $1
     ORDER BY fc.created_at ASC`,
    [faqId]
  )
  return NextResponse.json({ comments: rows })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUser(req)
  if (!user) return NextResponse.json({ error: 'Faça login para comentar' }, { status: 401 })

  const faqId = parseInt(params.id)
  if (isNaN(faqId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  let body: { content?: string; parent_id?: number }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }

  // Only admin can reply to existing comments
  if (body.parent_id && !user.is_admin) {
    return NextResponse.json({ error: 'Sem permissão para responder' }, { status: 403 })
  }

  const content = body.content?.trim()
  if (!content || content.length < 2)
    return NextResponse.json({ error: 'Comentário muito curto' }, { status: 400 })
  if (content.length > 600)
    return NextResponse.json({ error: 'Comentário muito longo (máx 600 caracteres)' }, { status: 400 })

  const parentId = body.parent_id ?? null

  const [result] = await db(
    `INSERT INTO faq_comments (faq_id, parent_id, user_id, content, is_admin_reply)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [faqId, parentId, user.id, content, user.is_admin ? 1 : 0]
  )

  const userRows = await db('SELECT avatar FROM users WHERE id = $1', [user.id])

  return NextResponse.json({
    comment: {
      id:             result.id,
      parent_id:      parentId,
      content,
      is_admin_reply: user.is_admin ? 1 : 0,
      username:       user.username,
      avatar:         userRows[0]?.avatar ?? null,
      created_at:     new Date().toISOString(),
    }
  })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUser(req)
  if (!user?.is_admin) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  const url       = new URL(req.url)
  const commentId = parseInt(url.searchParams.get('commentId') || '')
  if (isNaN(commentId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  await db('DELETE FROM faq_comments WHERE id = $1', [commentId])
  return NextResponse.json({ success: true })
}
