import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/$/, '')
export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
})

const ACCESS_TOKEN_KEY = 'aptpal_access_token'
const REFRESH_TOKEN_KEY = 'aptpal_refresh_token'
let refreshRequest: Promise<string> | null = null

interface RetriableRequest extends InternalAxiosRequestConfig {
  _aptpalRetried?: boolean
}

interface RefreshData {
  access: string
}

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiEnvelope<unknown>>) => {
    const originalRequest = error.config as RetriableRequest | undefined
    const requestUrl = originalRequest?.url ?? ''
    const isAuthRequest = /\/auth\/(login|signup|token\/refresh)\//.test(requestUrl)

    if (error.response?.status !== 401 || !originalRequest || originalRequest._aptpalRetried || isAuthRequest) {
      return Promise.reject(error)
    }

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!refreshToken) {
      clearSession()
      return Promise.reject(error)
    }

    originalRequest._aptpalRetried = true
    try {
      if (!refreshRequest) {
        refreshRequest = axios
          .post<ApiEnvelope<RefreshData>>(`${apiBaseUrl}/auth/token/refresh/`, { refresh: refreshToken })
          .then(({ data }) => {
            const accessToken = data.data.access
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
            return accessToken
          })
          .finally(() => { refreshRequest = null })
      }

      const accessToken = await refreshRequest
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return await apiClient(originalRequest)
    } catch (refreshError) {
      clearSession()
      return Promise.reject(refreshError)
    }
  },
)

function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem('aptpal_user')
  window.dispatchEvent(new Event('aptpal:session-expired'))
}

export function getApiError(error: unknown) {
  if (axios.isAxiosError<ApiEnvelope<Record<string, unknown>>>(error)) {
    const response = error.response?.data
    const fieldErrors: Record<string, string> = {}
    if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      for (const [field, messages] of Object.entries(response.data)) {
        if (Array.isArray(messages)) fieldErrors[field] = messages.map(String).join(' ')
        else if (typeof messages === 'string') fieldErrors[field] = messages
      }
    }
    return {
      message: response?.message || 'We could not connect to AptPal. Please try again.',
      fieldErrors,
    }
  }

  return { message: 'Something went wrong. Please try again.', fieldErrors: {} }
}
