import { Platform } from 'react-native'

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string>

  constructor(message: string, status = 0, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost'
const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL || `http://${defaultHost}:8000/api`
).replace(/\/+$/, '')

function getFieldErrors(data: unknown) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {}

  return Object.fromEntries(
    Object.entries(data).map(([field, value]) => [
      field,
      Array.isArray(value) ? value.map(String).join(' ') : String(value),
    ]),
  )
}

async function postEnvelope<T>(path: string, payload: unknown, accessToken?: string): Promise<ApiEnvelope<T>> {
  if (!API_BASE_URL) {
    throw new ApiError('The API URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in the mobile environment.')
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new ApiError('Unable to connect to MyTempHome. Check your connection and try again.')
  }

  let envelope: ApiEnvelope<T>
  try {
    envelope = await response.json() as ApiEnvelope<T>
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ApiError('The server returned an unreadable response. Please try again.', response.status)
    }
    throw error
  }

  if (!response.ok || !envelope.success) {
    throw new ApiError(
      envelope.message || 'The request could not be completed.',
      response.status,
      getFieldErrors(envelope.data),
    )
  }

  return envelope
}

export async function postApi<T>(path: string, payload: unknown, accessToken?: string): Promise<T> {
  const envelope = await postEnvelope<T>(path, payload, accessToken)
  return envelope.data
}

export interface AuthUser {
  id: number
  first_name: string
  last_name: string
}

export interface LoginResponse {
  access: string
  refresh: string
  user: AuthUser
}

export interface SignupResponse {
  first_name: string
  last_name: string
  email: string
}

export function loginWithEmail(email: string, password: string) {
  return postApi<LoginResponse>('/auth/login/', { email, password })
}

export function signupWithEmail(firstName: string, lastName: string, email: string, password: string) {
  return postEnvelope<SignupResponse>('/auth/signup/', {
    first_name: firstName,
    last_name: lastName,
    email,
    password,
  })
}

export function refreshAccessToken(refresh: string) {
  return postApi<{ access: string }>('/auth/token/refresh/', { refresh })
}
