'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './GlitchText.module.css'

interface Props {
  normal: string
  anti?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}

// Characters used for glitch corruption effect
const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#@$%&|~`'

function corrupt(text: string, amount: number): string {
  return text
    .split('')
    .map(char => {
      if (char === ' ' || char === '\n') return char
      return Math.random() < amount
        ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        : char
    })
    .join('')
}

export default function GlitchText({
  normal,
  anti,
  as: Tag = 'span',
  className = '',
  intensity = 'low',
}: Props) {
  const [displayed, setDisplayed] = useState(normal)
  const [isGlitching, setIsGlitching] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const intervalMap = { low: 6000, medium: 4000, high: 2500 }
  const amountMap = { low: 0.15, medium: 0.3, high: 0.5 }

  useEffect(() => {
    setDisplayed(normal)

    function triggerGlitch() {
      setIsGlitching(true)
      const target = anti ?? normal
      const amount = amountMap[intensity]
      let frame = 0
      const totalFrames = 8

      const interval = setInterval(() => {
        frame++
        if (frame < totalFrames / 2) {
          setDisplayed(corrupt(target, amount + frame * 0.05))
        } else if (frame < totalFrames) {
          setDisplayed(corrupt(normal, amount - (frame - totalFrames / 2) * 0.05))
        } else {
          setDisplayed(normal)
          setIsGlitching(false)
          clearInterval(interval)
          timerRef.current = setTimeout(triggerGlitch, intervalMap[intensity] + Math.random() * 3000)
        }
      }, 60)
    }

    timerRef.current = setTimeout(triggerGlitch, intervalMap[intensity] + Math.random() * 2000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normal, anti, intensity])

  return (
    <Tag className={`${styles.glitch} ${isGlitching ? styles.active : ''} ${className}`}>
      {displayed}
    </Tag>
  )
}
