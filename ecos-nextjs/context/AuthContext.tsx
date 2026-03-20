'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface AuthUser {
  id: number
  username: string
  email: string
  is_admin: number
  created_at?: string | null
  avatar?: string | null
}

interface AuthCtx {
  user: AuthUser | null
  loading: boolean
  setUser: (u: AuthUser | null) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.user) setUser(d.user) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function logout() {
    return fetch('/api/auth/logout', { method: 'POST' }).then(() => setUser(null))
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
