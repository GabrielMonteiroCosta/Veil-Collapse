'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { faqs } from '@/data/faq'
import styles from './FaqSection.module.css'

interface Comment {
  id: number
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
  posting: boolean
  draft: string
  error: string | null
}

export default function FaqSection() {
  const { lang }   = useLanguage()
  const { user }   = useAuth()
  const pt         = lang === 'pt'

  const [states, setStates] = useState<Record<number, FaqState>>(() =>
    Object.fromEntries(faqs.map(f => [f.id, {
      open: false, comments: [], loaded: false,
      loading: false, posting: false, draft: '', error: null,
    }]))
  )

  function patch(id: number, patch: Partial<FaqState>) {
    setStates(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  async function toggle(id: number) {
    const s = states[id]
    if (!s.open && !s.loaded) {
      patch(id, { open: true, loading: true })
      try {
        const res  = await fetch(`/api/faq/${id}/comments`)
        const data = await res.json()
        patch(id, { comments: data.comments ?? [], loaded: true, loading: false })
      } catch {
        patch(id, { loading: false, loaded: true })
      }
    } else {
      patch(id, { open: !s.open })
    }
  }

  async function postComment(id: number) {
    const s = states[id]
    if (!s.draft.trim() || s.posting) return
    patch(id, { posting: true, error: null })
    try {
      const res  = await fetch(`/api/faq/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: s.draft.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        patch(id, { posting: false, error: data.error })
      } else {
        patch(id, {
          posting: false,
          draft: '',
          comments: [...s.comments, data.comment],
        })
      }
    } catch {
      patch(id, { posting: false, error: pt ? 'Erro de conexão' : 'Connection error' })
    }
  }

  async function deleteComment(faqId: number, commentId: number) {
    await fetch(`/api/faq/${faqId}/comments?commentId=${commentId}`, { method: 'DELETE' })
    patch(faqId, {
      comments: states[faqId].comments.filter(c => c.id !== commentId),
    })
  }

  return (
    <section className={`section ${styles.section}`} id="faq">
      <div className="section-inner">
        <p className="section-tag">{pt ? '✦ Dúvidas' : '✦ Questions'}</p>
        <h2 className="section-title">
          {pt ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}
        </h2>
        <p className={styles.intro}>
          {pt
            ? 'Tem uma dúvida que não está aqui? Entre na nossa comunidade do Discord ou deixe um comentário abaixo.'
            : 'Have a question not listed here? Join our Discord community or leave a comment below.'}
        </p>

        <div className={styles.list}>
          {faqs.map((faq, i) => {
            const s  = states[faq.id]
            const ac = `hsl(${(i * 37 + 200) % 360}, 70%, 65%)`

            return (
              <div key={faq.id}
                className={`${styles.item} ${s.open ? styles.itemOpen : ''}`}
                style={{ '--faq-ac': ac } as React.CSSProperties}
              >
                {/* Question row */}
                <button className={styles.question} onClick={() => toggle(faq.id)}>
                  <span className={styles.qNum} style={{ color: ac }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.qText}>
                    {pt ? faq.questionPt : faq.questionEn}
                  </span>
                  <span className={`${styles.chevron} ${s.open ? styles.chevronOpen : ''}`}>
                    ▾
                  </span>
                </button>

                {/* Answer + comments */}
                {s.open && (
                  <div className={styles.body}>
                    {/* Separator */}
                    <div className={styles.sep} style={{ background: `linear-gradient(to right, ${ac}, transparent)` }} />

                    {/* Answer */}
                    <p className={styles.answer}>
                      {pt ? faq.answerPt : faq.answerEn}
                    </p>

                    {/* Comments */}
                    <div className={styles.commentsWrap}>
                      <p className={styles.commentsTitle} style={{ color: ac }}>
                        {pt ? `✦ Discussão (${s.comments.length})` : `✦ Discussion (${s.comments.length})`}
                      </p>

                      {s.loading && (
                        <p className={styles.loadingText}>
                          {pt ? 'Carregando...' : 'Loading...'}
                        </p>
                      )}

                      {s.comments.length > 0 && (
                        <div className={styles.comments}>
                          {s.comments.map(c => (
                            <div key={c.id}
                              className={`${styles.comment} ${c.is_admin_reply ? styles.commentAdmin : ''}`}
                              style={c.is_admin_reply ? { borderColor: ac + '70', background: `color-mix(in srgb, ${ac} 5%, transparent)` } : {}}
                            >
                              <div className={styles.commentHeader}>
                                <span className={styles.commentUser} style={c.is_admin_reply ? { color: ac } : {}}>
                                  {c.is_admin_reply ? '⚡ ' : ''}{c.username}
                                  {c.is_admin_reply && (
                                    <span className={styles.adminBadge} style={{ background: ac, color: '#05091a' }}>
                                      {pt ? 'Dev' : 'Dev'}
                                    </span>
                                  )}
                                </span>
                                <span className={styles.commentDate}>
                                  {new Date(c.created_at).toLocaleDateString(pt ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                                {user?.is_admin === 1 && (
                                  <button className={styles.deleteBtn}
                                    onClick={() => deleteComment(faq.id, c.id)}
                                    title="Deletar">✕</button>
                                )}
                              </div>
                              <p className={styles.commentContent}>{c.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comment form */}
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
                              {s.posting
                                ? (pt ? 'Enviando...' : 'Sending...')
                                : (pt ? 'Comentar' : 'Comment')}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className={styles.loginPrompt}>
                          {pt
                            ? '✦ Faça login para participar da discussão.'
                            : '✦ Log in to join the discussion.'}
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
