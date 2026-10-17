'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Footer.module.css'

type Status = 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

export default function Footer() {
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
      if (data.alreadyRegistered) setStatus('duplicate')
      else if (data.success) { setStatus('success'); setCount(data.count) }
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.title}>Veil: Collapse</p>
        <p className={styles.tagline}>{t('footer.tagline')}</p>

        <div className={styles.links}>
          <a href="#" className={styles.link}>{t('footer.twitter')}</a>
          <span className={styles.dot}>✦</span>
          <a href="#" className={styles.link}>{t('footer.instagram')}</a>
          <span className={styles.dot}>✦</span>
          <a href="#" className={styles.link}>{t('footer.discord')}</a>
        </div>

        <div className={styles.riftDivider}>
          <div className={styles.riftLine} />
          <span className={styles.riftStar}>✦</span>
          <div className={styles.riftLine} />
        </div>

        {/* Waitlist */}
        <div className={styles.waitlist}>
          {count !== null && count > 0 && (
            <p className={styles.waitlistCount}>
              <span className={styles.waitlistNum}>{count}</span>{' '}
              {t('notify.count')}
            </p>
          )}
          {status === 'success' || status === 'duplicate' ? (
            <p className={styles.waitlistSuccess}>{t('notify.success')}</p>
          ) : (
            <form className={styles.waitlistForm} onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('notify.placeholder')}
                className={styles.waitlistInput}
                required
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                className={`btn btn-primary ${styles.waitlistBtn}`}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? '...' : t('notify.btn')}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className={styles.waitlistError}>{t('notify.error')}</p>
          )}
        </div>

        <div className={styles.riftDivider}>
          <div className={styles.riftLine} />
          <span className={styles.riftStar}>✦</span>
          <div className={styles.riftLine} />
        </div>

        <p className={styles.copy}>{t('footer.copy')}</p>
      </div>
    </footer>
  )
}
