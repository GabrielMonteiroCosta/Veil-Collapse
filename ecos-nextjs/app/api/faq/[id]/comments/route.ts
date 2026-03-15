import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'

interface JwtPayload { id: number; username: string; email: string; is_admin: number }

function getUser(req: NextRequest): JwtPayload | null {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) return null
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as JwtPayload
  } catch {
    return null
  }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const faqId = parseInt(params.id)
  if (isNaN(faqId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT fc.id, fc.content, fc.is_admin_reply, fc.created_at,
              u.username
       FROM faq_comments fc
       JOIN users u ON u.id = fc.user_id
       WHERE fc.faq_id = ?
       ORDER BY fc.created_at ASC`,
      [faqId]
    )
    return NextResponse.json({ comments: rows })
  } finally {
    conn.release()
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUser(req)
  if (!user) return NextResponse.json({ error: 'Faça login para comentar' }, { status: 401 })

  const faqId = parseInt(params.id)
  if (isNaN(faqId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  let body: { content?: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }

  const content = body.content?.trim()
  if (!content || content.length < 2) {
    return NextResponse.json({ error: 'Comentário muito curto' }, { status: 400 })
  }
  if (content.length > 600) {
    return NextResponse.json({ error: 'Comentário muito longo (máx 600 caracteres)' }, { status: 400 })
  }

  const conn = await pool.getConnection()
  try {
    const [result] = await conn.execute(
      `INSERT INTO faq_comments (faq_id, user_id, content, is_admin_reply)
       VALUES (?, ?, ?, ?)`,
      [faqId, user.id, content, user.is_admin ? 1 : 0]
    ) as any[]

    return NextResponse.json({
      comment: {
        id: result.insertId,
        content,
        is_admin_reply: user.is_admin ? 1 : 0,
        username: user.username,
        created_at: new Date().toISOString(),
      }
    })
  } finally {
    conn.release()
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUser(req)
  if (!user?.is_admin) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  const url  = new URL(req.url)
  const commentId = parseInt(url.searchParams.get('commentId') || '')
  if (isNaN(commentId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const conn = await pool.getConnection()
  try {
    await conn.execute('DELETE FROM faq_comments WHERE id = ?', [commentId])
    return NextResponse.json({ success: true })
  } finally {
    conn.release()
  }
}
