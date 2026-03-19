'use client'

import { useLanguage } from '@/context/LanguageContext'
import styles from './WorldSection.module.css'

export default function WorldSection() {
  const { t } = useLanguage()

  const places = [
    {
      icon: '🌟',
      name: t('world.p1.name'),
      desc: t('world.p1.desc'),
      status: t('world.p1.status'),
      statusClass: styles.statusSafe,
      cardClass: '',
      reveal: true,
    },
    {
      icon: '🌀',
      name: t('world.p2.name'),
      desc: t('world.p2.desc'),
      status: t('world.p2.status'),
      statusClass: styles.statusOverlap,
      cardClass: styles.cardOverlap,
      reveal: true,
    },
    {
      icon: '🔮',
      name: t('world.p3.name'),
      desc: t('world.p3.desc'),
      status: t('world.p3.status'),
      statusClass: styles.statusUnknown,
      cardClass: styles.cardUnknown,
      reveal: false,
    },
  ]

  return (
    <section className={`section ${styles.section}`} id="mundo">
      <div className="section-inner">
        <div className="section-tag" data-reveal data-delay="0">{t('world.tag')}</div>
        <h2 className="section-title" data-reveal data-delay="100">{t('world.title')}</h2>

        <div className={styles.grid}>
          {places.map((p, i) => (
            <div
              key={i}
              className={`${styles.card} ${p.cardClass}`}
              {...(p.reveal ? { 'data-reveal': '', 'data-delay': String(i * 130) } : {})}
            >
              <div className={styles.cardIcon}>{p.icon}</div>
              <h3 className={styles.cardName}>{p.name}</h3>
              <p className={styles.cardDesc}>{p.desc}</p>
              <span className={`${styles.status} ${p.statusClass}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
