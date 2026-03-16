'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import styles from './page.module.css'

type Donation = {
  id: number
  name: string
  email: string
  tier: 'apoiador' | 'criador' | 'lenda'
  amount: number | null
  status: 'pending' | 'confirmed' | 'rejected'
  npc_name: string | null
  npc_description: string | null
  item_name: string | null
  item_description: string | null
  quest_name: string | null
  quest_description: string | null
  message: string | null
  created_at: string
}

const TIER_LABEL = { apoiador: 'Apoiador', criador: 'Criador', lenda: 'Lenda' }
const TIER_COLOR = { apoiador: '#60b0ff', criador: '#f0c040', lenda: '#c06aff' }
const STATUS_LABEL = { pending: 'Pendente', confirmed: 'Confirmado', rejected: 'Rejeitado' }

export default function AdminDoacoesPage() {
  const { user } = useAuth()
  const router   = useRouter()

  const [donations,   setDonations]  = useState<Donation[]>([])
  const [filter,      setFilter]     = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all')
  const [expanded,    setExpanded]   = useState<number | null>(null)
  const [authReady,   setAuthReady]  = useState(false)
  const [loading,     setLoading]    = useState(false)
  const [updating,    setUpdating]   = useState<number | null>(null)
  const [fetchError,  setFetchError] = useState<string | null>(null)

  // Wait for AuthContext to resolve before redirecting or fetching
  useEffect(() => {
    // AuthContext starts user as null — only act after /api/auth/me finishes
    // We detect this by checking if user changed from initial null after a tick
    const t = setTimeout(() => setAuthReady(true), 300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!authReady) return
    if (!user?.is_admin) { router.replace('/'); return }

    setLoading(true)
    setFetchError(null)
    fetch('/api/admin/donations')
      .then(async r => {
        const d = await r.json()
        if (!r.ok) { setFetchError(`Erro ${r.status}: ${d.error ?? 'desconhecido'}`); return }
        setDonations(d.donations ?? [])
      })
      .catch(e => setFetchError(`Erro de rede: ${e.message}`))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, user?.id])

  async function updateStatus(id: number, status: 'confirmed' | 'rejected' | 'pending') {
    setUpdating(id)
    await fetch('/api/admin/donations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setDonations(prev => prev.map(d => d.id === id ? { ...d, status } : d))
    setUpdating(null)
  }

  if (!authReady || !user?.is_admin) return null

  const counts = {
    all:       donations.length,
    pending:   donations.filter(d => d.status === 'pending').length,
    confirmed: donations.filter(d => d.status === 'confirmed').length,
    rejected:  donations.filter(d => d.status === 'rejected').length,
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.breadcrumb}>Admin</p>
          <h1 className={styles.title}>✦ Doações</h1>
        </div>
        <a href="/" className={styles.backBtn}>← Voltar ao site</a>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {(['all', 'pending', 'confirmed', 'rejected'] as const).map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Todas' : STATUS_LABEL[f]}
            <span className={styles.filterCount}>
              {f === 'all' ? donations.length : counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {fetchError && (
        <p className={styles.empty} style={{ color: '#f06070' }}>{fetchError}</p>
      )}

      {loading ? (
        <p className={styles.empty}>Carregando...</p>
      ) : !fetchError && donations.length === 0 ? (
        <p className={styles.empty}>Nenhuma doação encontrada.</p>
      ) : (
        <div className={styles.list}>
          {donations.filter(d => filter === 'all' || d.status === filter).map(d => (
            <div key={d.id} className={`${styles.card} ${styles[`status_${d.status}`]}`}>
              <div className={styles.cardMain} onClick={() => setExpanded(expanded === d.id ? null : d.id)}>

                {/* Left info */}
                <div className={styles.cardInfo}>
                  <span className={styles.tierBadge} style={{ color: TIER_COLOR[d.tier], borderColor: TIER_COLOR[d.tier] + '55' }}>
                    {TIER_LABEL[d.tier]}
                  </span>
                  <p className={styles.donorName}>{d.name}</p>
                  <p className={styles.donorEmail}>{d.email}</p>
                  <p className={styles.donorDate}>{new Date(d.created_at).toLocaleString('pt-BR')}</p>
                </div>

                {/* Center amount */}
                <div className={styles.cardAmount}>
                  {d.amount
                    ? <span className={styles.amount}>R$ {Number(d.amount).toFixed(2).replace('.', ',')}</span>
                    : <span className={styles.amountNone}>Valor não informado</span>
                  }
                  <span className={`${styles.statusBadge} ${styles[`sb_${d.status}`]}`}>
                    {STATUS_LABEL[d.status]}
                  </span>
                </div>

                {/* Right actions */}
                <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                  {d.status !== 'confirmed' && (
                    <button
                      className={styles.btnConfirm}
                      disabled={updating === d.id}
                      onClick={() => updateStatus(d.id, 'confirmed')}
                    >
                      {updating === d.id ? '...' : '✓ Confirmar'}
                    </button>
                  )}
                  {d.status !== 'rejected' && (
                    <button
                      className={styles.btnReject}
                      disabled={updating === d.id}
                      onClick={() => updateStatus(d.id, 'rejected')}
                    >
                      {updating === d.id ? '...' : '✕ Rejeitar'}
                    </button>
                  )}
                  {d.status !== 'pending' && (
                    <button
                      className={styles.btnPending}
                      disabled={updating === d.id}
                      onClick={() => updateStatus(d.id, 'pending')}
                    >
                      ↺ Pendente
                    </button>
                  )}
                  <span className={styles.expandHint}>{expanded === d.id ? '▲' : '▼'} detalhes</span>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === d.id && (
                <div className={styles.details}>
                  {d.npc_name && <Detail label="NPC / Item" value={d.npc_name} />}
                  {d.npc_description && <Detail label="Backstory NPC" value={d.npc_description} />}
                  {d.item_name && <Detail label="Nome do item" value={d.item_name} />}
                  {d.item_description && <Detail label="Descrição do item" value={d.item_description} />}
                  {d.quest_name && <Detail label="Quest" value={d.quest_name} />}
                  {d.quest_description && <Detail label="Descrição da quest" value={d.quest_description} />}
                  {d.message && <Detail label="Mensagem" value={d.message} />}
                  {!d.npc_name && !d.message && !d.quest_name && (
                    <p className={styles.noDetails}>Sem informações adicionais.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  )
}
