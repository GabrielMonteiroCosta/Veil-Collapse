'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'
import { cities, statusLabels, themeLabels } from '@/data/cities'
import type { City } from '@/data/cities'
import styles from './MapSection.module.css'

// Posições de cada cidade no mapa (% da largura/altura da imagem)
const PINS: { theme: City['theme']; x: number; y: number }[] = [
  { theme: 'steampunk', x: 13,  y: 12 }, // Aeldaria
  { theme: 'western',   x: 43,  y: 20 }, // Cálico
  { theme: 'science',   x: 73,  y:  9 }, // Cidadela Âmbar
  { theme: 'pirate',    x: 16,  y: 44 }, // Libertalia
  { theme: 'cyberpunk', x: 67,  y: 41 }, // Neon
  { theme: 'witch',     x: 44,  y: 53 }, // Bosque Wicca
  { theme: 'mechanic',  x: 72,  y: 60 }, // Ferralume
  { theme: 'normal',    x: 39,  y: 71 }, // Cidade Estrela
]

const DANGER_COLORS  = ['#60d090', '#c8d840', '#e07830', '#e03040']
const DANGER_PT      = ['Segura', 'Baixa', 'Moderada', 'Alta']
const DANGER_EN      = ['Safe',   'Low',   'Moderate', 'High']

