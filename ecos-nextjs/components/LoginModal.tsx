'use client'

import { useEffect, useRef, useState } from 'react'
import StarField from './StarField'
import styles from './LoginModal.module.css'
import { useAuth } from '@/context/AuthContext'
import PasswordStrength from './PasswordStrength'
import { validateUsername, validateEmail, validatePassword, passwordChecks } from '@/lib/validators'

interface Props {
  open: boolean
  onClose: () => void
  onLoginSuccess?: (username: string) => void
  lang: string
}

type Status = { type: 'success' | 'error'; message: string } | null
type View = 'login' | 'register' | 'forgot'
type RegField = 'username' | 'email' | 'password'
type RegErrors = Partial<Record<RegField, string>>

export default function LoginModal({ open, onClose, onLoginSuccess, lang }: Props) {
  const { setUser } = useAuth()
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginStatus, setLoginStatus] = useState<Status>(null)
  const [loginLoading, setLoginLoading] = useState(false)

  const [regUsername, setRegUsername] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [regErrors, setRegErrors] = useState<RegErrors>({})
  const [regStatus, setRegStatus] = useState<Status>(null)
  const [regLoading, setRegLoading] = useState(false)

  const [view, setView] = useState<View>('login')
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStatus, setForgotStatus] = useState<Status>(null)
  const [forgotLoading, setForgotLoading] = useState(false)

  const regRefs = {
    username: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
  }

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
      setRegErrors({})
    }
  }, [open])

  if (!open) return null

  const validators: Record<RegField, (value: string) => string | null> = {
    username: validateUsername,
    email: validateEmail,
    password: validatePassword,
  }
  const regValues: Record<RegField, string> = { username: regUsername, email: regEmail, password: regPassword }

  function checkField(field: RegField) {
    const value = regValues[field]
    if (!value) return
    setRegErrors(prev => ({ ...prev, [field]: validators[field](value) ?? undefined }))
  }

  function changeRegField(field: RegField, value: string) {
    if (field === 'username') setRegUsername(value)
    if (field === 'email') setRegEmail(value)
    if (field === 'password') setRegPassword(value)
    if (regErrors[field]) setRegErrors(prev => ({ ...prev, [field]: undefined }))
    setRegStatus(null)
  }

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

    // Valida todos os campos de uma vez e mostra cada erro embaixo do seu campo
    const errors: RegErrors = {}
    for (const field of ['username', 'email', 'password'] as RegField[]) {
      const err = validators[field](regValues[field])
      if (err) errors[field] = err
    }
    setRegErrors(errors)
    const firstInvalid = (['username', 'email', 'password'] as RegField[]).find(f => errors[f])
    if (firstInvalid) {
      regRefs[firstInvalid].current?.focus()
      return
    }

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
        setRegStatus({ type: 'success', message: pt ? 'Conta criada! Agora é só entrar.' : 'Account created! You can sign in now.' })
        setLoginEmail(regEmail)
        setRegUsername('')
        setRegEmail('')
        setRegPassword('')
        setRegErrors({})
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
  const checks = passwordChecks(regPassword)
  const requirements = [
    { ok: checks.length,  text: pt ? '8 ou mais caracteres' : '8+ characters' },
    { ok: checks.upper,   text: pt ? 'Uma letra maiúscula' : 'One uppercase letter' },
    { ok: checks.number,  text: pt ? 'Um número' : 'One number' },
    { ok: checks.special, text: pt ? 'Um caractere especial (!@#$...)' : 'One special character (!@#$...)' },
  ]

  const toggleLabel = (shown: boolean) => shown ? (pt ? 'Ocultar' : 'Hide') : (pt ? 'Mostrar' : 'Show')

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={`${styles.modal} ${isRegister ? styles.modalAnti : ''}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isRegister ? (pt ? 'Criar conta' : 'Register') : (pt ? 'Entrar' : 'Sign in')}
      >
        {/* Decorations */}
        <StarField mode={isRegister ? 'anti' : 'normal'} lite />
        {isRegister
          ? <div className={styles.voidGlow} />
          : <div className={styles.moon} />
        }
        <div className={styles.crack} />
        <div className={styles.scanlines} />

        <button className={styles.closeBtn} onClick={onClose} aria-label={pt ? 'Fechar' : 'Close'}>×</button>

        {/* Sliding track */}
        <div className={`${styles.track} ${isRegister ? styles.trackSlid : ''}`}>

          {/* Panel 1 — Login / Forgot */}
          <div className={`${styles.panel} ${isRegister ? styles.panelInactive : ''}`} aria-hidden={isRegister}>
            <div className={styles.content} key={view === 'forgot' ? 'forgot' : 'login'}>
              {view !== 'forgot' ? (
                <>
                  <header className={styles.header}>
                    <p className={styles.tag}>{pt ? '✦ UNIVERSO NORMAL' : '✦ NORMAL UNIVERSE'}</p>
                    <h2 className={`${styles.title} ${styles.glitch}`}>{pt ? 'Entrar' : 'Sign In'}</h2>
                    <p className={styles.subtitle}>
                      {pt ? 'Acesse sua conta no universo conhecido' : 'Access your account in the known universe'}
                    </p>
                  </header>
                  <form className={styles.form} onSubmit={handleLogin} noValidate>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="login-email">E-mail</label>
                      <input
                        id="login-email"
                        className={`${styles.input} ${styles.inputNormal}`}
                        type="email"
                        placeholder={pt ? 'seu@email.com' : 'you@email.com'}
                        autoComplete="email"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <div className={styles.labelRow}>
                        <label className={styles.label} htmlFor="login-password">{pt ? 'Senha' : 'Password'}</label>
                        <button
                          type="button"
                          className={styles.forgotLink}
                          onClick={() => { setView('forgot'); setForgotStatus(null); setForgotEmail(loginEmail) }}
                        >
                          {pt ? 'Esqueceu a senha?' : 'Forgot password?'}
                        </button>
                      </div>
                      <div className={styles.inputWrap}>
                        <input
                          id="login-password"
                          className={`${styles.input} ${styles.inputNormal} ${styles.inputWithToggle}`}
                          type={showLoginPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          value={loginPassword}
                          onChange={e => setLoginPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className={styles.toggle}
                          onClick={() => setShowLoginPassword(s => !s)}
                          aria-pressed={showLoginPassword}
                        >
                          {toggleLabel(showLoginPassword)}
                        </button>
                      </div>
                    </div>
                    {loginStatus && (
                      <p className={loginStatus.type === 'success' ? styles.msgSuccess : styles.msgError} role="alert">
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
                  <header className={styles.header}>
                    <p className={styles.tag}>{pt ? '✦ UNIVERSO NORMAL' : '✦ NORMAL UNIVERSE'}</p>
                    <h2 className={styles.title}>{pt ? 'Recuperar Senha' : 'Reset Password'}</h2>
                    <p className={styles.subtitle}>
                      {pt ? 'Enviaremos um link para o seu e-mail' : 'We will send a recovery link to your email'}
                    </p>
                  </header>
                  <form className={styles.form} onSubmit={handleForgot}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="forgot-email">E-mail</label>
                      <input
                        id="forgot-email"
                        className={`${styles.input} ${styles.inputNormal}`}
                        type="email"
                        placeholder={pt ? 'seu@email.com' : 'you@email.com'}
                        autoComplete="email"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                    {forgotStatus && (
                      <p className={forgotStatus.type === 'success' ? styles.msgSuccess : styles.msgError} role="alert">
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
          <div className={`${styles.panel} ${!isRegister ? styles.panelInactive : ''}`} aria-hidden={!isRegister}>
            <div className={styles.content} key="register">
              <header className={styles.header}>
                <p className={styles.tagAnti}>{pt ? '⟷ ANTI-UNIVERSO' : '⟷ ANTI-UNIVERSE'}</p>
                <h2 className={`${styles.titleAnti} ${styles.glitchAnti}`}>{pt ? 'Criar Conta' : 'Register'}</h2>
                <p className={styles.subtitle}>
                  {pt ? 'Adentre o anti-universo pela primeira vez' : 'Enter the anti-universe for the first time'}
                </p>
              </header>
              <form className={styles.form} onSubmit={handleRegister} noValidate>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="reg-username">{pt ? 'Nome de usuário' : 'Username'}</label>
                  <input
                    id="reg-username"
                    ref={regRefs.username}
                    className={`${styles.input} ${styles.inputAnti} ${regErrors.username ? styles.inputInvalid : ''}`}
                    type="text"
                    placeholder={pt ? 'Ex.: Yui-chan' : 'E.g. Yui-chan'}
                    autoComplete="username"
                    value={regUsername}
                    onChange={e => changeRegField('username', e.target.value)}
                    onBlur={() => checkField('username')}
                    aria-invalid={!!regErrors.username}
                    aria-describedby="reg-username-help"
                  />
                  <p id="reg-username-help" className={regErrors.username ? styles.fieldError : styles.hint}>
                    {regErrors.username ?? (pt ? '3 a 24 caracteres: letras, números, _ ou -' : '3 to 24 characters: letters, numbers, _ or -')}
                  </p>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="reg-email">E-mail</label>
                  <input
                    id="reg-email"
                    ref={regRefs.email}
                    className={`${styles.input} ${styles.inputAnti} ${regErrors.email ? styles.inputInvalid : ''}`}
                    type="email"
                    placeholder={pt ? 'seu@email.com' : 'you@email.com'}
                    autoComplete="email"
                    value={regEmail}
                    onChange={e => changeRegField('email', e.target.value)}
                    onBlur={() => checkField('email')}
                    aria-invalid={!!regErrors.email}
                    aria-describedby={regErrors.email ? 'reg-email-error' : undefined}
                  />
                  {regErrors.email && <p id="reg-email-error" className={styles.fieldError}>{regErrors.email}</p>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="reg-password">{pt ? 'Senha' : 'Password'}</label>
                  <div className={styles.inputWrap}>
                    <input
                      id="reg-password"
                      ref={regRefs.password}
                      className={`${styles.input} ${styles.inputAnti} ${styles.inputWithToggle} ${regErrors.password ? styles.inputInvalid : ''}`}
                      type={showRegPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={regPassword}
                      onChange={e => changeRegField('password', e.target.value)}
                      aria-invalid={!!regErrors.password}
                      aria-describedby="reg-password-reqs"
                    />
                    <button
                      type="button"
                      className={`${styles.toggle} ${styles.toggleAnti}`}
                      onClick={() => setShowRegPassword(s => !s)}
                      aria-pressed={showRegPassword}
                    >
                      {toggleLabel(showRegPassword)}
                    </button>
                  </div>
                  <PasswordStrength password={regPassword} />
                  <ul id="reg-password-reqs" className={styles.requirements}>
                    {requirements.map(r => (
                      <li key={r.text} className={r.ok ? styles.reqOk : styles.reqPending}>
                        <span aria-hidden="true">{r.ok ? '✓' : '•'}</span> {r.text}
                      </li>
                    ))}
                  </ul>
                </div>

                {regStatus && (
                  <p className={regStatus.type === 'success' ? styles.msgSuccess : styles.msgError} role="alert">
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
