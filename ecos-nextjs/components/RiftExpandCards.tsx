'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './RiftExpandCards.module.css'

const CARDS = {
  pt: [
    {
      id: 'zonas',
      icon: '🌀',
      title: 'Lugares entre dois tempos',
      tagline: 'Lugares que existem simultaneamente no universo normal e no anti-universo.',
      sub: [
        {
          icon: '🍺',
          title: 'Bar do Limiar',
          label: 'Cálico — zona de sobreposição',
          text: 'Um bar cortado exatamente pela linha do Rift. Do lado normal, tudo funciona como esperado. Do outro lado, os copos ficam invertidos, as garrafas flutuam e o barman atende os dois universos ao mesmo tempo sem perceber.',
          accent: '#e07828',
        },
        {
          icon: '🏖️',
          title: 'Praia do Éter',
          label: 'Libertalia — rift submerso',
          text: 'Uma praia onde um Rift abriu no fundo do mar. A partir de certo ponto, a água vira roxa e densa como névoa. Quem nada longe demais volta diferente — não no corpo, mas em algo que ninguém consegue nomear.',
          accent: '#9030ff',
        },
        {
          icon: '🪜',
          title: 'Escadaria Infinita',
          label: 'Ferralume — construção sobreposta',
          text: 'Uma escada que estava sendo construída quando o Rift bateu. Sobe normalmente de um lado e de cabeça pra baixo do outro — e as duas chegam na mesma sala. Os engenheiros pararam de tentar entender e começaram a cobrar ingresso.',
          accent: '#8898b8',
        },
        {
          icon: '🛒',
          title: 'Mercado das Duas Sombras',
          label: 'Neon — comércio entre universos',
          text: 'Uma feira onde vendedores descobriram que podem comercializar entre universos. Você vende algo aqui — some de lá. Ninguém sabe o que os compradores do anti-universo fazem com o que recebem. Ninguém pergunta.',
          accent: '#2080ff',
        },
      ],
    },
    {
      id: 'rifts',
      icon: '🌌',
      title: 'Rifts',
      tagline: 'Fraturas abertas na estrutura da realidade — onde tudo começa a falhar.',
      accent: 'rift',
      sub: [
        {
          icon: '🛡️',
          title: 'E.C.O',
          label: 'Esquadrão de Contenção e Observação',
          text: 'Fundado após o incidente da Cidadela Âmbar para monitorar a expansão dos Rifts e proteger os que vivem nas zonas sobrepostas. Nem aliado, nem inimigo — por enquanto.',
          accent: '#f0c040',
        },
        {
          icon: '💠',
          title: 'Conectores Rift',
          label: 'Tecnologia E.C.O — uso civil',
          text: 'Dispositivos que sincronizam a assinatura de Rift única de cada pessoa. Sem um Conector ativo, pontos de save e lojas especializadas permanecem inacessíveis — e o anti-universo se torna ainda mais hostil.',
          accent: '#a78bfa',
        },
        {
          icon: '🌀',
          title: 'Zonas de Rift',
          label: 'Áreas de sobreposição crítica',
          text: 'Regiões onde a pressão entre os dois universos é tão intensa que as leis físicas começam a falhar. Cidades inteiras podem estar dentro de uma Zona sem saber — Cálico, Ferralume e Neon já foram confirmadas.',
          accent: '#7c3aed',
        },
      ],
    },
  ],
  en: [
    {
      id: 'zonas',
      icon: '🌀',
      title: 'Places between two times',
      tagline: 'Places that exist simultaneously in the normal universe and the anti-universe.',
      sub: [
        {
          icon: '🍺',
          title: 'The Threshold Bar',
          label: 'Calico — overlap zone',
          text: 'A bar cut exactly along the Rift line. On the normal side, everything works as expected. On the other side, glasses sit upside down, bottles float, and the bartender serves both universes at once without noticing.',
          accent: '#e07828',
        },
        {
          icon: '🏖️',
          title: 'Ether Beach',
          label: 'Libertalia — submerged rift',
          text: 'A beach where a Rift opened at the bottom of the sea. Beyond a certain point, the water turns purple and dense like fog. Those who swim too far come back different — not in body, but in something nobody can name.',
          accent: '#9030ff',
        },
        {
          icon: '🪜',
          title: 'The Infinite Staircase',
          label: 'Ferralume — overlapped construction',
          text: 'A staircase that was being built when the Rift struck. It goes up normally on one side and upside down on the other — and both reach the same room. The engineers stopped trying to understand and started charging admission.',
          accent: '#8898b8',
        },
        {
          icon: '🛒',
          title: 'The Two Shadows Market',
          label: 'Neon — cross-universe trade',
          text: 'A marketplace where vendors discovered they can trade between universes. Sell something here — it vanishes there. Nobody knows what the anti-universe buyers do with what they receive. Nobody asks.',
          accent: '#2080ff',
        },
      ],
    },
    {
      id: 'rifts',
      icon: '🌌',
      title: 'Rifts',
      tagline: 'Fractures torn open in the fabric of reality — where everything begins to fail.',
      accent: 'rift',
      sub: [
        {
          icon: '🛡️',
          title: 'E.C.O',
          label: 'Containment and Observation Squad',
          text: 'Founded after the Cidadela Âmbar incident to monitor Rift expansion and protect those living in overlapping zones. Neither ally nor enemy — for now.',
          accent: '#f0c040',
        },
        {
          icon: '💠',
          title: 'Rift Connectors',
          label: 'E.C.O Technology — civilian use',
          text: 'Devices that synchronize each person\'s unique Rift signature. Without an active Connector, save points and specialized shops remain inaccessible — and the anti-universe becomes even more hostile.',
          accent: '#a78bfa',
        },
        {
          icon: '🌀',
          title: 'Rift Zones',
          label: 'Critical overlap areas',
          text: 'Regions where the pressure between both universes is so intense that physical laws begin to fail. Entire cities may be inside a Zone without knowing — Cálico, Ferralume and Neon have already been confirmed.',
          accent: '#7c3aed',
        },
      ],
    },
  ],
}