export default function MapSection() {
  const { lang }                          = useLanguage()
  const [selected, setSelected]           = useState<City | null>(null)
  const [hovered,  setHovered]            = useState<string | null>(null)
  const pt = lang === 'pt'

  function cityByTheme(theme: City['theme']) {
    return cities.find(c => c.theme === theme)!
  }

  function toggleCity(city: City) {
    setSelected(prev => prev?.theme === city.theme ? null : city)
  }

  const statusColor = { intact: '#60d090', overlapped: '#8b3fff', unknown: '#4a5a7a' }

  return (
    <section className={`section ${styles.section}`} id="mapa">
      <div className="section-inner">
        <p className="section-tag">{pt ? '✦ O Mundo' : '✦ The World'}</p>
        <h2 className="section-title">
          {pt ? 'Mapa de Ecos' : 'Echoes Map'}
        </h2>
        <p className={styles.intro}>
          {pt
            ? 'Cada ponto no mapa é uma história. Clique em uma cidade para explorar seu universo.'
            : 'Every point on the map is a story. Click on a city to explore its universe.'}
        </p>

        {/* ── Map + pins ── */}
        <div className={styles.mapWrap}>
          <Image
            src="/Mapageral.jpg"
            alt={pt ? 'Mapa do mundo de Ecos' : 'Echoes world map'}
            width={900}
            height={600}
            className={styles.mapImg}
            style={{ imageRendering: 'pixelated' }}
            priority
          />

          {PINS.map(pin => {
            const city   = cityByTheme(pin.theme)
            const active = selected?.theme === pin.theme
            const hover  = hovered === pin.theme

            return (
              <button
                key={pin.theme}
                className={`${styles.pin} ${active ? styles.pinActive : ''}`}
                style={{
                  left:  `${pin.x}%`,
                  top:   `${pin.y}%`,
                  '--pin-color': city.accent,
                  '--pin-glow':  city.accentGlow,
                } as React.CSSProperties}
                onClick={() => toggleCity(city)}
                onMouseEnter={() => setHovered(pin.theme)}
                onMouseLeave={() => setHovered(null)}
                aria-label={pt ? city.namePt : city.nameEn}
              >
                {/* Pulsing rings */}
                <span className={styles.pinRing} />
                <span className={`${styles.pinRing} ${styles.pinRing2}`} />
                {/* Dot */}
                <span className={styles.pinDot}>{city.icon}</span>

                {/* Tooltip on hover (only when nothing selected) */}
                {hover && !active && (
                  <span className={styles.tooltip}>
                    {pt ? city.namePt : city.nameEn}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── City info panel ── */}
        {selected && (
          <div
            className={styles.panel}
            style={{
              '--pc':  selected.accent,
              '--pg':  selected.accentGlow,
              '--palt': selected.accentAlt,
            } as React.CSSProperties}
          >
            {/* Top bar */}
            <div className={styles.panelBar}
              style={{ background: `linear-gradient(to right, ${selected.accent}, ${selected.accentAlt}, transparent)` }} />

            <button className={styles.panelClose} onClick={() => setSelected(null)}>×</button>

            <div className={styles.panelBody}>
              {/* Left */}
              <div className={styles.panelLeft}>
                <span className={styles.panelIcon}
                  style={{ filter: `drop-shadow(0 0 14px ${selected.accentGlow})` }}>
                  {selected.icon}
                </span>
                <p className={styles.panelSubtitle} style={{ color: selected.accentDim }}>
                  {pt ? selected.subtitlePt : selected.subtitleEn}
                </p>
                <h3 className={styles.panelName}
                  style={{ backgroundImage: `linear-gradient(135deg, ${selected.accent}, ${selected.accentAlt})` }}>
                  {pt ? selected.namePt : selected.nameEn}
                </h3>

                {/* Badges */}
                <div className={styles.panelBadges}>
                  <span className={styles.statusBadge}
                    style={{ color: statusColor[selected.status], borderColor: statusColor[selected.status] + '55' }}>
                    {statusLabels[selected.status][lang as 'pt' | 'en']}
                  </span>
                  <span className={styles.themeBadge} style={{ color: selected.accentDim, borderColor: selected.accent + '40' }}>
                    {themeLabels[selected.theme][lang as 'pt' | 'en']}
                  </span>
                </div>

                {/* Danger */}
                <div className={styles.dangerRow}>
                  <span className={styles.dangerLabel}>{pt ? '⚠ Perigo:' : '⚠ Danger:'}</span>
                  <span style={{ color: DANGER_COLORS[selected.dangerLevel], fontWeight: 700, fontSize: '0.82rem' }}>
                    {pt ? DANGER_PT[selected.dangerLevel] : DANGER_EN[selected.dangerLevel]}
                  </span>
                  <div className={styles.dangerDots}>
                    {[0,1,2,3].map(i => (
                      <span key={i} className={styles.dangerDot}
                        style={i <= selected.dangerLevel ? {
                          background: DANGER_COLORS[selected.dangerLevel],
                          boxShadow: `0 0 6px ${DANGER_COLORS[selected.dangerLevel]}`,
                        } : {}} />
                    ))}
                  </div>
                </div>

                {/* Population */}
                <p className={styles.panelPop}>
                  👥 {pt ? selected.populationPt : selected.populationEn}
                </p>
              </div>

              {/* Right */}
              <div className={styles.panelRight}>
                <p className={styles.panelDesc}>
                  {pt ? selected.descPt : selected.descEn}
                </p>

                {/* Traits */}
                <div className={styles.panelTraits}>
                  {selected.traits.map((t, i) => (
                    <span key={t} className={styles.panelTrait} style={{
                      color:       i % 2 === 0 ? selected.accent    : selected.accentAlt,
                      borderColor: (i % 2 === 0 ? selected.accent    : selected.accentAlt) + '45',
                      background:  i % 2 === 0 ? selected.accentGlow : selected.accentAltGlow,
                    }}>{t}</span>
                  ))}
                </div>

                {/* Anti-universe */}
                {selected.echoDescPt && (
                  <div className={styles.panelEcho}>
                    <span className={styles.echoLabel}>⟷ {pt ? 'ECO DO ANTI-UNIVERSO' : 'ANTI-UNIVERSE ECHO'}</span>
                    <p className={styles.echoText}>
                      {pt ? selected.echoDescPt : selected.echoDescEn}
                    </p>
                  </div>
                )}

                {/* Notable */}
                <p className={styles.panelNotable}>
                  <span className={styles.notableLabel}>★ {pt ? 'Destaque:' : 'Notable:'}</span>
                  <span style={{ color: selected.accent }}>{pt ? selected.notablePt : selected.notableEn}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <p className={styles.hint}>
          {pt ? '✦ Clique em qualquer cidade para ver seus detalhes' : '✦ Click any city to see its details'}
        </p>
      </div>
    </section>
  )
}
