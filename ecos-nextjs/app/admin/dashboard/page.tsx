'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import styles from './page.module.css'

type Stats = {
  users: number
  donations: {
    total: number
    confirmed: number
    pending: number
    rejected: number
    total_raised: number
  }
  waitlist: number
}

export default function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    if (loading) return
    if (!user?.is_admin) { router.replace('/'); return }
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
  }, [loading, user?.id])

  if (loading || !user?.is_admin) return null

  function fmtBRL(val: number) {
    const parts = Number(val).toFixed(2).split('.')
    const int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `R$\u00a0${int},${parts[1]}`
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.breadcrumb}>Admin</p>
          <h1 className={styles.title}>✦ Dashboard</h1>
        </div>
        <div className={styles.headerLinks}>
          <a href="/admin/doacoes" className={styles.navLink}>Doações</a>
          <a href="/admin/notificacoes" className={styles.navLink}>Notificações</a>
          <a href="/" className={styles.backBtn}>← Voltar ao site</a>
        </div>
      </div>

      {!stats ? (
        <p className={styles.loading}>Carregando métricas...</p>
      ) : (
        <div className={styles.grid}>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Usuários cadastrados</p>
            <p className={styles.cardValue}>{stats.users}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Waitlist</p>
            <p className={styles.cardValue}>{stats.waitlist}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Total arrecadado</p>
            <p className={`${styles.cardValue} ${styles.gold}`}>{fmtBRL(stats.donations.total_raised)}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Doações confirmadas</p>
            <p className={`${styles.cardValue} ${styles.green}`}>{stats.donations.confirmed}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Doações pendentes</p>
            <p className={`${styles.cardValue} ${styles.yellow}`}>{stats.donations.pending}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Doações rejeitadas</p>
            <p className={`${styles.cardValue} ${styles.red}`}>{stats.donations.rejected}</p>
          </div>
        </div>
      )}
    </div>
  )
}
