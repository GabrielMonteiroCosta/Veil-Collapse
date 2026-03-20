'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { expenses } from '@/data/expenses'
import styles from './TransparencyModal.module.css'

interface Props {
  totalRaised: number
  lang: string
  onClose: () => void
}

const fmt = (val: number | string) => {
  const parts = Number(val).toFixed(2).split('.')
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `R$\u00a0${intPart},${parts[1]}`
}

export default function TransparencyModal({ totalRaised, lang, onClose }: Props) {
  const pt = lang === 'pt'
  const overlayRef = useRef<HTMLDivElement>(null)

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const balance    = totalRaised - totalSpent

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function handleOverlay(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose()
  }

  const locale = pt ? 'pt-BR' : 'en-US'

  const content = (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlay}>
      <div className={styles.modal}>
        {/* Sticky header with close button */}
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <span className={styles.tag}>{pt ? '✦ Relatório Financeiro' : '✦ Financial Report'}</span>
            <h2 className={styles.title}>
              {pt ? 'Transparência do Projeto' : 'Project Transparency'}
            </h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        {/* Summary cards */}
        <div className={styles.cards}>
          <div className={`${styles.card} ${styles.cardRaised}`}>
            <span className={styles.cardLabel}>{pt ? 'Total arrecadado' : 'Total raised'}</span>
            <span className={styles.cardValue}>{fmt(totalRaised)}</span>
          </div>
          <div className={`${styles.card} ${styles.cardSpent}`}>
            <span className={styles.cardLabel}>{pt ? 'Total gasto' : 'Total spent'}</span>
            <span className={styles.cardValue}>{fmt(totalSpent)}</span>
          </div>
          <div className={`${styles.card} ${styles.cardBalance} ${balance < 0 ? styles.cardNegative : ''}`}>
            <span className={styles.cardLabel}>{pt ? 'Saldo' : 'Balance'}</span>
            <span className={styles.cardValue}>{fmt(balance)}</span>
          </div>
        </div>

        {/* Expenses breakdown */}
        <div className={styles.breakdown}>
          <h3 className={styles.breakdownTitle}>
            {pt ? 'Onde o dinheiro foi usado' : 'Where the money went'}
          </h3>
          {expenses.length === 0 ? (
            <p className={styles.noExpenses}>
              {pt ? 'Nenhum gasto registrado ainda.' : 'No expenses recorded yet.'}
            </p>
          ) : (
            <ul className={styles.expenseList}>
              {expenses.map((exp, i) => (
                <li key={i} className={styles.expenseItem}>
                  <span className={styles.expenseDesc}>{pt ? exp.descPt : exp.descEn}</span>
                  <span className={styles.expenseDate}>
                    {new Date(exp.date + '-01').toLocaleDateString(locale, { month: 'short', year: 'numeric' })}
                  </span>
                  <span className={styles.expenseAmount}>{fmt(exp.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className={styles.note}>
          {pt
            ? '✦ Dados atualizados manualmente pelo desenvolvedor. As doações são usadas exclusivamente no desenvolvimento do jogo.'
            : '✦ Data updated manually by the developer. Donations are used exclusively for game development.'}
        </p>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
