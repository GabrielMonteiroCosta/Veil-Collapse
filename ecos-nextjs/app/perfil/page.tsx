'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Nav from '@/components/Nav'
import PasswordStrength from '@/components/PasswordStrength'
import styles from './Perfil.module.css'
import { validateUsername, validateEmail, validatePassword } from '@/lib/validators'

type Status = { type: 'success' | 'error'; message: string } | null

type Badge = { badge_id: string; awarded_at: string }

const BADGE_DATA: Record<string, { icon: string; namePt: string; nameEn: string; descPt: string; descEn: string; rarity: 'common' | 'rare' }> = {
  welcome: {
    icon: '✦',
    namePt: 'Primeiro Contato',
    nameEn: 'First Contact',
    descPt: 'Cruzou o rift pela primeira vez.',
    descEn: 'Crossed the rift for the first time.',
    rarity: 'common',
  },
  pioneer: {
    icon: '◈',
    namePt: 'Pioneiro',
    nameEn: 'Pioneer',
    descPt: 'Um dos primeiros 100 exploradores.',
    descEn: 'One of the first 100 explorers.',
    rarity: 'rare',
  },
}

const AVATAR_OPTIONS = ['⚔️', '🌟', '🌙', '⚓', '⚙️', '🔬', '👑', '🌿', '🥊', '📖', '🗡️', '🔮', '🛡️', '⚡']

