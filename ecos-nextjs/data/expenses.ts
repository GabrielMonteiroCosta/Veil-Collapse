export interface Expense {
  descPt: string
  descEn: string
  amount: number // BRL
  date: string   // YYYY-MM
}

export const expenses: Expense[] = [
  {
    descPt: 'Ferramentas de desenvolvimento',
    descEn: 'Development tools',
    amount: 110,
    date: '2025-03',
  },
]
