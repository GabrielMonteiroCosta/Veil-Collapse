'use client'

import { useState, useEffect, useCallback } from 'react'
import Nav from '@/components/Nav'
import styles from './Capitulos.module.css'

const chapters = [
  {
    number: '01',
    file: 'cap1.txt',
    title: 'Ecos das Estrelas',
    subtitle: 'Capítulo 1',
    teaser: 'A Cidade Estrela ainda era um lugar de luz. Lumi observava a vida normal se desenrolando lá fora, sem saber que aquele seria um dos últimos dias em que "normal" ainda significaria alguma coisa.',
    accent: '#f0c040',
  },
  {
    number: '1.5',
    file: 'cap15.txt',
    title: 'As Cinzas das Estrelas',
    subtitle: 'Capítulo 1.5',
    teaser: 'A cidade estava em chamas. O rift chegou durante a noite, e junto com ele, pessoas de sobretudo vermelho que sabiam exatamente onde ir. Quando Lumi acordou, Aya já não estava.',
    accent: '#e05030',
  },
  {
    number: '02',
    file: 'cap2.txt',
    title: 'Ecos do Desequilíbrio',
    subtitle: 'Capítulo 2',
    teaser: 'A floresta havia mudado. No caminho ao norte, uma criatura de sangue escuro, um vilarejo que fingia não saber de nada, uma ponte com uma rachadura no ar — e uma garota de olhos âmbar que via o que ninguém mais conseguia.',
    accent: '#e07828',
  },
  {
    number: '03',
    file: 'cap3.txt',
    title: 'Fragmentos do Silêncio',
    subtitle: 'Capítulo 3',
    teaser: 'Cálico guardava segredos nas paredes e nos subterrâneos. Símbolos em anéis circulares. Uma instalação enterrada. Documentos que descreviam experimentos com energia de rift — e um único caso que desafiava tudo que conheciam.',
    accent: '#9030ff',
  },
]

export default function CapitulosPage() {
  const [open, setOpen] = useState<null | typeof chapters[0]>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const openChapter = useCallback(async (ch: typeof chapters[0]) => {
    setOpen(ch)
    setLoading(true)
    setText('')
    try {
      const res = await fetch(`/chapters/${ch.file}`)
      const raw = await res.text()
      setText(raw)
    } catch {
      setText('Erro ao carregar o capítulo.')
    } finally {
      setLoading(false)
    }
  }, [])

  const close = useCallback(() => {
    setOpen(null)
    setText('')
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [close])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const renderText = (raw: string) => {
    return raw.split('\n').map((line, i) => {
      const trimmed = line.trim()
      if (trimmed === '-') return <div key={i} className={styles.divider} />
      if (trimmed === '') return <div key={i} className={styles.spacer} />
      if (trimmed.startsWith('CAPÍTULO') || trimmed.startsWith('Ecos das')) return null
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) return <p key={i} className={styles.quote}>{trimmed}</p>
      if (trimmed.startsWith('—') || trimmed.match(/^— /)) return <p key={i} className={styles.dialogue}>{trimmed}</p>
      return <p key={i} className={styles.paragraph}>{trimmed}</p>
    })
  }

  return (
    <>
      <Nav />
      <div className={styles.page}>
        <div className={styles.bgGlow} />
        <div className={styles.scanlines} />

        <div className={styles.container}>
          <a href="/lore" className={styles.backLink}>← Lore</a>

          <div className={styles.hero}>
            <p className={styles.tag}>✦ NARRATIVA</p>
            <h1 className={styles.title}>Capítulos</h1>
            <p className={styles.desc}>
              Os eventos que precedem a jornada — escritos em prosa antes de virarem gameplay.
              Cada capítulo é um fragmento do mundo de E.M.Q.
            </p>
          </div>

          <div className={styles.grid}>
            {chapters.map((ch) => (
              <button
                key={ch.number}
                className={styles.card}
                style={{ '--accent': ch.accent } as React.CSSProperties}
                onClick={() => openChapter(ch)}
              >
                <span className={styles.cardNumber}>{ch.number}</span>
                <div className={styles.cardContent}>
                  <span className={styles.cardSubtitle}>{ch.subtitle}</span>
                  <h2 className={styles.cardTitle}>{ch.title}</h2>
                  <p className={styles.cardTeaser}>{ch.teaser}</p>
                </div>
                <span className={styles.cardCta}>Ler →</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {open && (
        <div className={styles.overlay} onClick={close}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader} style={{ '--accent': open.accent } as React.CSSProperties}>
              <div>
                <span className={styles.modalSubtitle}>{open.subtitle}</span>
                <h2 className={styles.modalTitle}>{open.title}</h2>
              </div>
              <button className={styles.closeBtn} onClick={close} aria-label="Fechar">✕</button>
            </div>
            <div className={styles.modalBody}>
              {loading
                ? <div className={styles.loadingText}>Carregando...</div>
                : <div className={styles.reader}>{renderText(text)}</div>
              }
            </div>
          </div>
        </div>
      )}
    </>
  )
}
