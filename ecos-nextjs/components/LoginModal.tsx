'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './LoginModal.module.css'
import { useAuth } from '@/context/AuthContext'
import { validateUsername, validateEmail, validatePassword, passwordChecks, checkPasswordStrength } from '@/lib/validators'

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

const FIELDS: RegField[] = ['username', 'email', 'password']

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
  const loginEmailRef = useRef<HTMLInputElement>(null)

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

  // Foca o primeiro campo sempre que a tela do terminal muda
  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => {
      if (view === 'register') regRefs.username.current?.focus()
      else loginEmailRef.current?.focus()
    }, 50)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, view])

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
          setLoginStatus({ type: 'success', message: pt ? `Acesso concedido. Bem-vindo, ${data.user.username}.` : `Access granted. Welcome, ${data.user.username}.` })
          setTimeout(() => onClose(), 1000)
        }
      }
    } catch {
      setLoginStatus({ type: 'error', message: pt ? 'Falha de conexão' : 'Connection failed' })
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegStatus(null)

    // Valida todos os campos de uma vez e mostra cada erro embaixo do seu campo
    const errors: RegErrors = {}
    for (const field of FIELDS) {
      const err = validators[field](regValues[field])
      if (err) errors[field] = err
    }
    setRegErrors(errors)
    const firstInvalid = FIELDS.find(f => errors[f])
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
        setRegStatus({ type: 'success', message: pt ? 'Agente registrado. Agora é só entrar.' : 'Agent registered. You can sign in now.' })
        setLoginEmail(regEmail)
        setRegUsername('')
        setRegEmail('')
        setRegPassword('')
        setRegErrors({})
      }
    } catch {
      setRegStatus({ type: 'error', message: pt ? 'Falha de conexão' : 'Connection failed' })
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
      setForgotStatus({ type: 'error', message: pt ? 'Falha de conexão' : 'Connection failed' })
    } finally {
      setForgotLoading(false)
    }
  }

  const isRegister = view === 'register'
  const checks = passwordChecks(regPassword)
  const strength = checkPasswordStrength(regPassword)
  const requirements = [
    { ok: checks.length,  text: pt ? '8+ caracteres' : '8+ characters' },
    { ok: checks.upper,   text: pt ? 'letra maiúscula' : 'uppercase letter' },
    { ok: checks.number,  text: pt ? 'número' : 'number' },
    { ok: checks.special, text: pt ? 'caractere especial' : 'special character' },
  ]

  const toggleLabel = (shown: boolean) => shown ? (pt ? 'ocultar' : 'hide') : (pt ? 'mostrar' : 'show')
  const title = isRegister
    ? (pt ? 'E.C.O // REGISTRO DE AGENTE' : 'E.C.O // AGENT REGISTRATION')
    : view === 'forgot'
      ? (pt ? 'E.C.O // RECUPERAR ACESSO' : 'E.C.O // ACCESS RECOVERY')
      : (pt ? 'E.C.O // TERMINAL DE ACESSO' : 'E.C.O // ACCESS TERMINAL')

  function StatusLine({ status }: { status: Status }) {
    if (!status) return null
    return (
      <p className={status.type === 'success' ? styles.outOk : styles.outError} role="alert">
        {status.type === 'success' ? '✓ ' : '✗ '}{status.message}
      </p>
    )
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={`${styles.terminal} ${isRegister ? styles.anti : ''}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.titleBar}>
          <span className={styles.dots} aria-hidden="true">
            <span className={styles.dotRed} /><span className={styles.dotGold} /><span className={styles.dotGreen} />
          </span>
          <span className={styles.titleText}>{title}</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label={pt ? 'Fechar' : 'Close'}>×</button>
        </div>

        <div className={styles.screen} key={view}>
          <div className={styles.scanlines} aria-hidden="true" />

          {view === 'login' && (
            <>
              <p className={styles.boot}>{pt ? '> conexão segura estabelecida' : '> secure connection established'}</p>
              <p className={styles.command}>{pt ? '> identificar_agente' : '> identify_agent'}</p>
              <form className={styles.form} onSubmit={handleLogin} noValidate>
                <div className={styles.row}>
                  <label className={styles.prompt} htmlFor="login-email">email:</label>
                  <input
                    id="login-email"
                    ref={loginEmailRef}
                    className={styles.input}
                    type="email"
                    placeholder={pt ? 'seu@email.com' : 'you@email.com'}
                    autoComplete="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.row}>
                  <label className={styles.prompt} htmlFor="login-password">{pt ? 'senha:' : 'password:'}</label>
                  <input
                    id="login-password"
                    className={styles.input}
                    type={showLoginPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                  />
                  <button type="button" className={styles.toggle} onClick={() => setShowLoginPassword(s => !s)} aria-pressed={showLoginPassword}>
                    [{toggleLabel(showLoginPassword)}]
                  </button>
                </div>
                <StatusLine status={loginStatus} />
                <button type="submit" className={styles.submit} disabled={loginLoading}>
                  {loginLoading ? (pt ? '[ AUTENTICANDO... ]' : '[ AUTHENTICATING... ]') : (pt ? '[ ENTRAR ]' : '[ SIGN IN ]')}
                </button>
              </form>
              <div className={styles.links}>
                <p>
                  {pt ? '> novo agente? ' : '> new agent? '}
                  <button className={styles.link} onClick={() => setView('register')}>{pt ? 'registrar' : 'register'}</button>
                </p>
                <p>
                  {pt ? '> esqueceu a senha? ' : '> forgot password? '}
                  <button className={styles.link} onClick={() => { setView('forgot'); setForgotStatus(null); setForgotEmail(loginEmail) }}>
                    {pt ? 'recuperar_acesso' : 'recover_access'}
                  </button>
                </p>
              </div>
            </>
          )}

          {view === 'forgot' && (
            <>
              <p className={styles.boot}>{pt ? '> enviaremos um link de recuperação para o seu e-mail' : '> a recovery link will be sent to your email'}</p>
              <p className={styles.command}>{pt ? '> recuperar_acesso' : '> recover_access'}</p>
              <form className={styles.form} onSubmit={handleForgot}>
                <div className={styles.row}>
                  <label className={styles.prompt} htmlFor="forgot-email">email:</label>
                  <input
                    id="forgot-email"
                    ref={loginEmailRef}
                    className={styles.input}
                    type="email"
                    placeholder={pt ? 'seu@email.com' : 'you@email.com'}
                    autoComplete="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <StatusLine status={forgotStatus} />
                <button type="submit" className={styles.submit} disabled={forgotLoading}>
                  {forgotLoading ? (pt ? '[ ENVIANDO... ]' : '[ SENDING... ]') : (pt ? '[ ENVIAR LINK ]' : '[ SEND LINK ]')}
                </button>
              </form>
              <div className={styles.links}>
                <p>
                  {'> '}
                  <button className={styles.link} onClick={() => setView('login')}>{pt ? 'voltar_ao_login' : 'back_to_login'}</button>
                </p>
              </div>
            </>
          )}

          {view === 'register' && (
            <>
              <p className={styles.boot}>{pt ? '> sinal do anti-universo detectado' : '> anti-universe signal detected'}</p>
              <p className={styles.command}>{pt ? '> registrar_agente' : '> register_agent'}</p>
              <form className={styles.form} onSubmit={handleRegister} noValidate>
                <div className={styles.field}>
                  <div className={`${styles.row} ${regErrors.username ? styles.rowInvalid : ''}`}>
                    <label className={styles.prompt} htmlFor="reg-username">{pt ? 'usuário:' : 'username:'}</label>
                    <input
                      id="reg-username"
                      ref={regRefs.username}
                      className={styles.input}
                      type="text"
                      placeholder="Yui-chan"
                      autoComplete="username"
                      value={regUsername}
                      onChange={e => changeRegField('username', e.target.value)}
                      onBlur={() => checkField('username')}
                      aria-invalid={!!regErrors.username}
                      aria-describedby="reg-username-help"
                    />
                  </div>
                  <p id="reg-username-help" className={regErrors.username ? styles.fieldError : styles.hint}>
                    {regErrors.username
                      ? `! ${regErrors.username}`
                      : (pt ? '# 3 a 24 caracteres: letras, números, _ ou -' : '# 3 to 24 characters: letters, numbers, _ or -')}
                  </p>
                </div>

                <div className={styles.field}>
                  <div className={`${styles.row} ${regErrors.email ? styles.rowInvalid : ''}`}>
                    <label className={styles.prompt} htmlFor="reg-email">email:</label>
                    <input
                      id="reg-email"
                      ref={regRefs.email}
                      className={styles.input}
                      type="email"
                      placeholder={pt ? 'seu@email.com' : 'you@email.com'}
                      autoComplete="email"
                      value={regEmail}
                      onChange={e => changeRegField('email', e.target.value)}
                      onBlur={() => checkField('email')}
                      aria-invalid={!!regErrors.email}
                      aria-describedby={regErrors.email ? 'reg-email-error' : undefined}
                    />
                  </div>
                  {regErrors.email && <p id="reg-email-error" className={styles.fieldError}>! {regErrors.email}</p>}
                </div>

                <div className={styles.field}>
                  <div className={`${styles.row} ${regErrors.password ? styles.rowInvalid : ''}`}>
                    <label className={styles.prompt} htmlFor="reg-password">{pt ? 'senha:' : 'password:'}</label>
                    <input
                      id="reg-password"
                      ref={regRefs.password}
                      className={styles.input}
                      type={showRegPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={regPassword}
                      onChange={e => changeRegField('password', e.target.value)}
                      aria-invalid={!!regErrors.password}
                      aria-describedby="reg-password-reqs"
                    />
                    <button type="button" className={styles.toggle} onClick={() => setShowRegPassword(s => !s)} aria-pressed={showRegPassword}>
                      [{toggleLabel(showRegPassword)}]
                    </button>
                  </div>
                  <ul id="reg-password-reqs" className={styles.requirements}>
                    {requirements.map(r => (
                      <li key={r.text} className={r.ok ? styles.reqOk : styles.reqPending}>
                        [{r.ok ? '✓' : ' '}] {r.text}
                      </li>
                    ))}
                  </ul>
                  {regPassword && (
                    <p className={styles.hint}>
                      {pt ? '# força: ' : '# strength: '}
                      <span style={{ color: strength.color }}>{strength.label}</span>
                    </p>
                  )}
                </div>

                <StatusLine status={regStatus} />
                <button type="submit" className={styles.submit} disabled={regLoading}>
                  {regLoading ? (pt ? '[ REGISTRANDO... ]' : '[ REGISTERING... ]') : (pt ? '[ REGISTRAR ]' : '[ REGISTER ]')}
                </button>
              </form>
              <div className={styles.links}>
                <p>
                  {pt ? '> já é agente? ' : '> already an agent? '}
                  <button className={styles.link} onClick={() => setView('login')}>{pt ? 'entrar' : 'sign_in'}</button>
                </p>
              </div>
            </>
          )}

          <p className={styles.cursorLine} aria-hidden="true">&gt; <span className={styles.cursor}>_</span></p>
        </div>
      </div>
    </div>
  )
}
