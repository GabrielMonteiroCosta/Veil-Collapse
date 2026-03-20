'use client'

import { createContext, useContext, useState, useCallback, useRef } from 'react'
import styles from '@/components/Toast.module.css'

type ToastType = 'success' | 'error'
interface ToastData { message: string; type: ToastType; id: number }

const ToastCtx = createContext<(msg: string, type: ToastType) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback((message: string, type: ToastType) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ message, type, id: Date.now() })
    timerRef.current = setTimeout(() => setToast(null), 3500)
  }, [])

  return (
    <ToastCtx.Provider value={show}>
      {children}
      {toast && (
        <div
          key={toast.id}
          className={`${styles.toast} ${toast.type === 'success' ? styles.success : styles.error}`}
          onClick={() => setToast(null)}
          role="alert"
        >
          <span className={styles.icon}>{toast.type === 'success' ? '✓' : '✕'}</span>
          <span className={styles.message}>{toast.message}</span>
        </div>
      )}
    </ToastCtx.Provider>
  )
}
