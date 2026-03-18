'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import {
  commands,
  commandAliases,
  BOOT_LINES_PT,
  BOOT_LINES_EN,
  TerminalLine,
} from '@/data/terminal'
import styles from './TerminalSection.module.css'

interface HistoryEntry {
  input?: string
  lines: TerminalLine[]
}

const LINE_DELAY = 80 // ms entre cada linha

// Sequência: 1→2→3 acende, pausa, 3→2→1 acende, pausa longa (ms)
const DOT_SEQUENCE = [
  { dot: 0, on: true,  t: 0    },
  { dot: 1, on: true,  t: 300  },
  { dot: 2, on: true,  t: 600  },
  { dot: 0, on: false, t: 900  },
  { dot: 1, on: false, t: 900  },
  { dot: 2, on: false, t: 900  },
  { dot: 2, on: true,  t: 1500 },
  { dot: 1, on: true,  t: 1800 },
  { dot: 0, on: true,  t: 2100 },
  { dot: 0, on: false, t: 2400 },
  { dot: 1, on: false, t: 2400 },
  { dot: 2, on: false, t: 2400 },
]
const CYCLE_MS = 2800

export default function TerminalSection() {
  const { lang } = useLanguage()
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState('')
  const [booted, setBooted] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [cmdIndex, setCmdIndex] = useState(-1)
  const [dotOpacity, setDotOpacity] = useState([0.15, 0.15, 0.15])
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Animação das bolinhas
  useEffect(() => {
    let start: number | null = null
    let frame: number
    let stepIndex = 0

    function tick(now: number) {
      if (start === null) start = now
      const elapsed = (now - start) % CYCLE_MS

      // avança os steps que já passaram
      while (stepIndex < DOT_SEQUENCE.length && DOT_SEQUENCE[stepIndex].t <= elapsed) {
        const { dot, on } = DOT_SEQUENCE[stepIndex]
        setDotOpacity(prev => {
          const next = [...prev]
          next[dot] = on ? 1 : 0.15
          return next
        })
        stepIndex++
      }

      // reinicia o ciclo
      if (elapsed < (DOT_SEQUENCE[stepIndex - 1]?.t ?? 0) || stepIndex >= DOT_SEQUENCE.length) {
        stepIndex = 0
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Boot sequence on mount
  useEffect(() => {
    const bootLines = lang === 'pt' ? BOOT_LINES_PT : BOOT_LINES_EN
    const timer = setTimeout(() => {
      revealLines(bootLines, undefined, () => setBooted(true))
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  // Scroll to bottom inside the output div only
  useEffect(() => {
    const el = outputRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history])

  // Re-foca o input quando o terminal termina de digitar
  useEffect(() => {
    if (!isTyping) inputRef.current?.focus()
  }, [isTyping])

  function revealLines(lines: TerminalLine[], inputText: string | undefined, onDone?: () => void) {
    setIsTyping(true)

    // Add entry with the input echo and empty lines
    setHistory(prev => [...prev, { input: inputText, lines: [] }])

    lines.forEach((line, i) => {
      setTimeout(() => {
        setHistory(prev => {
          const updated = [...prev]
          const last = { ...updated[updated.length - 1] }
          last.lines = [...last.lines, line]
          updated[updated.length - 1] = last
          return updated
        })
        if (i === lines.length - 1) {
          setIsTyping(false)
          onDone?.()
        }
      }, i * LINE_DELAY)
    })
  }

  function handleSubmit() {
    const raw = input.trim().toLowerCase()
    if (!raw || isTyping) return

    if (raw === 'clear') {
      setHistory([])
      setInput('')
      return
    }

    const cmdId = commandAliases[raw]
    const cmd = commands.find(c => c.id === cmdId)

    const lines: TerminalLine[] = cmd
      ? (lang === 'pt' ? cmd.outputPt : cmd.outputEn)
      : [{
          type: 'error',
          text: lang === 'pt'
            ? `  Comando não reconhecido: "${raw}". Digite  help  para ver os comandos.`
            : `  Unknown command: "${raw}". Type  help  to see available commands.`,
        }]

    revealLines(lines, input.trim())
    setCmdHistory(prev => [raw, ...prev])
    setCmdIndex(-1)
    setInput('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(cmdIndex + 1, cmdHistory.length - 1)
      setCmdIndex(next)
      setInput(cmdHistory[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(cmdIndex - 1, -1)
      setCmdIndex(next)
      setInput(next === -1 ? '' : cmdHistory[next])
    }
  }

  return (
    <section className={`section ${styles.section}`} id="terminal">
      <div className="section-inner">
        <div className="section-tag">
          {lang === 'pt' ? 'ACESSO RESTRITO' : 'RESTRICTED ACCESS'}
        </div>
        <h2 className="section-title">
          {lang === 'pt' ? 'Terminal da Cidadela Âmbar' : 'Amber Citadel Terminal'}
        </h2>
        <p className={styles.subtitle}>
          {lang === 'pt'
            ? 'Arquivos classificados do Laboratório Rift. Acesso a pesquisadores autorizados.'
            : 'Classified files from the Rift Laboratory. Access for authorized researchers only.'}
        </p>

        {/* Terminal window */}
        <div
          className={styles.terminal}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div className={styles.titleBar}>
            <div className={styles.dots}>
              <span className={styles.dot} style={{ opacity: dotOpacity[0] }} />
              <span className={styles.dot} style={{ opacity: dotOpacity[1] }} />
              <span className={styles.dot} style={{ opacity: dotOpacity[2] }} />
            </div>
            <span className={styles.titleText}>
              {lang === 'pt' ? 'amber-citadel — sistema@rift:~$' : 'amber-citadel — system@rift:~$'}
            </span>
          </div>

          {/* Output area */}
          <div ref={outputRef} className={styles.outputArea}>
            {history.map((entry, i) => (
              <div key={i} className={styles.entry}>
                {entry.input !== undefined && (
                  <div className={styles.inputLine}>
                    <span className={styles.prompt}>{'>'}</span>
                    <span className={styles.inputText}>{entry.input}</span>
                  </div>
                )}
                {entry.lines.map((line, j) => (
                  <div key={j} className={`${styles.line} ${styles[line.type]}`}>
                    {line.text}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Input row */}
          {booted && (
            <div className={styles.inputRow}>
              <span className={styles.prompt}>{'>'}</span>
              <div className={styles.inputWrapper}>
                {/* Mirror do texto + cursor bloco */}
                <span className={styles.inputMirror} aria-hidden>
                  {input ? (
                    <>{input}{isTyping ? <span className={styles.lockCursor}>🔒</span> : <span className={styles.blockCursor} />}</>
                  ) : (
                    <>{isTyping ? <span className={styles.lockCursor}>🔒</span> : <span className={styles.blockCursor} />}<span className={styles.placeholder}>{lang === 'pt' ? 'digite um comando...' : 'type a command...'}</span></>
                  )}
                </span>
                {/* Input invisível por cima para capturar teclado */}
                <input
                  ref={inputRef}
                  className={styles.hiddenInput}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  disabled={isTyping}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