export default function PerfilPage() {
  const { user, setUser, logout, loading } = useAuth()
  const router = useRouter()

  const [newUsername, setNewUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<Status>(null)
  const [usernameLoading, setUsernameLoading] = useState(false)

  const [newEmail, setNewEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<Status>(null)
  const [emailLoading, setEmailLoading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStatus, setPasswordStatus] = useState<Status>(null)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const [badges, setBadges] = useState<Badge[]>([])
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setNewEmail(user.email)
      setNewUsername(user.username)
    }
  }, [user])

  useEffect(() => {
    if (loading) return
    if (!user) router.replace('/')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    fetch('/api/badges')
      .then(r => r.json())
      .then(d => setBadges(d.badges ?? []))
      .catch(() => {})
  }, [user])

  if (loading || !user) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingDots}>
          <span /><span /><span />
        </div>
      </div>
    )
  }

  async function handleUsernameUpdate(e: React.FormEvent) {
    e.preventDefault()
    setUsernameStatus(null)
    const err = validateUsername(newUsername)
    if (err) { setUsernameStatus({ type: 'error', message: err }); return }
    setUsernameLoading(true)
    try {
      const res = await fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'username', value: newUsername }),
      })
      const data = await res.json()
      if (!res.ok) {
        setUsernameStatus({ type: 'error', message: data.error })
      } else {
        setUser({ ...user!, username: data.username })
        setUsernameStatus({ type: 'success', message: 'Nome atualizado!' })
      }
    } catch {
      setUsernameStatus({ type: 'error', message: 'Erro de conexão' })
    } finally {
      setUsernameLoading(false)
    }
  }

  async function handleEmailUpdate(e: React.FormEvent) {
    e.preventDefault()
    setEmailStatus(null)
    const err = validateEmail(newEmail)
    if (err) { setEmailStatus({ type: 'error', message: err }); return }
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
        setEmailStatus({ type: 'success', message: 'E-mail atualizado!' })
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
    const pwErr = validatePassword(newPassword)
    if (pwErr) { setPasswordStatus({ type: 'error', message: pwErr }); return }
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
        setPasswordStatus({ type: 'success', message: 'Senha alterada!' })
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

  async function handleAvatarSelect(avatar: string | null) {
    setAvatarLoading(true)
    try {
      const res = await fetch('/api/auth/update-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar }),
      })
      const data = await res.json()
      if (res.ok) {
        setUser({ ...user!, avatar: data.avatar })
        setAvatarOpen(false)
      }
    } catch { /* silent */ } finally {
      setAvatarLoading(false)
    }
  }

  const riftId = String(user.id).padStart(4, '0')
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : null

  return (
    <>
      <Nav />
      <div className={styles.page}>

        <div className={styles.bgGlow} />
        <div className={styles.bgCrack} />
        <div className={styles.scanlines} />

        <div className={styles.container}>

          <a href="/" className={styles.backLink}>← Voltar</a>

          {/* ── Header ── */}
          <div className={styles.header}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatarRing} />
              <div className={styles.avatar} onClick={() => setAvatarOpen(true)} title="Alterar avatar">
                {user.avatar ?? user.username[0].toUpperCase()}
              </div>
              <button className={styles.avatarEditBtn} onClick={() => setAvatarOpen(true)}>✎</button>
            </div>
            <div className={styles.headerInfo}>
              <p className={styles.riftId}>✦ RIFT-ID · #{riftId}</p>
              <h1 className={styles.username}>{user.username}</h1>
              <p className={styles.emailDisplay}>{user.email}</p>
              {memberSince && (
                <p className={styles.memberSince}>◈ Membro desde {memberSince}</p>
              )}
              <div className={styles.badges}>
                {!!user.is_admin && (
                  <span className={styles.badgeAdmin}>✦ Admin</span>
                )}
                <span className={styles.badgeMember}>◈ Membro</span>
              </div>
            </div>
          </div>

          {/* ── Avatar picker ── */}
          {avatarOpen && (
            <div className={styles.avatarPickerCard}>
              <p className={styles.sectionLabel}>◈ Escolher Avatar</p>
              <div className={styles.avatarGrid}>
                <button
                  className={`${styles.avatarOption} ${!user.avatar ? styles.avatarOptionActive : ''}`}
                  onClick={() => handleAvatarSelect(null)}
                  disabled={avatarLoading}
                >
                  {user.username[0].toUpperCase()}
                </button>
                {AVATAR_OPTIONS.map(a => (
                  <button
                    key={a}
                    className={`${styles.avatarOption} ${user.avatar === a ? styles.avatarOptionActive : ''}`}
                    onClick={() => handleAvatarSelect(a)}
                    disabled={avatarLoading}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <button className={styles.avatarCancelBtn} onClick={() => setAvatarOpen(false)}>Cancelar</button>
            </div>
          )}

          {/* ── Conquistas ── */}
          {badges.length > 0 && (
            <>
              <div className={styles.sectionLabel}>◈ Conquistas</div>
              <div className={styles.badgesList}>
                {badges.map(b => {
                  const bd = BADGE_DATA[b.badge_id]
                  if (!bd) return null
                  return (
                    <div key={b.badge_id} className={`${styles.badgeCard} ${bd.rarity === 'rare' ? styles.badgeCardRare : ''}`}>
                      <span className={styles.badgeCardIcon}>{bd.icon}</span>
                      <div className={styles.badgeCardInfo}>
                        <p className={styles.badgeCardName}>{bd.namePt}</p>
                        <p className={styles.badgeCardDesc}>{bd.descPt}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* ── Settings ── */}
          <div className={styles.sectionLabel}>⚙ Configurações</div>

          <div className={styles.cards}>

            {/* Username */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={styles.cardIcon}>◈</span>
                Nome de Usuário
              </h2>
              <form onSubmit={handleUsernameUpdate} className={styles.form}>
                <label className={styles.label}>Novo nome</label>
                <input
                  className={styles.input}
                  type="text"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  placeholder="Letras, números e _"
                  minLength={3}
                  maxLength={24}
                  required
                />
                {usernameStatus && (
                  <p className={usernameStatus.type === 'success' ? styles.msgSuccess : styles.msgError}>
                    {usernameStatus.message}
                  </p>
                )}
                <button type="submit" className={styles.btn} disabled={usernameLoading}>
                  {usernameLoading ? 'Salvando...' : 'Salvar nome'}
                </button>
              </form>
            </div>

            {/* Email */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={styles.cardIcon}>✉</span>
                E-mail
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

            {/* Password */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={styles.cardIcon}>🔒</span>
                Senha
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
                  placeholder="Mínimo 8 caracteres"
                  required
                />
                <PasswordStrength password={newPassword} />
                <label className={styles.label}>Confirmar</label>
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

          {/* ── Danger zone ── */}
          <div className={styles.danger}>
            {!logoutConfirm ? (
              <button className={styles.logoutBtn} onClick={() => setLogoutConfirm(true)}>
                ↩ Sair da conta
              </button>
            ) : (
              <div className={styles.logoutConfirm}>
                <span className={styles.logoutConfirmText}>Tem certeza?</span>
                <button
                  className={styles.logoutConfirmYes}
                  onClick={() => { logout(); router.replace('/') }}
                >
                  Sim, sair
                </button>
                <button
                  className={styles.logoutConfirmNo}
                  onClick={() => setLogoutConfirm(false)}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
