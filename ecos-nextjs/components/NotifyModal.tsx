'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './NotifyModal.module.css'

interface Props {
  onClose: () => void
}

const PREFS = [
  { id: 'news',    pt: 'Novidades do jogo',          en: 'Game news' },
  { id: 'devlog',  pt: 'Atualizações do devlog',     en: 'Devlog updates' },
  { id: 'launch',  pt: 'Notificação no lançamento',  en: 'Launch notification' },
]

type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'error'

export default function NotifyModal({ onClose }: Props) {
  const { lang } = useLanguage()
  const pt = lang === 'pt'

  const [email, setEmail]   = useState('')
  const [prefs, setPrefs]   = useState<string[]>(['news', 'devlog', 'launch'])
  const [status, setStatus] = useState<Status>('idle')
  const overlayRef          = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function togglePref(id: string) {
    setPrefs(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')

    try {
      const res  = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, prefs }),
      })
      const data = await res.json()

      if (data.alreadyRegistered) setStatus('duplicate')
      else if (data.success)      setStatus('success')
      else                        setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  function handleOverlay(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">✕</button>

        <div className={styles.moon} />

        <p className={styles.tag}>{pt ? '✦ Lista de Espera' : '✦ Waitlist'}</p>
        <h2 className={styles.title}>
          {pt ? 'Seja o primeiro a saber' : 'Be the first to know'}
        </h2>
        <p className={styles.text}>
          {pt
            ? 'Quando os dois universos colidirem, você recebe o sinal primeiro.'
            : 'When the two universes collide, you get the signal first.'}
        </p>

        {status === 'success' || status === 'duplicate' ? (
          <div className={styles.success}>
            <span className={styles.successIcon}>✦</span>
            <p className={styles.successTitle}>
              {status === 'duplicate'
                ? (pt ? 'Você já está na lista!' : 'You\'re already on the list!')
                : (pt ? 'Cadastro confirmado!' : 'Registration confirmed!')}
            </p>
            <p className={styles.successText}>
              {pt
                ? 'Você receberá um sinal quando o mundo se quebrar.'
                : 'You\'ll receive a signal when the world breaks.'}
            </p>
            <button className={`btn btn-primary ${styles.doneBtn}`} onClick={onClose}>
              {pt ? 'Fechar' : 'Close'}
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputWrap}>
              <input
                type="email"
                className={styles.input}
                placeholder={pt ? 'seu@email.com' : 'your@email.com'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
              />
            </div>

            <fieldset className={styles.prefs}>
              <legend className={styles.prefsLabel}>
                {pt ? 'Quero receber:' : 'I want to receive:'}
              </legend>
              {PREFS.map(pref => (
                <label key={pref.id} className={styles.check}>
                  <input
                    type="checkbox"
                    checked={prefs.includes(pref.id)}
                    onChange={() => togglePref(pref.id)}
                    disabled={status === 'loading'}
                  />
                  <span className={styles.checkBox} />
                  <span className={styles.checkLabel}>{pt ? pref.pt : pref.en}</span>
                </label>
              ))}
            </fieldset>

            {status === 'error' && (
              <p className={styles.error}>
                {pt ? 'Algo deu errado. Tente novamente.' : 'Something went wrong. Try again.'}
              </p>
            )}

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={status === 'loading' || prefs.length === 0}
            >
              {status === 'loading' ? '...' : (pt ? 'Entrar na lista' : 'Join the list')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
