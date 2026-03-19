'use client'

import { useEffect, useState } from 'react'
import styles from './LoginTransition.module.css'

type Phase = 'enter' | 'show' | 'exit'

interface Props {
  username: string
  lang: string
  onComplete: () => void
}

export default function LoginTransition({ username, lang, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 500)
    const t2 = setTimeout(() => setPhase('exit'), 4200)
    const t3 = setTimeout(() => onComplete(), 4900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <div className={`${styles.overlay} ${styles[phase]}`}>
      {/* Rift beam — the vertical line that "opens" */}
      <div className={styles.riftBeam} />
      <div className={styles.riftGlow} />

      {/* Decorative cracks */}
      <div className={styles.crackLeft} />
      <div className={styles.crackRight} />
      <div className={styles.crackTopLeft} />
      <div className={styles.crackBottomRight} />

      {/* Scanlines */}
      <div className={styles.scanlines} />

      {/* Floating particles */}
      <div className={styles.particles}>
        <span /><span /><span /><span /><span /><span />
      </div>

      {/* Central content */}
      <div className={styles.content}>
        <p className={styles.tag}>
          {lang === 'pt' ? '⟷ RIFT SINCRONIZADO' : '⟷ RIFT SYNCHRONIZED'}
        </p>
        <p className={styles.welcome}>
          {lang === 'pt' ? 'BEM-VINDO,' : 'WELCOME,'}
        </p>
        <h1 className={styles.username}>{username.toUpperCase()}</h1>
        <p className={styles.dividerLine}>━━━━━━━━━━━━━━━━━━━━</p>
        <p className={styles.status}>
          {lang === 'pt' ? '[ ACESSO CONFIRMADO ]' : '[ ACCESS GRANTED ]'}
        </p>

        {/* Pixelated load bar */}
        <div className={styles.loadWrap}>
          <div className={styles.loadBar}>
            <div className={styles.loadFill} />
          </div>
          <p className={styles.loadLabel}>
            {lang === 'pt' ? 'SINCRONIZANDO RIFT...' : 'SYNCING RIFT...'}
          </p>
        </div>
      </div>
    </div>
  )
}
