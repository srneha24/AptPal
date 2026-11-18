import axios from 'axios'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiClient, getApiError, type ApiEnvelope } from '../api/client'
import { ApiNotice } from '../components/ApiNotice'
import { AuthField } from '../components/AuthField'

type VerificationStatus = 'loading' | 'success' | 'already-verified' | 'invalid' | 'error'
type CompletedVerificationStatus = Exclude<VerificationStatus, 'loading'>

interface VerificationResult {
  key: string
  status: CompletedVerificationStatus
  message: string
}

interface VerificationRequest {
  key: string
  promise: Promise<string>
}

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const uid = searchParams.get('uid')
  const token = searchParams.get('token')
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const requestRef = useRef<VerificationRequest | null>(null)
  const [email, setEmail] = useState('')
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [resendMessage, setResendMessage] = useState('')
  const requestKey = uid && token ? `${uid}:${token}:${attempt}` : 'missing-link-parameters'
  const currentResult = result?.key === requestKey ? result : null
  const status: VerificationStatus = !uid || !token ? 'invalid' : currentResult?.status ?? 'loading'
  const message = !uid || !token
    ? 'This verification link is missing information. You can request a fresh link using the email address on your account.'
    : currentResult?.message ?? ''

  async function handleResend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResendStatus('sending')
    setResendMessage('')
    try {
      const { data } = await apiClient.post<ApiEnvelope<Record<string, never>>>(
        '/auth/resend-verification/',
        { email },
      )
      setResendMessage(data.message)
      setResendStatus('sent')
    } catch (error: unknown) {
      setResendMessage(getApiError(error).message)
      setResendStatus('error')
    }
  }

  useEffect(() => {
    if (!uid || !token) return

    let active = true

    if (requestRef.current?.key !== requestKey) {
      const promise = apiClient
        .post<ApiEnvelope<Record<string, never>>>('/auth/verify-email/', { uid, token })
        .then(({ data }) => data.message)
      requestRef.current = { key: requestKey, promise }
    }

    requestRef.current.promise
      .then((responseMessage) => {
        if (!active) return
        setResult({
          key: requestKey,
          message: responseMessage,
          status: responseMessage.toLowerCase().includes('already verified') ? 'already-verified' : 'success',
        })
      })
      .catch((error: unknown) => {
        if (!active) return
        const apiError = getApiError(error)
        setResult({
          key: requestKey,
          message: apiError.message,
          status: axios.isAxiosError(error) && error.response?.status === 400 ? 'invalid' : 'error',
        })
      })

    return () => { active = false }
  }, [uid, token, attempt, requestKey])

  const content = {
    loading: {
      eyebrow: 'Email verification',
      title: 'Verifying your email…',
      description: 'This will only take a moment.',
    },
    success: {
      eyebrow: 'You’re all set',
      title: 'Email verified',
      description: message || 'Your email address has been verified.',
    },
    'already-verified': {
      eyebrow: 'Email verification',
      title: 'Already verified',
      description: message || 'This email address has already been verified.',
    },
    invalid: {
      eyebrow: 'Email verification',
      title: 'Link invalid or expired',
      description: message || 'This verification link is no longer valid. Request a fresh link below.',
    },
    error: {
      eyebrow: 'Email verification',
      title: 'Couldn’t verify your email',
      description: message || 'Please check your connection and try again.',
    },
  }[status]

  return (
    <div className="space-y-5 text-center">
      <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${status === 'success' || status === 'already-verified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : status === 'invalid' || status === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-theme-tint text-theme-brand-primary'}`} aria-hidden="true">
        {status === 'loading' ? '…' : status === 'success' || status === 'already-verified' ? '✓' : status === 'invalid' || status === 'error' ? '!' : '✓'}
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-theme-brand-primary">{content.eyebrow}</p>
        <h1 className="text-3xl font-extrabold tracking-tight">{content.title}</h1>
      </div>
      <p role={status === 'error' || status === 'invalid' ? 'alert' : 'status'} className="text-sm leading-6 text-theme-text-secondary">{content.description}</p>

      {status === 'loading' && <div className="mx-auto h-1.5 w-32 overflow-hidden rounded-full bg-theme-border-subtle"><div className="h-full w-1/2 animate-pulse rounded-full bg-theme-accent" /></div>}
      {(status === 'success' || status === 'already-verified') && (
        <Link to="/login" className="inline-flex w-full items-center justify-center rounded-xl bg-theme-brand-primary px-4 py-3.5 text-sm font-bold text-theme-brand-content shadow-md shadow-primary-700/15 transition hover:opacity-90">Go to log in</Link>
      )}
      {status === 'invalid' && (
        <div className="flex flex-col gap-3">
          {resendStatus === 'sent' ? (
            <ApiNotice tone="success" message={resendMessage} />
          ) : (
            <form className="space-y-4 text-left" onSubmit={handleResend}>
              <AuthField
                label="Email address"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              {resendStatus === 'error' && <ApiNotice message={resendMessage} />}
              <button type="submit" disabled={resendStatus === 'sending'} className="w-full rounded-xl bg-theme-brand-primary px-4 py-3.5 text-sm font-bold text-theme-brand-content shadow-md shadow-primary-700/15 transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
                {resendStatus === 'sending' ? 'Sending…' : 'Send a new verification link'}
              </button>
            </form>
          )}
          <Link to="/login" className="text-sm font-semibold text-theme-brand-primary underline-offset-4 hover:underline">Back to log in</Link>
        </div>
      )}
      {status === 'error' && (
        <div className="flex flex-col gap-3">
          <button type="button" onClick={() => setAttempt((current) => current + 1)} className="w-full rounded-xl bg-theme-brand-primary px-4 py-3.5 text-sm font-bold text-theme-brand-content shadow-md shadow-primary-700/15 transition hover:opacity-90">Try again</button>
          <Link to="/login" className="text-sm font-semibold text-theme-brand-primary underline-offset-4 hover:underline">Back to log in</Link>
        </div>
      )}
    </div>
  )
}
