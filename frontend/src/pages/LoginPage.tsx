import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiError } from '../api/client'
import { useAuth } from '../auth/useAuth'
import { ApiNotice } from '../components/ApiNotice'
import { AuthField } from '../components/AuthField'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)

    try {
      await login(String(formData.get('email')).trim(), String(formData.get('password')))
      navigate('/', { replace: true })
    } catch (requestError) {
      const apiError = getApiError(requestError)
      setError(apiError.message)
      setFieldErrors(apiError.fieldErrors)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-theme-brand-primary">Welcome back</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Log in to AptPal</h1>
        <p className="mt-2 text-sm leading-6 text-theme-text-secondary">Find your next place and keep your rental plans in one spot.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {error && <ApiNotice message={error} />}
        <AuthField label="Email address" name="email" type="email" placeholder="you@example.com" autoComplete="email" required error={fieldErrors.email} />
        <AuthField label="Password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" required error={fieldErrors.password} />
        <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center rounded-xl bg-theme-brand-primary px-4 py-3.5 text-sm font-bold text-theme-brand-content shadow-md shadow-primary-700/15 transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-brand-primary disabled:cursor-wait disabled:opacity-60">
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-theme-text-secondary">
        New to AptPal? <Link className="font-bold text-theme-brand-primary underline-offset-4 hover:underline" to="/signup">Create an account</Link>
      </p>
    </div>
  )
}
