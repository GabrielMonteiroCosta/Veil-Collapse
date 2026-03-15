'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { tiers } from '@/data/milestones'
import styles from './SupportersRanking.module.css'

interface Supporter {
  rank: number
  name: string
  tier: string
  amount: number | null
  created_at: string
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function SupportersRanking() {
  const { lang }           = useLanguage()
  const [list, setList]    = useState<Supporter[]>([])
  const [loading, setLoading] = useState(true)
  const pt = lang === 'pt'

  useEffect(() => {
    fetch('/api/supporters')
      .then(r => r.json())
      .then(d => { setList(d.supporters ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function tierData(id: string) {
    return tiers.find(t => t.id === id) ?? tiers[0]
  }

  const top3 = list.slice(0, 3)
  const rest  = list.slice(3, 10)

  function fmtAmount(amount: number | null, tierId: string) {
    if (amount) return `R$ ${amount.toLocaleString(pt ? 'pt-BR' : 'en-US', { minimumFractionDigits: 2 })}`
    const td = tierData(tierId)
    return pt ? td.rangePt : td.rangeEn
  }

  return (
    <section className={`section ${styles.section}`} id="apoiadores">
      <div className="section-inner">
        <p className="section-tag">{pt ? '✦ Nossos Heróis' : '✦ Our Heroes'}</p>
        <h2 className="section-title">
          {pt ? 'Ranking de Apoiadores' : 'Supporters Ranking'}
        </h2>
        <p className={styles.intro}>
          {pt
            ? 'Cada apoiador está escrevendo a história deste mundo. Os primeiros a acreditar no projeto ganham um lugar especial — e uma surpresa ao fim do desenvolvimento.'
            : 'Every supporter is writing the history of this world. The first to believe in the project earn a special place — and a surprise at the end of development.'}
        </p>

        {loading ? (
          <div className={styles.loading}>
            <span className={styles.loadingDot} /><span className={styles.loadingDot} /><span className={styles.loadingDot} />
          </div>
        ) : list.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>
              {pt ? '✦ Seja o primeiro a apoiar' : '✦ Be the first to support'}
            </p>
            <p className={styles.emptyText}>
              {pt
                ? 'O ranking ainda está vazio. Os primeiros apoiadores ganharão o posto mais alto e uma recompensa surpresa exclusiva.'
                : 'The ranking is still empty. The first supporters will earn the top position and an exclusive surprise reward.'}
            </p>
          </div>
        ) : (
          <>
            {/* ── Top 3 podium ── */}
            {top3.length > 0 && (
              <div className={styles.podium}>
                {top3.map((s, i) => {
                  const td = tierData(s.tier)
                  return (
                    <div key={s.rank}
                      className={`${styles.podiumCard} ${i === 0 ? styles.podiumFirst : ''}`}
                      style={{ '--pc': td.accent, '--pg': td.accentGlow } as React.CSSProperties}
                    >
                      <div className={styles.podiumGlow} />
                      <span className={styles.podiumMedal}>{MEDALS[i]}</span>
                      <span className={styles.podiumRank} style={{ color: td.accent }}>#{s.rank}</span>
                      <span className={styles.podiumName}
                        style={{ color: td.accent, textShadow: `0 0 8px ${td.accent}, 0 0 24px ${td.accent}, 0 0 48px ${td.accent}, 0 0 80px ${td.accentGlow}` }}>
                        {s.name}
                      </span>
                      <span className={styles.podiumTierBadge}
                        style={{ color: td.accent, borderColor: td.accent + '55', background: td.accentGlow }}>
                        {td.icon} {pt ? td.namePt : td.nameEn}
                      </span>
                      <span className={styles.podiumAmount} style={{ color: td.accent }}>
                        {fmtAmount(s.amount, s.tier)}
                      </span>
                      <span className={styles.podiumDate}>
                        {new Date(s.created_at).toLocaleDateString(pt ? 'pt-BR' : 'en-US', { month: 'short', year: 'numeric' })}
                      </span>
                      <div className={styles.podiumPrize}>
                        <span className={styles.prizeIcon}>🎁</span>
                        <span className={styles.prizeText}>
                          {pt ? 'Prêmio surpresa' : 'Mystery prize'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── Rest of list ── */}
            {rest.length > 0 && (
              <div className={styles.listWrap}>
                {rest.map(s => {
                  const td = tierData(s.tier)
                  return (
                    <div key={s.rank} className={styles.listItem}
                      style={{ '--lc': td.accent } as React.CSSProperties}>
                      <span className={styles.listRank} style={{ color: td.accent }}>#{s.rank}</span>
                      <span className={styles.listName}
                        style={{ color: td.accent, textShadow: `0 0 10px ${td.accentGlow}` }}>
                        {s.name}
                      </span>
                      <span className={styles.listTier}
                        style={{ color: td.accent, borderColor: td.accent + '44', background: td.accentGlow }}>
                        {td.icon} {pt ? td.namePt : td.nameEn}
                      </span>
                      <span className={styles.listAmount} style={{ color: td.accent }}>
                        {fmtAmount(s.amount, s.tier)}
                      </span>
                      <span className={styles.listDate}>
                        {new Date(s.created_at).toLocaleDateString(pt ? 'pt-BR' : 'en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        <p className={styles.disclaimer}>
          {pt
            ? '✦ O ranking é ordenado por tier de apoio e data. Os 3 primeiros receberão uma recompensa exclusiva ao lançamento do jogo.'
            : '✦ The ranking is sorted by support tier and date. The top 3 will receive an exclusive reward at the game\'s launch.'}
        </p>
      </div>
    </section>
  )
}
