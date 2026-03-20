'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { gameClasses, type ClassStats } from '@/data/classes'
import styles from './ClassesSection.module.css'

const BLOCKS = 10

function StatBar({ label, value, accent, rift = false }: {
  label: string
  value: number
  accent: string
  rift?: boolean
}) {
  return (
    <div className={styles.statRow}>
      <span className={styles.statLabel}>{label}</span>
      <div className={styles.statBlocks}>
        {Array.from({ length: BLOCKS }).map((_, i) => (
          <span
            key={i}
            className={`${styles.block} ${i < value ? styles.blockFilled : styles.blockEmpty}`}
            style={i < value
              ? { background: rift ? 'var(--rift-bright)' : accent, boxShadow: `0 0 4px ${rift ? 'var(--rift-glow)' : accent}88` }
              : undefined}
          />
        ))}
      </div>
      <span className={styles.statValue}>{value}</span>
    </div>
  )
}

export default function ClassesSection() {
  const { lang } = useLanguage()
  const pt = lang === 'pt'
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className={`section ${styles.section}`} id="classes">
      <div className="section-inner">

        <div className="section-tag" data-reveal data-delay="0">✦ Gameplay</div>
        <h2 className="section-title" data-reveal data-delay="100">
          {pt ? 'Escolha sua classe' : 'Choose your class'}
        </h2>
        <p className={styles.subtitle} data-reveal data-delay="160">
          {pt
            ? 'Seis caminhos. Nenhuma escolha errada — só consequências diferentes.'
            : 'Six paths. No wrong choice — just different consequences.'}
        </p>

        <div className={styles.grid}>
          {gameClasses.map((cls, i) => {
            const isOpen = openId === cls.id
            return (
              <div
                key={cls.id}
                className={`${styles.card} ${isOpen ? styles.cardOpen : ''}`}
                style={{ '--cls-ac': cls.accent, '--cls-glow': cls.accentGlow } as React.CSSProperties}
                data-reveal
                data-delay={String(i * 80)}
              >
                {/* Beam */}
                <div className={styles.beam} />

                {/* Compact header — always visible */}
                <button
                  className={styles.header}
                  onClick={() => setOpenId(isOpen ? null : cls.id)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.icon}>{cls.icon}</span>
                  <div className={styles.headerText}>
                    <h3 className={styles.name}>{pt ? cls.namePt : cls.nameEn}</h3>
                    <p className={styles.role}>{pt ? cls.rolePt : cls.roleEn}</p>
                  </div>
                  <div className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>

                {/* Expandable details */}
                <div className={`${styles.details} ${isOpen ? styles.detailsOpen : ''}`}>
                  <div className={styles.detailsInner}>

                    <div className={styles.sep} />

                    {/* Description */}
                    <p className={styles.desc}>{pt ? cls.descPt : cls.descEn}</p>

                    {/* Stats */}
                    <div className={styles.stats}>
                      <StatBar label={pt ? 'Força'     : 'Strength'} value={cls.stats.forca}     accent={cls.accent} />
                      <StatBar label={pt ? 'Defesa'    : 'Defense'}  value={cls.stats.defesa}    accent={cls.accent} />
                      <StatBar label={pt ? 'Agilidade' : 'Agility'}  value={cls.stats.agilidade} accent={cls.accent} />
                      <StatBar label={pt ? 'Magia'     : 'Magic'}    value={cls.stats.magia}     accent={cls.accent} />
                      <StatBar label='Rift'                           value={cls.stats.rift}      accent={cls.accent} rift />
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                      <div className={styles.weapons}>
                        {cls.weapons.slice(0, 3).map((w, j) => (
                          <span key={j} className={styles.weapon}>{w}</span>
                        ))}
                        {cls.weapons.length > 3 && (
                          <span className={styles.weaponMore}>+{cls.weapons.length - 3}</span>
                        )}
                      </div>
                      <div className={styles.badges}>
                        <span
                          className={styles.upBadge}
                          style={{ color: cls.accent, borderColor: cls.accent + '55' }}
                        >
                          ↑ {pt ? cls.upPt : cls.upEn}
                        </span>
                        <span
                          className={styles.enchantBadge}
                          style={cls.enchantment
                            ? { color: cls.accent, borderColor: cls.accent + '55' }
                            : { color: '#4a5a7a', borderColor: '#4a5a7a44' }}
                        >
                          {cls.enchantment
                            ? (pt ? '✦ Encantamento' : '✦ Enchantment')
                            : (pt ? '✕ Sem encantamento' : '✕ No enchantment')}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
