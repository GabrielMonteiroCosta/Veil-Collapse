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
    number: '02',
    file: 'cap2.txt',
    title: 'Ecos das Chamas',
    subtitle: 'Capítulo 2',
    teaser: 'A Cidade Estrela dormia sob um céu limpo quando o primeiro estrondo rasgou a madrugada. Fumaça, gritos, muralhas caídas — e, entre as chamas, vultos de armadura negra avançando rua por rua, sem pressa, como quem já sabia o caminho.',
    accent: '#c41e3a',
  },
  {
    number: '03',
    file: 'cap3.txt',
    title: 'Ecos do Amanhecer',
    subtitle: 'Capítulo 3',
    teaser: 'A Cidade Estrela amanheceu em cinzas. Entre escombros e rostos conhecidos, Lumi descobre que as pessoas de sobretudo vermelho não vieram por acaso — sabiam exatamente onde ir. Restam uma fita de cabelo e um caminho ao norte.',
    accent: '#e05030',
  },
  {
    number: '04',
    file: 'cap4.txt',
    title: 'Ecos do Desequilíbrio',
    subtitle: 'Capítulo 4',
    teaser: 'A floresta havia mudado. No caminho ao norte, um vilarejo que fingia não saber de nada, uma ponte com uma rachadura no ar — e uma garota de olhos âmbar que via o que ninguém mais conseguia.',
    accent: '#e07828',
  },
  {
    number: '05',
    file: 'cap5.txt',
    title: 'Ecos do Silêncio',
    subtitle: 'Capítulo 5',
    teaser: 'Cálico guardava segredos nas paredes e nos subterrâneos. Uma guilda que sabia mais do que dizia. Uma instalação enterrada. Documentos que descreviam experimentos com energia de rift — e um único caso que desafiava tudo que conheciam.',
    accent: '#9030ff',
  },
  {
    number: '06',
    file: 'cap6.txt',
    title: 'Ecos do Vazio',
    subtitle: 'Capítulo 6',
    teaser: 'Sozinho nas profundezas da instalação, Lumi encontra salas que não deveriam caber ali e tubos com silhuetas que não deveriam existir. Então o canto no corredor se cala — e alguém de preto, que sabe exatamente quem ele é, entra na sala.',
    accent: '#d02848',
  },
  {
    number: '07',
    file: 'cap7.txt',
    title: 'Ecos da Escuridão',
    subtitle: 'Capítulo 7',
    teaser: 'Longe dali, ao redor de uma fogueira, Aya conta os vultos, memoriza cada passo e espera a brecha. Seus captores a tratam com um cuidado que parece medo — e a mulher silenciosa na borda do acampamento sabe algo que ela ainda não sabe.',
    accent: '#6878d8',
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
