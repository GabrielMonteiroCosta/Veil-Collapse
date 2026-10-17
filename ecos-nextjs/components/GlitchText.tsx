'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './GlitchText.module.css'

interface Props {
  normal: string
  // Uma ou mais versões alternativas; com várias, cada glitch usa a próxima da lista
  anti?: string | string[]
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  // Tempo (ms) que a versão alternativa fica visível, sem corrupção, antes de voltar
  holdMs?: number
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
  holdMs = 0,
}: Props) {
  const [displayed, setDisplayed] = useState(normal)
  const [isGlitching, setIsGlitching] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cycleRef = useRef(0)

  const intervalMap = { low: 6000, medium: 4000, high: 2500 }
  const amountMap = { low: 0.15, medium: 0.3, high: 0.5 }
  const antiKey = Array.isArray(anti) ? anti.join('\u0000') : anti

  useEffect(() => {
    setDisplayed(normal)
    const alternatives = anti === undefined ? [normal] : Array.isArray(anti) ? anti : [anti]
    const halfFrames = 4

    function triggerGlitch() {
      setIsGlitching(true)
      const target = alternatives[cycleRef.current % alternatives.length]
      cycleRef.current++
      const amount = amountMap[intensity]
      let frame = 0

      // Ida: o texto normal se corrompe até virar a versão alternativa
      intervalRef.current = setInterval(() => {
        frame++
        if (frame < halfFrames) {
          setDisplayed(corrupt(target, amount + frame * 0.05))
          return
        }
        if (intervalRef.current) clearInterval(intervalRef.current)
        if (holdMs > 0) setDisplayed(target)
        timerRef.current = setTimeout(backToNormal, holdMs)
      }, 60)

      // Volta: a versão alternativa se corrompe até virar o texto normal
      function backToNormal() {
        let back = 0
        intervalRef.current = setInterval(() => {
          back++
          if (back <= halfFrames) {
            setDisplayed(corrupt(normal, amount - (back - 1) * 0.05))
            return
          }
          if (intervalRef.current) clearInterval(intervalRef.current)
          setDisplayed(normal)
          setIsGlitching(false)
          timerRef.current = setTimeout(triggerGlitch, intervalMap[intensity] + Math.random() * 3000)
        }, 60)
      }
    }

    timerRef.current = setTimeout(triggerGlitch, intervalMap[intensity] + Math.random() * 2000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normal, antiKey, intensity, holdMs])

  return (
    <Tag className={`${styles.glitch} ${isGlitching ? styles.active : ''} ${className}`}>
      {displayed}
    </Tag>
  )
}
