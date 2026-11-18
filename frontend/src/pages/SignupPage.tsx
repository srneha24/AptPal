import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getApiError } from '../api/client'
import { useAuth } from '../auth/useAuth'
import { ApiNotice } from '../components/ApiNotice'
import { AuthField } from '../components/AuthField'

export function SignupPage() {
  const { signup } = useAuth()
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signupComplete, setSignupComplete] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    const form = event.currentTarget
    const formData = new FormData(form)
    const password = String(formData.get('password'))
    const passwordConfirmation = String(formData.get('password_confirmation'))

    if ([...password].length < 8) {
      setFieldErrors({ password: 'Password must be at least 8 characters.' })
      return
    }

    if (password !== passwordConfirmation) {
      setFieldErrors({ password_confirmation: 'Passwords do not match.' })
      return
    }

    setIsSubmitting(true)
    try {
      await signup(
        String(formData.get('first_name')).trim(),
        String(formData.get('last_name')).trim(),
        String(formData.get('email')).trim(),
        password,
      )
      setSignupComplete(true)
    } catch (requestError) {
      const apiError = getApiError(requestError)
      setError(apiError.message)
      setFieldErrors(apiError.fieldErrors)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (signupComplete) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" aria-hidden="true">✓</div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-theme-brand-primary">One more step</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Check your email</h1>
        </div>
        <ApiNotice tone="success" message="Your MyTempHome account has been created. Use the verification link in your email before logging in." />
        <Link to="/login" className="inline-flex w-full items-center justify-center rounded-xl bg-theme-brand-primary px-4 py-3.5 text-sm font-bold text-theme-brand-content shadow-md shadow-primary-700/15 transition hover:opacity-90">Go to log in</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-theme-brand-primary">Get started</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm leading-6 text-theme-text-secondary">One account for finding a place or sharing a listing.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {error && <ApiNotice message={error} />}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AuthField label="First name" name="first_name" type="text" placeholder="First name" autoComplete="given-name" required error={fieldErrors.first_name} />
          <AuthField label="Last name" name="last_name" type="text" placeholder="Last name" autoComplete="family-name" required error={fieldErrors.last_name} />
        </div>
        <AuthField label="Email address" name="email" type="email" placeholder="you@example.com" autoComplete="email" required error={fieldErrors.email} />
        <AuthField label="Password" name="password" type="password" placeholder="Create a password" autoComplete="new-password" required error={fieldErrors.password} hint="Use at least 8 characters." />
        <AuthField label="Confirm password" name="password_confirmation" type="password" placeholder="Enter your password again" autoComplete="new-password" required error={fieldErrors.password_confirmation} />
        <p className="text-xs leading-5 text-theme-text-muted">We’ll email you a verification link.</p>
        <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center rounded-xl bg-theme-brand-primary px-4 py-3.5 text-sm font-bold text-theme-brand-content shadow-md shadow-primary-700/15 transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-brand-primary disabled:cursor-wait disabled:opacity-60">
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-theme-text-secondary">
        Already have an account? <Link className="font-bold text-theme-brand-primary underline-offset-4 hover:underline" to="/login">Log in</Link>
      </p>
    </div>
  )
}
