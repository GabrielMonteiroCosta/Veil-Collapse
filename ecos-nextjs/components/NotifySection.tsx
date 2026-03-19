'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './NotifySection.module.css'

type Status = 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

export default function NotifySection() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [count, setCount] = useState<number | null>(null)
  const [displayCount, setDisplayCount] = useState(0)

  const counterRef = useRef<HTMLDivElement>(null)
  const animatedRef = useRef(false)

  useEffect(() => {
    fetch('/api/waitlist')
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => {})
  }, [])

  // Count-up triggers when counter enters viewport (not on API response)
  useEffect(() => {
    if (count === null || count === 0 || !counterRef.current) return

    const el = counterRef.current
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || animatedRef.current) return
      animatedRef.current = true
      obs.disconnect()

      const duration = 1400
      const start = performance.now()
      function step(now: number) {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 4)
        setDisplayCount(Math.round(eased * count!))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.5 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [count])

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
        setDisplayCount(data.count)
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
        <div className={styles.moon} data-reveal="scale" data-delay="0" />
        <div className="section-tag" data-reveal data-delay="80">{t('notify.tag')}</div>
        <h2 className={`section-title ${styles.title}`} data-reveal data-delay="160">{t('notify.title')}</h2>
        <p className={styles.text} data-reveal data-delay="220">{t('notify.text')}</p>

        {count !== null && count > 0 && status !== 'success' && (
          <div ref={counterRef} className={styles.counter}>
            <span className={styles.counterNum}>{displayCount}</span>
            <span className={styles.counterLabel}>{t('notify.count')}</span>
          </div>
        )}

        {status === 'success' || status === 'duplicate' ? (
          <p className={styles.success}>{t('notify.success')}</p>
        ) : (
          <form className={styles.form} data-reveal data-delay="280" onSubmit={handleSubmit}>
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
