'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import PasswordStrength from '@/components/PasswordStrength'
import { validatePassword } from '@/lib/validators'
import styles from './page.module.css'

function ResetForm() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const pwErr = validatePassword(password)
    if (pwErr) { setStatus({ type: 'error', message: pwErr }); return }
    if (password !== confirm) {
      setStatus({ type: 'error', message: 'As senhas não coincidem.' })
      return
    }
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error })
      } else {
        setStatus({ type: 'success', message: 'Senha redefinida com sucesso! Redirecionando...' })
        setTimeout(() => router.push('/'), 2500)
      }
    } catch {
      setStatus({ type: 'error', message: 'Erro de conexão.' })
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className={styles.card}>
        <p className={styles.tag}>✦ UNIVERSO NORMAL</p>
        <h1 className={styles.title}>Link Inválido</h1>
        <p className={styles.subtitle}>Este link de recuperação é inválido ou expirou.</p>
        <button className={styles.btn} onClick={() => router.push('/')}>
          Voltar ao início
        </button>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <p className={styles.tag}>✦ UNIVERSO NORMAL</p>
      <h1 className={styles.title}>Nova Senha</h1>
      <p className={styles.subtitle}>Escolha uma nova senha para sua conta.</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="password"
          placeholder="Nova senha"
          autoComplete="new-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <PasswordStrength password={password} />
        <input
          className={styles.input}
          type="password"
          placeholder="Confirmar nova senha"
          autoComplete="new-password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />
        {status && (
          <p className={status.type === 'success' ? styles.msgSuccess : styles.msgError}>
            {status.message}
          </p>
        )}
        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Nova Senha'}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className={styles.page}>
      <div className={styles.crack} />
      <div className={styles.glow} />
      <Suspense fallback={<div className={styles.card}><p className={styles.subtitle}>Carregando...</p></div>}>
        <ResetForm />
      </Suspense>
    </main>
  )
}
