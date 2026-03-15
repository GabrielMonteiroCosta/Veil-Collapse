'use client'

import { useLanguage } from '@/context/LanguageContext'
import styles from './Footer.module.css'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.title}>Ecos de um Mundo Quebrado</p>
        <p className={styles.tagline}>{t('footer.tagline')}</p>

        <div className={styles.links}>
          <a href="#" className={styles.link}>{t('footer.twitter')}</a>
          <span className={styles.dot}>✦</span>
          <a href="#" className={styles.link}>{t('footer.instagram')}</a>
          <span className={styles.dot}>✦</span>
          <a href="#" className={styles.link}>{t('footer.discord')}</a>
        </div>

        <div className={styles.riftDivider}>
          <div className={styles.riftLine} />
          <span className={styles.riftStar}>✦</span>
          <div className={styles.riftLine} />
        </div>

        <p className={styles.copy}>{t('footer.copy')}</p>
      </div>
    </footer>
  )
}
