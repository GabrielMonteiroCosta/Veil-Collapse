'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { faqs } from '@/data/faq'
import styles from './FaqSection.module.css'

interface Comment {
  id: number
  parent_id: number | null
  content: string
  username: string
  is_admin_reply: number
  created_at: string
}

interface FaqState {
  open: boolean
  comments: Comment[]
  loaded: boolean
  loading: boolean
  // top-level comment form
  posting: boolean
  draft: string
  error: string | null
  // admin reply
  replyingTo: number | null
  replyDraft: string
  replyPosting: boolean
  replyError: string | null
  // collapse state: set of parent comment ids whose replies are hidden
  collapsed: Set<number>
}

// ── @mention renderer ────────────────────────────────────────────────────────
function renderContent(text: string, ac: string) {
  return text.split(/(@\w+)/g).map((part, i) =>
    /^@\w+$/.test(part)
      ? <span key={i} className={styles.mention} style={{ color: ac }}>{part}</span>
      : part
  )
}

// ── Date formatter ────────────────────────────────────────────────────────────
function fmtDate(iso: string, pt: boolean) {
  return new Date(iso).toLocaleDateString(pt ? 'pt-BR' : 'en-US', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function FaqSection() {
  const { lang } = useLanguage()
  const { user } = useAuth()
  const pt       = lang === 'pt'
  const isAdmin  = user?.is_admin === 1

  const [states, setStates] = useState<Record<number, FaqState>>(() =>
    Object.fromEntries(faqs.map(f => [f.id, {
      open: false, comments: [], loaded: false, loading: false,
      posting: false, draft: '', error: null,
      replyingTo: null, replyDraft: '', replyPosting: false, replyError: null,
      collapsed: new Set<number>(),
    }]))
  )

  function patch(faqId: number, p: Partial<FaqState>) {
    setStates(prev => ({ ...prev, [faqId]: { ...prev[faqId], ...p } }))
  }

  // ── Toggle FAQ open ──────────────────────────────────────────────────────
  async function toggle(faqId: number) {
    const s = states[faqId]
    if (!s.open && !s.loaded) {
      patch(faqId, { open: true, loading: true })
      try {
        const res  = await fetch(`/api/faq/${faqId}/comments`)
        const data = await res.json()
        patch(faqId, { comments: data.comments ?? [], loaded: true, loading: false })
      } catch {
        patch(faqId, { loading: false, loaded: true })
      }
    } else {
      patch(faqId, { open: !s.open })
    }
  }

  // ── Post top-level comment ────────────────────────────────────────────────
  async function postComment(faqId: number) {
    const s = states[faqId]
    if (!s.draft.trim() || s.posting) return
    patch(faqId, { posting: true, error: null })
    try {
      const res  = await fetch(`/api/faq/${faqId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: s.draft.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { patch(faqId, { posting: false, error: data.error }) }
      else { patch(faqId, { posting: false, draft: '', comments: [...s.comments, data.comment] }) }
    } catch {
      patch(faqId, { posting: false, error: pt ? 'Erro de conexão' : 'Connection error' })
    }
  }

  // ── Post admin reply ──────────────────────────────────────────────────────
  async function postReply(faqId: number) {
    const s = states[faqId]
    if (!s.replyDraft.trim() || s.replyPosting || !s.replyingTo) return
    patch(faqId, { replyPosting: true, replyError: null })
    try {
      const res  = await fetch(`/api/faq/${faqId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: s.replyDraft.trim(), parent_id: s.replyingTo }),
      })
      const data = await res.json()
      if (!res.ok) {
        patch(faqId, { replyPosting: false, replyError: data.error })
      } else {
        // auto-expand replies for this parent
        const newCollapsed = new Set(s.collapsed)
        newCollapsed.delete(s.replyingTo!)
        patch(faqId, {
          replyPosting: false, replyDraft: '', replyingTo: null, replyError: null,
          comments: [...s.comments, data.comment],
          collapsed: newCollapsed,
        })
      }
    } catch {
      patch(faqId, { replyPosting: false, replyError: pt ? 'Erro de conexão' : 'Connection error' })
    }
  }

  // ── Toggle reply collapse ─────────────────────────────────────────────────
  function toggleCollapse(faqId: number, commentId: number) {
    const s          = states[faqId]
    const newSet     = new Set(s.collapsed)
    newSet.has(commentId) ? newSet.delete(commentId) : newSet.add(commentId)
    patch(faqId, { collapsed: newSet })
  }

  // ── Delete comment ────────────────────────────────────────────────────────
  async function deleteComment(faqId: number, commentId: number) {
    await fetch(`/api/faq/${faqId}/comments?commentId=${commentId}`, { method: 'DELETE' })
    patch(faqId, {
      comments: states[faqId].comments.filter(
        c => c.id !== commentId && c.parent_id !== commentId
      ),
    })
  }

  // ── Start reply: pre-fill @username ──────────────────────────────────────
  function startReply(faqId: number, comment: Comment) {
    const s = states[faqId]
    if (s.replyingTo === comment.id) {
      patch(faqId, { replyingTo: null, replyDraft: '', replyError: null })
    } else {
      patch(faqId, {
        replyingTo: comment.id,
        replyDraft: `@${comment.username} `,
        replyError: null,
      })
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section className={`section ${styles.section}`} id="faq">
      <div className="section-inner">
        <p className="section-tag">{pt ? '✦ Dúvidas' : '✦ Questions'}</p>
        <h2 className="section-title">
          {pt ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}
        </h2>
        <p className={styles.intro}>
          {pt
            ? 'Tem uma dúvida que não está aqui? Deixe um comentário abaixo ou entre no nosso Discord.'
            : 'Have a question not listed here? Leave a comment below or join our Discord.'}
        </p>

        <div className={styles.list}>
          {faqs.map((faq, i) => {
            const s          = states[faq.id]
            const ac         = `hsl(${(i * 37 + 200) % 360}, 70%, 65%)`
            const topLevel   = s.comments.filter(c => !c.parent_id)
            const totalCount = s.comments.length

            return (
              <div key={faq.id}
                className={`${styles.item} ${s.open ? styles.itemOpen : ''}`}
                style={{ '--faq-ac': ac } as React.CSSProperties}
              >
                {/* ── Question header ── */}
                <button className={styles.question} onClick={() => toggle(faq.id)}>
                  <span className={styles.qNum} style={{ color: ac }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.qText}>
                    {pt ? faq.questionPt : faq.questionEn}
                  </span>
                  <span className={`${styles.chevron} ${s.open ? styles.chevronOpen : ''}`}>▾</span>
                </button>

                {/* ── Body ── */}
                {s.open && (
                  <div className={styles.body}>
                    <div className={styles.sep}
                      style={{ background: `linear-gradient(to right, ${ac}, transparent)` }} />

                    <p className={styles.answer}>
                      {pt ? faq.answerPt : faq.answerEn}
                    </p>

                    {/* ── Discussion ── */}
                    <div className={styles.commentsWrap}>
                      <p className={styles.commentsTitle} style={{ color: ac }}>
                        {pt ? `✦ Discussão (${totalCount})` : `✦ Discussion (${totalCount})`}
                      </p>

                      {s.loading && (
                        <p className={styles.loadingText}>{pt ? 'Carregando...' : 'Loading...'}</p>
                      )}

                      {/* ── Comment threads ── */}
                      {topLevel.length > 0 && (
                        <div className={styles.comments}>
                          {topLevel.map(c => {
                            const replies    = s.comments.filter(r => r.parent_id === c.id)
                            const isCollapsed = s.collapsed.has(c.id)
                            const replying   = s.replyingTo === c.id

                            return (
                              <div key={c.id} className={styles.thread}>
                                {/* Top-level comment */}
                                <div className={styles.comment}>
                                  <div className={styles.commentHeader}>
                                    <span className={styles.commentUser}>
                                      {c.username}
                                    </span>
                                    <span className={styles.commentDate}>{fmtDate(c.created_at, pt)}</span>
                                    {isAdmin && (
                                      <button className={styles.replyBtn}
                                        style={{ color: ac }}
                                        onClick={() => startReply(faq.id, c)}>
                                        {replying ? (pt ? '✕ Cancelar' : '✕ Cancel') : (pt ? '↩ Responder' : '↩ Reply')}
                                      </button>
                                    )}
                                    {isAdmin && (
                                      <button className={styles.deleteBtn}
                                        onClick={() => deleteComment(faq.id, c.id)}
                                        title="Deletar">✕</button>
                                    )}
                                  </div>
                                  <p className={styles.commentContent}>
                                    {renderContent(c.content, ac)}
                                  </p>

                                  {/* Collapse toggle */}
                                  {replies.length > 0 && (
                                    <button
                                      className={styles.collapseBtn}
                                      style={{ color: ac + 'bb' }}
                                      onClick={() => toggleCollapse(faq.id, c.id)}
                                    >
                                      {isCollapsed
                                        ? (pt ? `▼ Ver resposta (${replies.length})` : `▼ Show reply (${replies.length})`)
                                        : (pt ? `▲ Ocultar resposta` : `▲ Hide reply`)}
                                    </button>
                                  )}
                                </div>

                                {/* Admin reply form */}
                                {replying && isAdmin && (
                                  <div className={styles.replyFormWrap}>
                                    <div className={styles.replyConnector} style={{ background: ac + '55' }} />
                                    <div className={styles.replyForm}>
                                      <div className={styles.replyFormHeader}>
                                        <span className={styles.adminBadge} style={{ background: ac, color: '#05091a' }}>
                                          ⚡ Dev
                                        </span>
                                        <span className={styles.replyFormHint}>
                                          {pt ? 'Use @nome para mencionar alguém' : 'Use @name to mention someone'}
                                        </span>
                                      </div>
                                      <textarea
                                        className={styles.commentInput}
                                        style={{ '--faq-ac': ac } as React.CSSProperties}
                                        placeholder={pt ? 'Escreva sua resposta...' : 'Write your reply...'}
                                        value={s.replyDraft}
                                        maxLength={600}
                                        rows={3}
                                        autoFocus
                                        onChange={e => patch(faq.id, { replyDraft: e.target.value })}
                                        onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) postReply(faq.id) }}
                                      />
                                      {s.replyError && <p className={styles.commentError}>{s.replyError}</p>}
                                      <div className={styles.commentActions}>
                                        <span className={styles.charCount}>{s.replyDraft.length}/600</span>
                                        <button
                                          className={styles.sendBtn}
                                          style={{ background: ac, color: '#05091a' }}
                                          disabled={s.replyPosting || !s.replyDraft.trim()}
                                          onClick={() => postReply(faq.id)}
                                        >
                                          {s.replyPosting
                                            ? (pt ? 'Enviando...' : 'Sending...')
                                            : (pt ? '↩ Responder' : '↩ Reply')}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Replies (threaded) */}
                                {replies.length > 0 && !isCollapsed && (
                                  <div className={styles.replies}>
                                    <div className={styles.replyLine} style={{ background: ac + '40' }} />
                                    <div className={styles.repliesList}>
                                      {replies.map(r => (
                                        <div key={r.id} className={styles.reply}>
                                          <div className={styles.commentHeader}>
                                            <span className={styles.commentUser} style={{ color: ac }}>
                                              ⚡ {r.username}
                                              <span className={styles.adminBadge}
                                                style={{ background: ac, color: '#05091a' }}>Dev</span>
                                            </span>
                                            <span className={styles.commentDate}>{fmtDate(r.created_at, pt)}</span>
                                            {isAdmin && (
                                              <button className={styles.deleteBtn}
                                                onClick={() => deleteComment(faq.id, r.id)}
                                                title="Deletar">✕</button>
                                            )}
                                          </div>
                                          <p className={styles.commentContent}>
                                            {renderContent(r.content, ac)}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* ── New comment form ── */}
                      {user ? (
                        <div className={styles.commentForm}>
                          <textarea
                            className={styles.commentInput}
                            style={{ '--faq-ac': ac } as React.CSSProperties}
                            placeholder={pt ? 'Deixe um comentário ou dúvida...' : 'Leave a comment or question...'}
                            value={s.draft}
                            maxLength={600}
                            rows={2}
                            onChange={e => patch(faq.id, { draft: e.target.value })}
                            onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) postComment(faq.id) }}
                          />
                          {s.error && <p className={styles.commentError}>{s.error}</p>}
                          <div className={styles.commentActions}>
                            <span className={styles.charCount}>{s.draft.length}/600</span>
                            <button
                              className={styles.sendBtn}
                              style={{ background: ac, color: '#05091a' }}
                              disabled={s.posting || !s.draft.trim()}
                              onClick={() => postComment(faq.id)}
                            >
                              {s.posting ? (pt ? 'Enviando...' : 'Sending...') : (pt ? 'Comentar' : 'Comment')}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className={styles.loginPrompt}>
                          {pt ? '✦ Faça login para participar da discussão.' : '✦ Log in to join the discussion.'}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
