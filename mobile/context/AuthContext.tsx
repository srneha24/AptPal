import * as SecureStore from 'expo-secure-store'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ApiError,
  loginWithEmail,
  postApi,
  refreshAccessToken as requestAccessToken,
  signupWithEmail,
} from '../services/api'
import type { AuthUser } from '../services/api'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  loginNotice: string
  login: (email: string, password: string) => Promise<void>
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<string>
  logout: () => Promise<void>
  setLoginNotice: (notice: string) => void
  clearLoginNotice: () => void
  authenticatedPost: <T>(path: string, payload: unknown) => Promise<T>
}

interface StoredSession {
  access: string
  refresh: string
  user: AuthUser
}

const ACCESS_KEY = 'mytemphome_access_token'
const REFRESH_KEY = 'mytemphome_refresh_token'
const USER_KEY = 'mytemphome_user'
const AuthContext = createContext<AuthContextValue | null>(null)

async function clearStoredSession() {
  await Promise.allSettled([
    SecureStore.deleteItemAsync(ACCESS_KEY),
    SecureStore.deleteItemAsync(REFRESH_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ])
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loginNotice, setLoginNotice] = useState('')

  useEffect(() => {
    let mounted = true

    async function restoreSession() {
      try {
        const [storedAccess, storedRefresh, storedUser] = await Promise.all([
          SecureStore.getItemAsync(ACCESS_KEY),
          SecureStore.getItemAsync(REFRESH_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ])

        if (!storedAccess || !storedRefresh || !storedUser) {
          await clearStoredSession()
          return
        }

        const parsedUser = JSON.parse(storedUser) as AuthUser
        if (!parsedUser.id || !parsedUser.first_name) {
          await clearStoredSession()
          return
        }

        if (mounted) {
          setAccessToken(storedAccess)
          setRefreshToken(storedRefresh)
          setUser(parsedUser)
        }
      } catch {
        await clearStoredSession()
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    void restoreSession()
    return () => { mounted = false }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const session = await loginWithEmail(email, password)
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_KEY, session.access),
      SecureStore.setItemAsync(REFRESH_KEY, session.refresh),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(session.user)),
    ])
    setAccessToken(session.access)
    setRefreshToken(session.refresh)
    setUser(session.user)
  }, [])

  const signup = useCallback(async (firstName: string, lastName: string, email: string, password: string) => {
    const result = await signupWithEmail(firstName, lastName, email, password)
    return result.message
  }, [])

  const logout = useCallback(async () => {
    await clearStoredSession()
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
  }, [])

  const authenticatedPost = useCallback(async <T,>(path: string, payload: unknown): Promise<T> => {
    if (!accessToken || !refreshToken) throw new ApiError('Please log in to continue.', 401)

    try {
      return await postApi<T>(path, payload, accessToken)
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) throw error
    }

    try {
      const { access: refreshedAccess } = await requestAccessToken(refreshToken)
      await SecureStore.setItemAsync(ACCESS_KEY, refreshedAccess)
      setAccessToken(refreshedAccess)
      return await postApi<T>(path, payload, refreshedAccess)
    } catch (error) {
      await logout()
      throw error
    }
  }, [accessToken, refreshToken, logout])

  const clearLoginNotice = useCallback(() => setLoginNotice(''), [])
  const value = useMemo(() => ({
    user,
    isLoading,
    loginNotice,
    login,
    signup,
    logout,
    setLoginNotice,
    clearLoginNotice,
    authenticatedPost,
  }), [user, isLoading, loginNotice, login, signup, logout, clearLoginNotice, authenticatedPost])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
