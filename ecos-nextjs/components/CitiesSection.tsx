'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { cities, statusLabels, themeLabels } from '@/data/cities'
import type { City } from '@/data/cities'
import CityIcon from './CityIcon'
import styles from './CitiesSection.module.css'

const LOCK_MS = 520
const dangerColors  = ['#60d090', '#c8d840', '#e07830', '#e03040']
const dangerLabelPt = ['Segura',  'Baixa',   'Moderada', 'Alta']
const dangerLabelEn = ['Safe',    'Low',     'Moderate', 'High']

function navDir(from: number, to: number): 'right' | 'left' {
  const n = cities.length
  return ((to - from + n) % n) <= n / 2 ? 'right' : 'left'
}

export default function CitiesSection() {
  const { lang } = useLanguage()
  const [idx,     setIdx]     = useState(0)
  const [dir,     setDir]     = useState<'right' | 'left'>('right')
  const [cardKey, setCardKey] = useState(0)
  const [locked,  setLocked]  = useState(false)

  // Two background slots that cross-fade
  const [slot,  setSlot]  = useState<'a' | 'b'>('a')
  const [bgA,   setBgA]   = useState({ cityIdx: 0, opacity: 1 })
  const [bgB,   setBgB]   = useState({ cityIdx: 0, opacity: 0 })

  const touchX   = useRef(0)
  const lockRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const active   = cities[idx]

  const navigate = useCallback((nextIdx: number) => {
    if (locked || nextIdx === idx) return
    if (lockRef.current) clearTimeout(lockRef.current)

    setLocked(true)
    setDir(navDir(idx, nextIdx))
    setCardKey(k => k + 1)

    // Cross-fade backgrounds
    if (slot === 'a') {
      setBgB({ cityIdx: nextIdx, opacity: 1 })
      setTimeout(() => setBgA(p => ({ ...p, opacity: 0 })), 16)
      setSlot('b')
    } else {
      setBgA({ cityIdx: nextIdx, opacity: 1 })
      setTimeout(() => setBgB(p => ({ ...p, opacity: 0 })), 16)
      setSlot('a')
    }

    setIdx(nextIdx)
    lockRef.current = setTimeout(() => setLocked(false), LOCK_MS)
  }, [locked, idx, slot])

  const goNext = useCallback(() => navigate((idx + 1) % cities.length), [navigate, idx])
  const goPrev = useCallback(() => navigate((idx - 1 + cities.length) % cities.length), [navigate, idx])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [goNext, goPrev])

  useEffect(() => () => { if (lockRef.current) clearTimeout(lockRef.current) }, [])

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    const d = touchX.current - e.changedTouches[0].clientX
    if (Math.abs(d) > 50) d > 0 ? goNext() : goPrev()
  }

  function makeBg(cityIdx: number) {
    const c = cities[cityIdx]
    return [
      `radial-gradient(ellipse at 18% 72%, ${c.accentGlow}, transparent 58%)`,
      `radial-gradient(ellipse at 82% 28%, ${c.accentAltGlow}, transparent 58%)`,
      `radial-gradient(ellipse at 50% 50%, ${c.accentGlow.replace('0.3', '0.06')}, transparent 75%)`,
    ].join(', ')
  }

  const cv = { '--ac': active.accent, '--alt': active.accentAlt, '--ag': active.accentGlow } as React.CSSProperties

  return (
    <section className={`section ${styles.section}`} id="cidades">
      <div className="section-inner">
        <p className="section-tag">{lang === 'pt' ? '✦ As Cidades' : '✦ The Cities'}</p>
        <h2 className="section-title">
          {lang === 'pt' ? 'Mundos que coexistem — ou coexistiam' : 'Worlds that coexist — or once did'}
        </h2>
        <p className={styles.intro}>
          {lang === 'pt'
            ? 'Cada cidade carrega uma identidade única. Com a sobreposição dos universos, algumas permanecem intactas, outras foram transformadas — e algumas simplesmente desapareceram do mapa.'
            : 'Each city carries a unique identity. With the overlap, some remain intact, others were transformed — and some simply vanished from the map.'}
        </p>

        {/* ── Carousel ── */}
        <div className={styles.carousel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

          {/* Backgrounds */}
          <div className={styles.bgWrap}>
            <div className={styles.bgLayer} style={{ opacity: bgA.opacity, background: makeBg(bgA.cityIdx) }} />
            <div className={styles.bgLayer} style={{ opacity: bgB.opacity, background: makeBg(bgB.cityIdx) }} />
          </div>

          {/* Arrows */}
          <button className={`${styles.arrow} ${styles.arrowLeft}`} style={cv} onClick={goPrev} aria-label="Anterior">
            <span>◀</span>
          </button>
          <button className={`${styles.arrow} ${styles.arrowRight}`} style={cv} onClick={goNext} aria-label="Próxima">
            <span>▶</span>
          </button>

          {/* Card */}
          <div
            key={cardKey}
            className={`${styles.card} ${dir === 'right' ? styles.enterRight : styles.enterLeft}`}
            style={cv}
          >
            <div className={styles.accentBar}
              style={{ background: `linear-gradient(to right, ${active.accent}, ${active.accentAlt} 55%, transparent)` }} />

            <div className={styles.cardBody}>

              {/* ── Left column ── */}
              <div className={styles.colLeft}>
                <div className={styles.iconWrap}>
                  <div className={styles.iconGlow}
                    style={{ background: `radial-gradient(circle, ${active.accentGlow} 0%, ${active.accentAltGlow} 50%, transparent 75%)` }} />
                  <CityIcon theme={active.theme} color={active.accent} glow={active.accentGlow} size={80} />
                </div>

                <p className={styles.subtitle} style={{ color: active.accentDim }}>
                  {lang === 'pt' ? active.subtitlePt : active.subtitleEn}
                </p>

                <h3 className={styles.cityName}
                  style={{ backgroundImage: `linear-gradient(135deg, ${active.accent} 0%, ${active.accentAlt} 100%)` }}>
                  {lang === 'pt' ? active.namePt : active.nameEn}
                </h3>

                <div className={styles.badgeRow}>
                  <StatusBadge status={active.status} lang={lang} />
                  <span className={styles.themeBadge}
                    style={{ color: active.accentDim, borderColor: active.accent + '45' }}>
                    {lang === 'pt' ? themeLabels[active.theme].pt : themeLabels[active.theme].en}
                  </span>
                </div>

                <div className={styles.traits}>
                  {active.traits.map((t, i) => (
                    <span key={t} className={styles.trait} style={{
                      color:       i % 2 === 0 ? active.accent    : active.accentAlt,
                      borderColor: (i % 2 === 0 ? active.accent    : active.accentAlt) + '45',
                      background:  i % 2 === 0 ? active.accentGlow : active.accentAltGlow,
                      animationDelay: `${0.1 + i * 0.07}s`,
                    }}>
                      {t}
                    </span>
                  ))}
                </div>

                <p className={styles.pop}>
                  <span className={styles.popIcon}>👥</span>
                  {lang === 'pt' ? active.populationPt : active.populationEn}
                </p>
              </div>

              {/* ── Right column ── */}
              <div className={styles.colRight}>
                <p className={styles.desc}>{lang === 'pt' ? active.descPt : active.descEn}</p>

                <div className={styles.statsGrid}>
                  {/* Danger */}
                  <div className={styles.statCard} style={{ animationDelay: '0.18s' }}>
                    <p className={styles.statLabel}>{lang === 'pt' ? '⚠ PERIGO' : '⚠ DANGER'}</p>
                    <p className={styles.dangerText} style={{ color: dangerColors[active.dangerLevel] }}>
                      {lang === 'pt' ? dangerLabelPt[active.dangerLevel] : dangerLabelEn[active.dangerLevel]}
                    </p>
                    <div className={styles.dangerDots}>
                      {[0,1,2,3].map(i => (
                        <span key={i} className={styles.dangerDot}
                          style={i <= active.dangerLevel ? {
                            background: dangerColors[active.dangerLevel],
                            boxShadow:  `0 0 8px ${dangerColors[active.dangerLevel]}`,
                            animationDelay: `${0.28 + i * 0.07}s`,
                          } : {}} />
                      ))}
                    </div>
                  </div>

                  {/* Notable */}
                  <div className={styles.statCard} style={{ animationDelay: '0.24s' }}>
                    <p className={styles.statLabel}>{lang === 'pt' ? '★ DESTAQUE' : '★ NOTABLE'}</p>
                    <p className={styles.notableText} style={{ color: active.accent }}>
                      {lang === 'pt' ? active.notablePt : active.notableEn}
                    </p>
                  </div>

                  {/* Overlap */}
                  <div className={`${styles.statCard} ${styles.statFull}`} style={{ animationDelay: '0.3s' }}>
                    <p className={styles.statLabel}>{lang === 'pt' ? '◈ SOBREPOSIÇÃO' : '◈ OVERLAP'}</p>
                    <OverlapMini active={active} lang={lang} />
                  </div>
                </div>

                {active.echoDescPt && (
                  <div className={styles.echo} style={{ animationDelay: '0.36s' }}>
                    <span className={styles.echoLabel}>
                      ⟷ {lang === 'pt' ? 'ECO DO ANTI-UNIVERSO' : 'ANTI-UNIVERSE ECHO'}
                    </span>
                    <p className={styles.echoText}>
                      {lang === 'pt' ? active.echoDescPt : active.echoDescEn}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className={styles.dots}>
            {cities.map((city, i) => (
              <button key={city.theme}
                className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
                style={i === idx ? { background: active.accent, boxShadow: `0 0 14px ${active.accentGlow}` } : {}}
                onClick={() => navigate(i)}
                aria-label={city.namePt}
              />
            ))}
          </div>

          <p className={styles.swipeHint}>
            {lang === 'pt' ? '← Arraste para navegar →' : '← Swipe to navigate →'}
          </p>
        </div>

        {/* ── Strip ── */}
        <div className={styles.strip}>
          {cities.map((city, i) => (
            <button key={city.theme}
              className={`${styles.stripItem} ${i === idx ? styles.stripActive : ''}`}
              style={i === idx ? {
                borderColor: city.accent,
                background:  city.accentGlow,
                boxShadow:   `0 4px 28px ${city.accentGlow}`,
              } : {}}
              onClick={() => navigate(i)}
            >
              <CityIcon theme={city.theme} color={i === idx ? city.accent : '#6a7a9a'} glow={city.accentGlow} size={22} />
              <span className={styles.stripName} style={{ color: i === idx ? city.accent : undefined }}>
                {lang === 'pt' ? city.namePt : city.nameEn}
              </span>
              <DangerDot level={city.dangerLevel} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Sub-components ── */

function StatusBadge({ status, lang }: { status: City['status']; lang: string }) {
  const c = { intact: '#60d090', overlapped: '#8b3fff', unknown: '#4a5a7a' }[status]
  return (
    <span className={styles.statusBadge} style={{ color: c, borderColor: c + '55' }}>
      {statusLabels[status][lang as 'pt' | 'en']}
    </span>
  )
}

function DangerDot({ level }: { level: 0 | 1 | 2 | 3 }) {
  const c = dangerColors[level]
  return <span className={styles.statusDot} style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
}

function OverlapMini({ active, lang }: { active: City; lang: string }) {
  const showAnti = active.status === 'overlapped' || !!active.antiNamePt || active.antiHidden

  let antiName: string
  if (active.antiHidden) {
    antiName = '???'
  } else if (active.antiNamePt) {
    antiName = lang === 'pt' ? active.antiNamePt : (active.antiNameEn ?? active.antiNamePt)
  } else if (active.status === 'overlapped') {
    antiName = lang === 'pt' ? `Eco de ${active.namePt}` : `Echo of ${active.nameEn}`
  } else if (active.status === 'unknown') {
    antiName = '???'
  } else {
    antiName = lang === 'pt' ? 'Não afetada' : 'Unaffected'
  }

  return (
    <div className={styles.overlapMini}>
      <div className={styles.overlapBox} style={{ borderColor: active.accent + '60' }}>
        <span className={styles.overlapTag} style={{ color: active.accentDim }}>NORMAL</span>
        <span className={styles.overlapName} style={{ color: active.accent }}>
          {lang === 'pt' ? active.namePt : active.nameEn}
        </span>
      </div>

      <div className={styles.overlapRift}>
        <div className={styles.overlapLine}
          style={{ background: `linear-gradient(to bottom, transparent, ${active.accent}, var(--rift), transparent)` }} />
        <span className={styles.overlapSymbol}>
          {active.status === 'intact' ? '✦' : active.status === 'overlapped' ? '⟷' : '?'}
        </span>
      </div>

      <div className={`${styles.overlapBox} ${!showAnti ? styles.overlapHidden : ''} ${active.antiHidden ? styles.overlapSuspense : ''}`}
        style={showAnti ? { borderColor: 'var(--rift)' } : {}}>
        <span className={styles.overlapTag} style={{ color: 'var(--rift)' }}>ANTI</span>
        <span className={styles.overlapName} style={{ color: active.antiHidden ? 'var(--rift)' : 'var(--rift-bright)' }}>
          {antiName}
        </span>
      </div>
    </div>
  )
}
