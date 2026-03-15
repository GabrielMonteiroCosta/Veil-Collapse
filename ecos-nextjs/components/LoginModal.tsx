'use client'

import { useEffect, useState } from 'react'
import StarField from './StarField'
import styles from './LoginModal.module.css'
import { useAuth } from '@/context/AuthContext'

interface Props {
  open: boolean
  onClose: () => void
  lang: string
}

type Status = { type: 'success' | 'error'; message: string } | null

export default function LoginModal({ open, onClose, lang }: Props) {
  const { setUser } = useAuth()
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginStatus, setLoginStatus] = useState<Status>(null)
  const [loginLoading, setLoginLoading] = useState(false)

  const [regUsername, setRegUsername] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regStatus, setRegStatus] = useState<Status>(null)
  const [regLoading, setRegLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginStatus(null)
    setLoginLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setLoginStatus({ type: 'error', message: data.error })
      } else {
        setUser(data.user)
        setLoginStatus({
          type: 'success',
          message: lang === 'pt'
            ? `Bem-vindo, ${data.user.username}!`
            : `Welcome, ${data.user.username}!`,
        })
        setTimeout(() => onClose(), 1000)
      }
    } catch {
      setLoginStatus({
        type: 'error',
        message: lang === 'pt' ? 'Erro de conexão' : 'Connection error',
      })
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegStatus(null)
    setRegLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: regUsername, email: regEmail, password: regPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setRegStatus({ type: 'error', message: data.error })
      } else {
        setRegStatus({
          type: 'success',
          message: lang === 'pt' ? 'Conta criada! Faça login.' : 'Account created! Sign in.',
        })
        setRegUsername('')
        setRegEmail('')
        setRegPassword('')
      }
    } catch {
      setRegStatus({
        type: 'error',
        message: lang === 'pt' ? 'Erro de conexão' : 'Connection error',
      })
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">×</button>

        {/* Normal Universe — Login */}
        <div className={styles.sideNormal}>
          <StarField mode="normal" lite />
          <div className={styles.moon} />
          <div className={styles.crack} />
          <div className={styles.content}>
            <p className={styles.sideTag}>
              {lang === 'pt' ? '✦ UNIVERSO NORMAL' : '✦ NORMAL UNIVERSE'}
            </p>
            <h2 className={styles.sideTitle}>
              {lang === 'pt' ? 'Entrar' : 'Sign In'}
            </h2>
            <p className={styles.sideSubtitle}>
              {lang === 'pt'
                ? 'Acesse sua conta no universo conhecido'
                : 'Access your account in the known universe'}
            </p>
            <form className={styles.form} onSubmit={handleLogin}>
              <input
                className={`${styles.input} ${styles.inputNormal}`}
                type="email"
                placeholder={lang === 'pt' ? 'E-mail' : 'Email'}
                autoComplete="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
              />
              <input
                className={`${styles.input} ${styles.inputNormal}`}
                type="password"
                placeholder={lang === 'pt' ? 'Senha' : 'Password'}
                autoComplete="current-password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
              />
              {loginStatus && (
                <p className={loginStatus.type === 'success' ? styles.msgSuccess : styles.msgError}>
                  {loginStatus.message}
                </p>
              )}
              <button type="submit" className={styles.submitNormal} disabled={loginLoading}>
                {loginLoading
                  ? (lang === 'pt' ? 'Entrando...' : 'Signing in...')
                  : (lang === 'pt' ? 'Acessar' : 'Enter')}
              </button>
            </form>
          </div>
          <span className={styles.worldLabel}>
            {lang === 'pt' ? 'UNIVERSO NORMAL' : 'NORMAL UNIVERSE'}
          </span>
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <div className={styles.dividerHandle}>
            <span className={styles.handleArrow}>◀</span>
            <span className={styles.handleIcon}>✦</span>
            <span className={styles.handleArrow}>▶</span>
          </div>
        </div>

        {/* Anti-Universe — Register */}
        <div className={styles.sideAnti}>
          <StarField mode="anti" lite />
          <div className={styles.voidGlow} />
          <div className={styles.crack} style={{ right: '12%', left: 'auto' }} />
          <div className={styles.content}>
            <p className={styles.sideTagAnti}>
              {lang === 'pt' ? '⟷ ANTI-UNIVERSO' : '⟷ ANTI-UNIVERSE'}
            </p>
            <h2 className={styles.sideTitleAnti}>
              {lang === 'pt' ? 'Criar Conta' : 'Register'}
            </h2>
            <p className={styles.sideSubtitleAnti}>
              {lang === 'pt'
                ? 'Adentre o anti-universo pela primeira vez'
                : 'Enter the anti-universe for the first time'}
            </p>
            <form className={styles.form} onSubmit={handleRegister}>
              <input
                className={`${styles.input} ${styles.inputAnti}`}
                type="text"
                placeholder={lang === 'pt' ? 'Nome de usuário' : 'Username'}
                autoComplete="username"
                value={regUsername}
                onChange={e => setRegUsername(e.target.value)}
                required
              />
              <input
                className={`${styles.input} ${styles.inputAnti}`}
                type="email"
                placeholder={lang === 'pt' ? 'E-mail' : 'Email'}
                autoComplete="email"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                required
              />
              <input
                className={`${styles.input} ${styles.inputAnti}`}
                type="password"
                placeholder={lang === 'pt' ? 'Senha (mín. 6 caracteres)' : 'Password (min. 6 chars)'}
                autoComplete="new-password"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                required
              />
              {regStatus && (
                <p className={regStatus.type === 'success' ? styles.msgSuccess : styles.msgError}>
                  {regStatus.message}
                </p>
              )}
              <button type="submit" className={styles.submitAnti} disabled={regLoading}>
                {regLoading
                  ? (lang === 'pt' ? 'Registrando...' : 'Registering...')
                  : (lang === 'pt' ? 'Registrar' : 'Register')}
              </button>
            </form>
          </div>
          <span className={`${styles.worldLabel} ${styles.worldLabelAnti}`}>
            {lang === 'pt' ? 'ANTI-UNIVERSO' : 'ANTI-UNIVERSE'}
          </span>
        </div>

      </div>
    </div>
  )
}