export default function RiftExpandCards() {
  const { lang } = useLanguage()
  const cards = CARDS[lang as 'pt' | 'en'] ?? CARDS.pt
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="section" id="rift-cards">
      <div className="section-inner">
        <div className="section-tag" data-reveal data-delay="0">
          {lang === 'pt' ? '✦ O Mundo' : '✦ The World'}
        </div>
        <h2 className="section-title" data-reveal data-delay="100">
          {lang === 'pt' ? 'Conceitos do universo' : 'Universe concepts'}
        </h2>

        <div className={styles.list}>
          {cards.map((card, i) => {
            const isOpen = openId === card.id
            return (
              <div
                key={card.id}
                className={`${styles.card} ${isOpen ? styles.cardOpen : ''}`}
                data-reveal
                data-delay={String(i * 120)}
              >
                {/* Main clickable header */}
                <button
                  className={styles.header}
                  onClick={() => setOpenId(isOpen ? null : card.id)}
                  aria-expanded={isOpen}
                >
                  <div className={styles.headerLeft}>
                    <span className={styles.icon}>{card.icon}</span>
                    <div>
                      <h3 className={styles.title}>{card.title}</h3>
                      <p className={styles.tagline}>{card.tagline}</p>
                    </div>
                  </div>
                  <div className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>

                {/* Expandable sub-cards */}
                <div className={`${styles.subWrap} ${isOpen ? styles.subWrapOpen : ''}`}>
                  <div className={styles.subInner}>
                    <div className={styles.subGrid}>
                      {card.sub.map((sub, j) => (
                        <div
                          key={j}
                          className={styles.subCard}
                          style={{
                            '--sub-ac': sub.accent,
                            animationDelay: isOpen ? `${j * 80}ms` : '0ms',
                          } as React.CSSProperties}
                        >
                          <div className={styles.subTop}>
                            <span className={styles.subIcon}>{sub.icon}</span>
                            <div>
                              <p className={styles.subLabel}>{sub.label}</p>
                              <h4 className={styles.subTitle}>{sub.title}</h4>
                            </div>
                          </div>
                          <p className={styles.subText}>{sub.text}</p>
                        </div>
                      ))}
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
