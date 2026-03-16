'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import {
  milestones, tiers,
  DONE_COUNT, TOTAL, PROGRESS_PCT,
  type TierId,
} from '@/data/milestones'
import DonationModal from './DonationModal'
import styles from './SupportSection.module.css'

export default function SupportSection() {
  const { lang }                          = useLanguage()
  const [activeTier, setActiveTier]       = useState<TierId | null>(null)
  const timelineRef                        = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx]         = useState<number | null>(null)

  // Auto-scroll timeline to active milestone (horizontal only, sem mover a página)
  useEffect(() => {
    const activeMs = milestones.findIndex(m => m.status === 'active')
    if (activeMs < 0 || !timelineRef.current) return
    const container = timelineRef.current.querySelector('[class*="timelineScroll"]') as HTMLElement | null
    const dots      = timelineRef.current.querySelectorAll('[data-ms]')
    const dot       = dots[activeMs] as HTMLElement | undefined
    if (!container || !dot) return
    setTimeout(() => {
      const dotCenter   = dot.offsetLeft + dot.offsetWidth / 2
      const scrollLeft  = dotCenter - container.clientWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }, 600)
  }, [])

  const pt = lang === 'pt'

  return (
    <>
      <section className={`section ${styles.section}`} id="apoie">
        <div className="section-inner">

          {/* ── Heading ── */}
          <p className="section-tag">{pt ? '✦ Apoie o Jogo' : '✦ Support the Game'}</p>
          <h2 className="section-title">
            {pt ? 'Faça parte da história' : 'Be part of the story'}
          </h2>
          <p className={styles.intro}>
            {pt
              ? 'Ecos de um Mundo Quebrado é desenvolvido de forma independente com muito amor. Cada apoio ajuda a expandir o mundo, criar novas histórias e trazer o jogo mais perto do lançamento.'
              : 'Echoes of a Broken World is developed independently with great love. Every contribution helps expand the world, create new stories and bring the game closer to launch.'}
          </p>

          {/* ── Progress bar ── */}
          <div className={styles.progressWrap}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>
                {pt ? `${DONE_COUNT} de ${TOTAL} marcos concluídos` : `${DONE_COUNT} of ${TOTAL} milestones complete`}
              </span>
              <span className={styles.progressPct}>{PROGRESS_PCT}%</span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${PROGRESS_PCT}%` }} />
              <div className={styles.progressGlow} style={{ left: `${PROGRESS_PCT}%` }} />
            </div>
          </div>

          {/* ── Timeline ── */}
          <div className={styles.timelineOuter} ref={timelineRef}>
            <div className={styles.timelineLine} />
            <div className={styles.timelineScroll}>
              {milestones.map((m, i) => (
                <button
                  key={m.id}
                  data-ms={i}
                  className={`${styles.msItem} ${
                    m.status === 'done'    ? styles.msDone    :
                    m.status === 'active'  ? styles.msActive  : styles.msPlanned
                  } ${activeIdx === i ? styles.msExpanded : ''}`}
                  style={{ '--ms-ac': m.accent } as React.CSSProperties}
                  onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                  aria-expanded={activeIdx === i}
                >
                  <div className={styles.msDot}>
                    {m.status === 'done'   && <span className={styles.msDotCheck}>✓</span>}
                    {m.status === 'active' && <span className={styles.msDotPulse} />}
                    <span className={styles.msIcon}>{m.icon}</span>
                  </div>

                  <div className={styles.msMeta}>
                    <span className={styles.msDate}>{m.date}</span>
                    <span className={styles.msTitle}>
                      {pt ? m.titlePt : m.titleEn}
                    </span>
                    {m.isCity && (
                      <span className={styles.msCityTag}>
                        {pt ? 'Cidade' : 'City'}
                      </span>
                    )}
                  </div>

                  {activeIdx === i && (
                    <p className={styles.msDesc}>
                      {pt ? m.descPt : m.descEn}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tiers ── */}
          <div className={styles.tiersWrap}>
            <h3 className={styles.tiersHeading}>
              {pt ? '✦ Escolha como apoiar' : '✦ Choose how to support'}
            </h3>
            <p className={styles.tiersSub}>
              {pt
                ? 'Ao apoiar o projeto, seu nome vai nos créditos e você recebe recompensas exclusivas dentro do jogo.'
                : 'By supporting the project, your name goes in the credits and you receive exclusive in-game rewards.'}
            </p>
            <div className={styles.tiersGrid}>
              {tiers.map(tier => (
                <div
                  key={tier.id}
                  className={`${styles.tierCard} ${'highlight' in tier && tier.highlight ? styles.tierHighlight : ''}`}
                  style={{ '--tc': tier.accent, '--tg': tier.accentGlow } as React.CSSProperties}
                >
                  {'highlight' in tier && tier.highlight && (
                    <span className={styles.tierPopular}>
                      {pt ? 'Mais popular' : 'Most popular'}
                    </span>
                  )}

                  <div className={styles.tierTop}>
                    <span className={styles.tierIcon}
                      style={{ filter: `drop-shadow(0 0 10px ${tier.accentGlow})` }}>
                      {tier.icon}
                    </span>
                    <div>
                      <p className={styles.tierName} style={{ color: tier.accent }}>
                        {pt ? tier.namePt : tier.nameEn}
                      </p>
                      <p className={styles.tierRange} style={{ color: tier.accent + 'aa' }}>
                        {pt ? tier.rangePt : tier.rangeEn}
                      </p>
                    </div>
                  </div>

                  <ul className={styles.tierRewards}>
                    {(pt ? tier.rewardsPt : tier.rewardsEn).map((r, i) => (
                      <li key={i} className={styles.tierReward}>
                        <span className={styles.tierRewardDot}
                          style={{ background: tier.accent, boxShadow: `0 0 6px ${tier.accentGlow}` }} />
                        {r}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={styles.tierBtn}
                    style={{ background: tier.accent, color: '#05091a' }}
                    onClick={() => setActiveTier(tier.id)}
                  >
                    {pt ? 'Apoiar agora' : 'Support now'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Disclaimer ── */}
          <p className={styles.disclaimer}>
            {pt
              ? '✦ Todas as doações são voluntárias. Após confirmação do pagamento, entraremos em contato para incluir seu conteúdo no jogo.'
              : '✦ All donations are voluntary. After payment confirmation, we will contact you to include your content in the game.'}
          </p>
        </div>
      </section>

      <DonationModal tierId={activeTier} lang={lang} onClose={() => setActiveTier(null)} />
    </>
  )
}
