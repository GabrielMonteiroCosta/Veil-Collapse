'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import styles from './page.module.css'

export default function AdminNotificacoesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [messagePt, setMessagePt] = useState('')
  const [messageEn, setMessageEn] = useState('')
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user?.is_admin) router.replace('/')
  }, [authLoading, user?.id])

  if (authLoading || !user?.is_admin) return null

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setStatus(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_pt: messagePt, message_en: messageEn }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error })
      } else {
        setStatus({ type: 'success', message: `✓ Notificação enviada para ${data.count} usuário(s).` })
        setMessagePt('')
        setMessageEn('')
      }
    } catch {
      setStatus({ type: 'error', message: 'Erro de conexão.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.breadcrumb}>Admin</p>
          <h1 className={styles.title}>✦ Notificações</h1>
        </div>
        <div className={styles.headerLinks}>
          <a href="/admin/dashboard" className={styles.navLink}>Dashboard</a>
          <a href="/admin/doacoes" className={styles.navLink}>Doações</a>
          <a href="/" className={styles.backBtn}>← Voltar ao site</a>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.cardDesc}>
          Envie uma notificação para <strong>todos os usuários cadastrados</strong>. Preencha as duas versões (PT e EN).
        </p>
        <form className={styles.form} onSubmit={handleSend}>
          <label className={styles.label}>Mensagem em Português</label>
          <textarea
            className={styles.textarea}
            value={messagePt}
            onChange={e => setMessagePt(e.target.value)}
            placeholder="Ex: Nova atualização do devlog disponível!"
            rows={3}
            required
          />
          <label className={styles.label}>Message in English</label>
          <textarea
            className={styles.textarea}
            value={messageEn}
            onChange={e => setMessageEn(e.target.value)}
            placeholder="Ex: New devlog update available!"
            rows={3}
            required
          />
          {status && (
            <p className={status.type === 'success' ? styles.msgSuccess : styles.msgError}>
              {status.message}
            </p>
          )}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Enviando...' : '🔔 Enviar para todos'}
          </button>
        </form>
      </div>
    </div>
  )
}
