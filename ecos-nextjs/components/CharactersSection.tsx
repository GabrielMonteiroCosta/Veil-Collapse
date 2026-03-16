'use client'

import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'
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
            <div className={styles.portraitWrapper}>
              <div className={styles.portraitAura} />
              <div className={styles.portraitBounce}>
                <Image
                  src="/characters/LumiPerfil.png"
                  alt="Lumi"
                  width={220}
                  height={280}
                  className={styles.portrait}
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <div className={styles.portraitGround} />
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
            <div className={styles.portraitWrapper}>
              <div className={`${styles.portraitAura} ${styles.portraitAuraAnti}`} />
              <div className={styles.portraitBounce} style={{ animationDelay: '0.8s' }}>
                <Image
                  src="/characters/AyaPerfil.png"
                  alt="Aya"
                  width={220}
                  height={280}
                  className={`${styles.portrait} ${styles.portraitAnti}`}
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <div className={`${styles.portraitGround} ${styles.portraitGroundAnti}`} />
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
