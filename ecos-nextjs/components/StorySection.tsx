'use client'

import { useLanguage } from '@/context/LanguageContext'
import GlitchText from './GlitchText'
import styles from './StorySection.module.css'

export default function StorySection() {
  const { t } = useLanguage()

  return (
    <section className="section" id="historia">
      <div className="section-inner">
        <div className="section-tag" data-reveal data-delay="0">{t('story.tag')}</div>
        <div data-reveal data-delay="100">
          <GlitchText normal={t('story.title')} as="h2" className="section-title" />
        </div>

        <div className={styles.cards}>
          {[
            { icon: '🌃', title: t('story.card1.title'), text: t('story.card1.text'), highlight: false },
            { icon: '⚔️', title: t('story.card2.title'), text: t('story.card2.text'), highlight: true },
            { icon: '🌌', title: t('story.card3.title'), text: t('story.card3.text'), highlight: false },
          ].map((card, i) => (
            <div
              key={i}
              className={`${styles.card} ${card.highlight ? styles.cardHighlight : ''}`}
              data-reveal
              data-delay={String(i * 150)}
            >
              <div className={styles.cardIcon}>{card.icon}</div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardText}>{card.text}</p>
            </div>
          ))}
        </div>

        {/* Overlap visualizer */}
        <div className={styles.riftBlock} data-reveal="scale" data-delay="200">
          <div className={styles.riftVisual}>
            <div className={styles.universe}>
              <span className={styles.universeName}>{t('story.rift.our')}</span>
              <div className={styles.universeStars}>
                {[...Array(6)].map((_, i) => (
                  <span key={i} className={styles.star} style={{ animationDelay: `${i * 0.3}s` }}>✦</span>
                ))}
              </div>
            </div>

            <div className={styles.rift}>
              <div className={styles.riftLine} />
              <div className={styles.riftGlow} />
              <span className={styles.riftLabel}>{t('story.rift.label')}</span>
            </div>

            <div className={`${styles.universe} ${styles.universeAnti}`}>
              <span className={styles.universeName}>{t('story.rift.anti')}</span>
              <div className={styles.universeStars}>
                {[...Array(6)].map((_, i) => (
                  <span key={i} className={`${styles.star} ${styles.starAnti}`} style={{ animationDelay: `${i * 0.4 + 0.2}s` }}>✦</span>
                ))}
              </div>
            </div>

            {/* Spark positioned relative to the full visual, not the 6px rift */}
            <div className={styles.riftSpark} />
          </div>

          <p className={styles.riftText}>{t('story.rift.text')}</p>
        </div>
      </div>
    </section>
  )
}
