'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './NotifySection.module.css'

type Status = 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

export default function NotifySection() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/waitlist')
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (data.alreadyRegistered) {
        setStatus('duplicate')
      } else if (data.success) {
        setStatus('success')
        setCount(data.count)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className={`section ${styles.section}`} id="notificar">
      <div className="section-inner" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className={styles.moon} />
        <div className="section-tag">{t('notify.tag')}</div>
        <h2 className={`section-title ${styles.title}`}>{t('notify.title')}</h2>
        <p className={styles.text}>{t('notify.text')}</p>

        {count !== null && count > 0 && status !== 'success' && (
          <div className={styles.counter}>
            <span className={styles.counterNum}>{count}</span>
            <span className={styles.counterLabel}>{t('notify.count')}</span>
          </div>
        )}

        {status === 'success' || status === 'duplicate' ? (
          <p className={styles.success}>{t('notify.success')}</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('notify.placeholder')}
              className={styles.input}
              required
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? '...' : t('notify.btn')}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className={styles.error}>{t('notify.error')}</p>
        )}
      </div>
    </section>
  )
}
