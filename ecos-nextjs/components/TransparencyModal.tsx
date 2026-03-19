'use client'

import { useEffect, useRef } from 'react'
import { expenses } from '@/data/expenses'
import styles from './TransparencyModal.module.css'

interface Props {
  totalRaised: number
  lang: string
  onClose: () => void
}

const fmt = (val: number, locale: string) =>
  val.toLocaleString(locale, { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

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

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.tag}>{pt ? '✦ Relatório Financeiro' : '✦ Financial Report'}</span>
          <h2 className={styles.title}>
            {pt ? 'Transparência do Projeto' : 'Project Transparency'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        {/* Summary cards */}
        <div className={styles.cards}>
          <div className={`${styles.card} ${styles.cardRaised}`}>
            <span className={styles.cardLabel}>{pt ? 'Total arrecadado' : 'Total raised'}</span>
            <span className={styles.cardValue}>{fmt(totalRaised, locale)}</span>
          </div>
          <div className={`${styles.card} ${styles.cardSpent}`}>
            <span className={styles.cardLabel}>{pt ? 'Total gasto' : 'Total spent'}</span>
            <span className={styles.cardValue}>{fmt(totalSpent, locale)}</span>
          </div>
          <div className={`${styles.card} ${styles.cardBalance} ${balance < 0 ? styles.cardNegative : ''}`}>
            <span className={styles.cardLabel}>{pt ? 'Saldo' : 'Balance'}</span>
            <span className={styles.cardValue}>{fmt(balance, locale)}</span>
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
                  <span className={styles.expenseAmount}>{fmt(exp.amount, locale)}</span>
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
}
