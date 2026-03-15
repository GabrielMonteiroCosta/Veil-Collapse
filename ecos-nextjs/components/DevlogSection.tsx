'use client'

import { useLanguage } from '@/context/LanguageContext'
import { devlog, tagColors } from '@/data/devlog'
import styles from './DevlogSection.module.css'

export default function DevlogSection() {
  const { t, lang } = useLanguage()

  return (
    <section className={`section ${styles.section}`} id="devlog">
      <div className="section-inner">
        <div className="section-tag">{t('devlog.tag')}</div>
        <h2 className="section-title">{t('devlog.title')}</h2>
        <p className={styles.subtitle}>{t('devlog.subtitle')}</p>

        <div className={styles.timeline}>
          {devlog.map((entry, i) => (
            <div key={i} className={styles.entry}>
              <div className={styles.entryLeft}>
                <div
                  className={styles.dot}
                  style={{ borderColor: tagColors[entry.tag], boxShadow: `0 0 10px ${tagColors[entry.tag]}60` }}
                />
                {i < devlog.length - 1 && <div className={styles.line} />}
              </div>
              <div className={styles.entryRight}>
                <div className={styles.entryMeta}>
                  <span className={styles.date}>{formatDate(entry.date, lang)}</span>
                  <span
                    className={styles.tag}
                    style={{ color: tagColors[entry.tag], borderColor: tagColors[entry.tag] + '60' }}
                  >
                    {entry.tag}
                  </span>
                </div>
                <h3 className={styles.entryTitle}>
                  {lang === 'pt' ? entry.titlePt : entry.titleEn}
                </h3>
                <p className={styles.entryText}>
                  {lang === 'pt' ? entry.textPt : entry.textEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function formatDate(iso: string, lang: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
