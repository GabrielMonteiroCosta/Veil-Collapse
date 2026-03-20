'use client'

import { useLanguage } from '@/context/LanguageContext'
import styles from './WorldSection.module.css'

const EVENTS = {
  pt: [
    {
      era: 'Antes do incidente',
      icon: '🔬',
      title: 'Projeto Omega',
      desc: 'Cientistas da Cidadela Âmbar iniciam experimentos para observar o anti-universo através de Rifts controlados. A teoria era simples: abrir uma janela, olhar para o outro lado, fechar a janela.',
      status: 'intact' as const,
      accent: '#2090ff',
    },
    {
      era: 'O incidente',
      icon: '⚡',
      title: 'A Ruptura',
      desc: 'O experimento 7-Ω falhou de forma catastrófica. O Rift não fechou. Em vez disso, se expandiu — consumindo primeiro o laboratório, depois a cidade inteira. Cidadela Âmbar foi a primeira a ser sobreposta.',
      status: 'overlapped' as const,
      accent: '#ff3060',
      critical: true,
    },
    {
      era: 'Primeiras semanas',
      icon: '🌀',
      title: 'A Propagação',
      desc: 'A energia do Rift se espalhou pelos continentes sem aviso. Cálico, Ferralume e Neon foram alcançadas em cascata. Cidades inteiras passaram a existir em dois lugares ao mesmo tempo — e nenhuma delas escolheu isso.',
      status: 'overlapped' as const,
      accent: '#9030ff',
    },
    {
      era: 'Resposta global',
      icon: '🛡️',
      title: 'Fundação da E.C.O',
      desc: 'O Esquadrão de Contenção e Observação foi criado às pressas por governos das regiões afetadas. Missão: monitorar os Rifts, proteger as zonas sobrepostas e impedir que o incidente se repita. Missão cumprida — por enquanto.',
      status: 'intact' as const,
      accent: '#f0c040',
    },
    {
      era: 'Hoje',
      icon: '❓',
      title: 'O Desconhecido',
      desc: 'Libertalia, Bosque Wicca e Aeldaria desapareceram do radar. Nenhuma expedição retornou com dados conclusivos. A E.C.O classifica as três como "status desconhecido" — o que, internamente, significa que ninguém sabe se ainda existem.',
      status: 'unknown' as const,
      accent: '#4a5a7a',
    },
  ],
  en: [
    {
      era: 'Before the incident',
      icon: '🔬',
      title: 'Omega Project',
      desc: 'Scientists at Cidadela Âmbar begin experiments to observe the anti-universe through controlled Rifts. The theory was simple: open a window, look to the other side, close the window.',
      status: 'intact' as const,
      accent: '#2090ff',
    },
    {
      era: 'The incident',
      icon: '⚡',
      title: 'The Rupture',
      desc: 'Experiment 7-Ω failed catastrophically. The Rift did not close. Instead, it expanded — consuming first the laboratory, then the entire city. Cidadela Âmbar was the first to be overlapped.',
      status: 'overlapped' as const,
      accent: '#ff3060',
      critical: true,
    },
    {
      era: 'First weeks',
      icon: '🌀',
      title: 'The Propagation',
      desc: 'Rift energy spread across continents without warning. Calico, Ferralume and Neon were reached in cascade. Entire cities began existing in two places at once — and none of them chose it.',
      status: 'overlapped' as const,
      accent: '#9030ff',
    },
    {
      era: 'Global response',
      icon: '🛡️',
      title: 'E.C.O Founded',
      desc: 'The Containment and Observation Squad was hastily created by governments of affected regions. Mission: monitor Rifts, protect overlapping zones and prevent the incident from repeating. Mission accomplished — for now.',
      status: 'intact' as const,
      accent: '#f0c040',
    },
    {
      era: 'Today',
      icon: '❓',
      title: 'The Unknown',
      desc: 'Libertalia, Wicca Grove and Aeldaria disappeared from radar. No expedition has returned with conclusive data. E.C.O classifies all three as "unknown status" — which, internally, means nobody knows if they still exist.',
      status: 'unknown' as const,
      accent: '#4a5a7a',
    },
  ],
}

const STATUS_DOT = {
  intact:     { color: '#40c878', label: { pt: 'Intacta',      en: 'Intact' } },
  overlapped: { color: '#8b3fff', label: { pt: 'Sobreposta',   en: 'Overlapped' } },
  unknown:    { color: '#4a5a7a', label: { pt: 'Desconhecida', en: 'Unknown' } },
}

export default function WorldSection() {
  const { lang } = useLanguage()
  const pt = lang === 'pt'
  const events = EVENTS[lang as 'pt' | 'en'] ?? EVENTS.pt

  return (
    <section className={`section ${styles.section}`} id="mundo">
      <div className="section-inner">

        <div className="section-tag" data-reveal data-delay="0">
          {pt ? '✦ Lore' : '✦ Lore'}
        </div>
        <h2 className="section-title" data-reveal data-delay="100">
          {pt ? 'O incidente da Cidadela Âmbar' : 'The Cidadela Âmbar incident'}
        </h2>
        <p className={styles.subtitle} data-reveal data-delay="160">
          {pt
            ? 'Uma sequência de eventos que ninguém planejou — e que ninguém sabe como desfazer.'
            : 'A sequence of events nobody planned — and nobody knows how to undo.'}
        </p>

        {/* Status legend */}
        <div className={styles.legend} data-reveal data-delay="220">
          {Object.entries(STATUS_DOT).map(([key, val]) => (
            <span key={key} className={styles.legendItem}>
              <span
                className={styles.dot}
                style={{ background: val.color, boxShadow: `0 0 6px ${val.color}` }}
              />
              {pt ? val.label.pt : val.label.en}
            </span>
          ))}
        </div>

        {/* Timeline */}
        <div className={styles.timeline}>
          <div className={styles.timelineLine} />

          {events.map((ev, i) => (
            <div
              key={i}
              className={`${styles.event} ${ev.critical ? styles.eventCritical : ''}`}
              data-reveal
              data-delay={String(i * 100)}
            >
              {/* Node on the line */}
              <div
                className={`${styles.node} ${styles[`node_${ev.status}`]}`}
                style={{ '--ev-ac': ev.accent } as React.CSSProperties}
              >
                <span className={styles.nodeIcon}>{ev.icon}</span>
              </div>

              {/* Content card */}
              <div
                className={styles.card}
                style={{ '--ev-ac': ev.accent } as React.CSSProperties}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.era}>{ev.era}</span>
                  <span
                    className={styles.statusPill}
                    style={{
                      color: STATUS_DOT[ev.status].color,
                      borderColor: STATUS_DOT[ev.status].color + '55',
                    }}
                  >
                    <span
                      className={styles.dot}
                      style={{
                        background: STATUS_DOT[ev.status].color,
                        boxShadow: `0 0 5px ${STATUS_DOT[ev.status].color}`,
                      }}
                    />
                    {pt ? STATUS_DOT[ev.status].label.pt : STATUS_DOT[ev.status].label.en}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{ev.title}</h3>
                <p className={styles.cardDesc}>{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
