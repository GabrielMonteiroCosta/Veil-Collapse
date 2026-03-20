'use client'

import { useEffect, useState } from 'react'
import StarField from './StarField'
import styles from './LoginModal.module.css'
import { useAuth } from '@/context/AuthContext'
import PasswordStrength from './PasswordStrength'
import { validateUsername, validateEmail, validatePassword } from '@/lib/validators'

interface Props {
  open: boolean
  onClose: () => void
  onLoginSuccess?: (username: string) => void
  lang: string
}

type Status = { type: 'success' | 'error'; message: string } | null
type View = 'login' | 'register' | 'forgot'

export default function LoginModal({ open, onClose, onLoginSuccess, lang }: Props) {
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

  const [view, setView] = useState<View>('login')
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStatus, setForgotStatus] = useState<Status>(null)
  const [forgotLoading, setForgotLoading] = useState(false)

  const pt = lang === 'pt'

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

  useEffect(() => {
    if (!open) {
      setView('login')
      setForgotEmail('')
      setForgotStatus(null)
    }
  }, [open])

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
        if (onLoginSuccess) {
          setTimeout(() => onLoginSuccess(data.user.username), 300)
        } else {
          setLoginStatus({ type: 'success', message: pt ? `Bem-vindo, ${data.user.username}!` : `Welcome, ${data.user.username}!` })
          setTimeout(() => onClose(), 1000)
        }
      }
    } catch {
      setLoginStatus({ type: 'error', message: pt ? 'Erro de conexão' : 'Connection error' })
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegStatus(null)

    const unErr = validateUsername(regUsername)
    if (unErr) { setRegStatus({ type: 'error', message: unErr }); return }
    const emErr = validateEmail(regEmail)
    if (emErr) { setRegStatus({ type: 'error', message: emErr }); return }
    const pwErr = validatePassword(regPassword)
    if (pwErr) { setRegStatus({ type: 'error', message: pwErr }); return }

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
        setRegStatus({ type: 'success', message: pt ? 'Conta criada! Faça login.' : 'Account created! Sign in.' })
        setRegUsername('')
        setRegEmail('')
        setRegPassword('')
      }
    } catch {
      setRegStatus({ type: 'error', message: pt ? 'Erro de conexão' : 'Connection error' })
    } finally {
      setRegLoading(false)
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setForgotStatus(null)
    setForgotLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const data = await res.json()
      if (!res.ok) {
        setForgotStatus({ type: 'error', message: data.error })
      } else {
        setForgotStatus({ type: 'success', message: pt ? 'Se o e-mail existir, um link foi enviado.' : 'If the email exists, a link was sent.' })
      }
    } catch {
      setForgotStatus({ type: 'error', message: pt ? 'Erro de conexão' : 'Connection error' })
    } finally {
      setForgotLoading(false)
    }
  }

  const isRegister = view === 'register'

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={`${styles.modal} ${isRegister ? styles.modalAnti : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Decorations */}
        <StarField mode={isRegister ? 'anti' : 'normal'} lite />
        {isRegister
          ? <div className={styles.voidGlow} />
          : <div className={styles.moon} />
        }
        <div className={styles.crack} />
        <div className={styles.scanlines} />

        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">×</button>

        {/* Sliding track */}
        <div className={`${styles.track} ${isRegister ? styles.trackSlid : ''}`}>

          {/* Panel 1 — Login / Forgot */}
          <div className={styles.panel}>
            <div className={styles.content} key={view === 'forgot' ? 'forgot' : 'login'}>
              {view !== 'forgot' ? (
                <>
                  <p className={styles.tag}>{pt ? '✦ UNIVERSO NORMAL' : '✦ NORMAL UNIVERSE'}</p>
                  <h2 className={`${styles.title} ${styles.glitch}`}>
                    {pt ? 'Entrar' : 'Sign In'}
                  </h2>
                  <p className={styles.subtitle}>
                    {pt ? 'Acesse sua conta no universo conhecido' : 'Access your account in the known universe'}
                  </p>
                  <form className={styles.form} onSubmit={handleLogin}>
                    <input
                      className={`${styles.input} ${styles.inputNormal}`}
                      type="email"
                      placeholder={pt ? 'E-mail' : 'Email'}
                      autoComplete="email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      required
                    />
                    <div className={styles.passwordRow}>
                      <input
                        className={`${styles.input} ${styles.inputNormal}`}
                        type="password"
                        placeholder={pt ? 'Senha' : 'Password'}
                        autoComplete="current-password"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className={styles.forgotLink}
                        onClick={() => { setView('forgot'); setForgotStatus(null); setForgotEmail('') }}
                      >
                        {pt ? 'Esqueceu a senha?' : 'Forgot password?'}
                      </button>
                    </div>
                    {loginStatus && (
                      <p className={loginStatus.type === 'success' ? styles.msgSuccess : styles.msgError}>
                        {loginStatus.message}
                      </p>
                    )}
                    <button type="submit" className={styles.submitNormal} disabled={loginLoading}>
                      {loginLoading ? (pt ? 'Entrando...' : 'Signing in...') : (pt ? 'Acessar' : 'Enter')}
                    </button>
                  </form>
                  <div className={styles.switchRow}>
                    <span>{pt ? 'Sem conta?' : 'No account?'}</span>
                    <button className={styles.switchBtn} onClick={() => setView('register')}>
                      {pt ? 'Criar conta →' : 'Register →'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className={styles.tag}>{pt ? '✦ UNIVERSO NORMAL' : '✦ NORMAL UNIVERSE'}</p>
                  <h2 className={styles.title}>{pt ? 'Recuperar Senha' : 'Reset Password'}</h2>
                  <p className={styles.subtitle}>
                    {pt ? 'Enviaremos um link para o seu e-mail' : 'We will send a recovery link to your email'}
                  </p>
                  <form className={styles.form} onSubmit={handleForgot}>
                    <input
                      className={`${styles.input} ${styles.inputNormal}`}
                      type="email"
                      placeholder={pt ? 'Seu e-mail' : 'Your email'}
                      autoComplete="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      required
                    />
                    {forgotStatus && (
                      <p className={forgotStatus.type === 'success' ? styles.msgSuccess : styles.msgError}>
                        {forgotStatus.message}
                      </p>
                    )}
                    <button type="submit" className={styles.submitNormal} disabled={forgotLoading}>
                      {forgotLoading ? (pt ? 'Enviando...' : 'Sending...') : (pt ? 'Enviar Link' : 'Send Link')}
                    </button>
                    <button type="button" className={styles.formLink} onClick={() => setView('login')}>
                      ← {pt ? 'Voltar ao login' : 'Back to login'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Panel 2 — Register */}
          <div className={styles.panel}>
            <div className={styles.content} key="register">
              <p className={styles.tagAnti}>{pt ? '⟷ ANTI-UNIVERSO' : '⟷ ANTI-UNIVERSE'}</p>
              <h2 className={`${styles.titleAnti} ${styles.glitchAnti}`}>
                {pt ? 'Criar Conta' : 'Register'}
              </h2>
              <p className={styles.subtitle}>
                {pt ? 'Adentre o anti-universo pela primeira vez' : 'Enter the anti-universe for the first time'}
              </p>
              <form className={styles.form} onSubmit={handleRegister}>
                <input
                  className={`${styles.input} ${styles.inputAnti}`}
                  type="text"
                  placeholder={pt ? 'Nome de usuário' : 'Username'}
                  autoComplete="username"
                  value={regUsername}
                  onChange={e => setRegUsername(e.target.value)}
                  required
                />
                <input
                  className={`${styles.input} ${styles.inputAnti}`}
                  type="email"
                  placeholder={pt ? 'E-mail' : 'Email'}
                  autoComplete="email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  required
                />
                <input
                  className={`${styles.input} ${styles.inputAnti}`}
                  type="password"
                  placeholder={pt ? 'Mín. 8 chars, maiúscula, número, especial' : 'Min. 8 chars, uppercase, number, special'}
                  autoComplete="new-password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  required
                />
                <PasswordStrength password={regPassword} />
                {regStatus && (
                  <p className={regStatus.type === 'success' ? styles.msgSuccess : styles.msgError}>
                    {regStatus.message}
                  </p>
                )}
                <button type="submit" className={styles.submitAnti} disabled={regLoading}>
                  {regLoading ? (pt ? 'Registrando...' : 'Registering...') : (pt ? 'Registrar' : 'Register')}
                </button>
              </form>
              <div className={styles.switchRow}>
                <span>{pt ? 'Já tem conta?' : 'Have an account?'}</span>
                <button className={`${styles.switchBtn} ${styles.switchBtnAnti}`} onClick={() => setView('login')}>
                  ← {pt ? 'Entrar' : 'Sign In'}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom universe label */}
        <span className={`${styles.worldLabel} ${isRegister ? styles.worldLabelAnti : ''}`}>
          {isRegister
            ? (pt ? 'ANTI-UNIVERSO' : 'ANTI-UNIVERSE')
            : (pt ? 'UNIVERSO NORMAL' : 'NORMAL UNIVERSE')}
        </span>
      </div>
    </div>
  )
}
