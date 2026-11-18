import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { apiClient, type ApiEnvelope } from '../api/client'
import { AuthContext } from './context'

export interface AuthUser {
  id: number
  first_name: string
  last_name: string
}

interface LoginData {
  access: string
  refresh: string
  user: AuthUser
}

export interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<string>
  logout: () => void
}

const ACCESS_TOKEN_KEY = 'mytemphome_access_token'
const REFRESH_TOKEN_KEY = 'mytemphome_refresh_token'
const USER_KEY = 'mytemphome_user'
function readStoredUser(): AuthUser | null {
  const serializedUser = localStorage.getItem(USER_KEY)
  if (!serializedUser) return null
  try {
    return JSON.parse(serializedUser) as AuthUser
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser)

  useEffect(() => {
    const handleExpiredSession = () => setUser(null)
    window.addEventListener('mytemphome:session-expired', handleExpiredSession)
    return () => window.removeEventListener('mytemphome:session-expired', handleExpiredSession)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await apiClient.post<ApiEnvelope<LoginData>>('/auth/login/', { email, password })
    const { access, refresh, user: authenticatedUser } = data.data
    localStorage.setItem(ACCESS_TOKEN_KEY, access)
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
    localStorage.setItem(USER_KEY, JSON.stringify(authenticatedUser))
    setUser(authenticatedUser)
  }, [])

  const signup = useCallback(async (firstName: string, lastName: string, email: string, password: string) => {
    const { data } = await apiClient.post<ApiEnvelope<{ first_name: string; last_name: string; email: string }>>(
      '/auth/signup/',
      { first_name: firstName, last_name: lastName, email, password },
    )
    return data.message
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, login, signup, logout }), [user, login, signup, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
