'use client'

import { useEffect, useState } from 'react'
import styles from './LogoutTransition.module.css'

type Phase = 'enter' | 'show' | 'exit'

interface Props {
  lang: string
  onComplete: () => void
}

export default function LogoutTransition({ lang, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 500)
    const t2 = setTimeout(() => setPhase('exit'), 3700)
    const t3 = setTimeout(() => onComplete(), 4400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <div className={`${styles.overlay} ${styles[phase]}`}>
      <div className={styles.riftBeam} />
      <div className={styles.riftGlow} />
      <div className={styles.crackLeft} />
      <div className={styles.crackRight} />
      <div className={styles.scanlines} />

      <div className={styles.particles}>
        <span /><span /><span /><span /><span /><span />
      </div>

      <div className={styles.content}>
        <p className={styles.tag}>
          {lang === 'pt' ? '⟷ RIFT INSTÁVEL' : '⟷ RIFT UNSTABLE'}
        </p>
        <p className={styles.label}>
          {lang === 'pt' ? 'DESSINCRONIZANDO...' : 'DESYNCING...'}
        </p>
        <p className={styles.dividerLine}>━━━━━━━━━━━━━━━━━━━━</p>

        <div className={styles.loadWrap}>
          <div className={styles.loadBar}>
            <div className={styles.loadFill} />
          </div>
          <p className={styles.loadLabel}>
            {lang === 'pt' ? 'LIMPANDO ACESSO...' : 'CLEARING ACCESS...'}
          </p>
        </div>

        <p className={styles.status}>
          {lang === 'pt' ? '[ CONEXÃO ENCERRADA ]' : '[ CONNECTION CLOSED ]'}
        </p>
      </div>
    </div>
  )
}
