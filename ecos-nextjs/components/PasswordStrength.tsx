'use client'

import { checkPasswordStrength } from '@/lib/validators'
import styles from './PasswordStrength.module.css'

export default function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const { score, label, color } = checkPasswordStrength(password)

  return (
    <div className={styles.wrap}>
      <div className={styles.bars}>
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={styles.bar}
            style={{ background: i <= score ? color : undefined }}
          />
        ))}
      </div>
      <span className={styles.label} style={{ color }}>
        {label}
      </span>
    </div>
  )
}
