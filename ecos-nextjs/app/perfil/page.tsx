'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import styles from './Perfil.module.css'

type Status = { type: 'success' | 'error'; message: string } | null

export default function PerfilPage() {
  const { user, setUser, logout } = useAuth()
  const router = useRouter()

  const [newEmail, setNewEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<Status>(null)
  const [emailLoading, setEmailLoading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStatus, setPasswordStatus] = useState<Status>(null)
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    if (user) setNewEmail(user.email)
  }, [user])

  // Redirect to home if not logged in (after context loads)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) router.replace('/')
    }, 500)
    return () => clearTimeout(timer)
  }, [user, router])

  if (!user) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingDot} />
      </div>
    )
  }

  async function handleEmailUpdate(e: React.FormEvent) {
    e.preventDefault()
    setEmailStatus(null)
    setEmailLoading(true)
    try {
      const res = await fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'email', value: newEmail }),
      })
      const data = await res.json()
      if (!res.ok) {
        setEmailStatus({ type: 'error', message: data.error })
      } else {
        setUser({ ...user!, email: data.email })
        setEmailStatus({ type: 'success', message: 'E-mail atualizado com sucesso!' })
      }
    } catch {
      setEmailStatus({ type: 'error', message: 'Erro de conexão' })
    } finally {
      setEmailLoading(false)
    }
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault()
    setPasswordStatus(null)
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'As senhas não coincidem' })
      return
    }
    setPasswordLoading(true)
    try {
      const res = await fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'password', currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPasswordStatus({ type: 'error', message: data.error })
      } else {
        setPasswordStatus({ type: 'success', message: 'Senha alterada com sucesso!' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch {
      setPasswordStatus({ type: 'error', message: 'Erro de conexão' })
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} />

      <div className={styles.container}>
        <a href="/" className={styles.backLink}>← Voltar</a>

        <div className={styles.header}>
          <div className={styles.avatar}>{user.username[0].toUpperCase()}</div>
          <div>
            <h1 className={styles.username}>{user.username}</h1>
            <p className={styles.emailDisplay}>{user.email}</p>
          </div>
        </div>

        <div className={styles.cards}>

          {/* Email card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span className={styles.cardIcon}>✉</span>
              Alterar E-mail
            </h2>
            <form onSubmit={handleEmailUpdate} className={styles.form}>
              <label className={styles.label}>Novo e-mail</label>
              <input
                className={styles.input}
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                required
              />
              {emailStatus && (
                <p className={emailStatus.type === 'success' ? styles.msgSuccess : styles.msgError}>
                  {emailStatus.message}
                </p>
              )}
              <button type="submit" className={styles.btn} disabled={emailLoading}>
                {emailLoading ? 'Salvando...' : 'Salvar e-mail'}
              </button>
            </form>
          </div>

          {/* Password card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span className={styles.cardIcon}>🔒</span>
              Alterar Senha
            </h2>
            <form onSubmit={handlePasswordUpdate} className={styles.form}>
              <label className={styles.label}>Senha atual</label>
              <input
                className={styles.input}
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <label className={styles.label}>Nova senha</label>
              <input
                className={styles.input}
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                required
              />
              <label className={styles.label}>Confirmar nova senha</label>
              <input
                className={styles.input}
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              {passwordStatus && (
                <p className={passwordStatus.type === 'success' ? styles.msgSuccess : styles.msgError}>
                  {passwordStatus.message}
                </p>
              )}
              <button type="submit" className={styles.btn} disabled={passwordLoading}>
                {passwordLoading ? 'Salvando...' : 'Alterar senha'}
              </button>
            </form>
          </div>

        </div>

        <div className={styles.danger}>
          <button className={styles.logoutBtn} onClick={() => { logout(); router.replace('/') }}>
            ↩ Sair da conta
          </button>
        </div>
      </div>
    </div>
  )
}
