'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface AuthUser {
  id: number
  username: string
  email: string
}

interface AuthCtx {
  user: AuthUser | null
  setUser: (u: AuthUser | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  setUser: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.user) setUser(d.user) })
      .catch(() => {})
  }, [])

  function logout() {
    fetch('/api/auth/logout', { method: 'POST' }).then(() => setUser(null))
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
