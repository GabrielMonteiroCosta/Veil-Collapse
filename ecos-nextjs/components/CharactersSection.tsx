'use client'

import { useLanguage } from '@/context/LanguageContext'
import PixelSprite from './PixelSprite'
import { lumiSprite, ayaSprite } from '@/lib/sprites'
import styles from './CharactersSection.module.css'

export default function CharactersSection() {
  const { t } = useLanguage()

  return (
    <section className={`section ${styles.section}`} id="personagens">
      <div className="section-inner">
        <div className="section-tag">{t('chars.tag')}</div>
        <h2 className="section-title">{t('chars.title')}</h2>

        <div className={styles.chars}>

          {/* Lumi */}
          <div className={styles.charCard}>
            <div className={styles.spriteWrapper}>
              <div className={styles.spriteAura} />
              <div className={styles.spriteBounce}>
                <PixelSprite
                  grid={lumiSprite}
                  pixelSize={4}
                  glow="rgba(240,192,64,0.5)"
                />
              </div>
              <div className={styles.spriteGround} />
            </div>

            <div className={styles.charInfo}>
              <span className={styles.charRole}>{t('lumi.role')}</span>
              <h3 className={styles.charName}>Lumi</h3>
              <p className={styles.charDesc}>{t('lumi.desc')}</p>
              <div className={styles.traits}>
                <span className={styles.trait}>{t('lumi.t1')}</span>
                <span className={styles.trait}>{t('lumi.t2')}</span>
                <span className={styles.trait}>{t('lumi.t3')}</span>
              </div>
            </div>
          </div>

          {/* Aya */}
          <div className={`${styles.charCard} ${styles.charCardRight}`}>
            <div className={styles.spriteWrapper}>
              <div className={`${styles.spriteAura} ${styles.spriteAuraAnti}`} />
              <div className={styles.spriteBounce} style={{ animationDelay: '0.8s' }}>
                <PixelSprite
                  grid={ayaSprite}
                  pixelSize={4}
                  glow="rgba(139,63,255,0.6)"
                />
              </div>
              <div className={`${styles.spriteGround} ${styles.spriteGroundAnti}`} />
            </div>

            <div className={styles.charInfo}>
              <span className={`${styles.charRole} ${styles.charRoleAnti}`}>{t('aya.role')}</span>
              <h3 className={`${styles.charName} ${styles.charNameAnti}`}>Aya</h3>
              <p className={styles.charDesc}>{t('aya.desc')}</p>
              <div className={styles.traits}>
                <span className={`${styles.trait} ${styles.traitMystery}`}>{t('aya.t1')}</span>
                <span className={`${styles.trait} ${styles.traitMystery}`}>{t('aya.t2')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
