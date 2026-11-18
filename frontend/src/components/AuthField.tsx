import { useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function AuthField({ label, error, hint, id, className = '', type = 'text', ...inputProps }: AuthFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = id ?? inputProps.name
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-semibold text-theme-text-primary">{label}</label>
      <div className="relative">
        <input
          {...inputProps}
          id={inputId}
          type={type === 'password' && showPassword ? 'text' : type}
          aria-invalid={Boolean(error)}
          aria-describedby={[error && errorId, hint && hintId].filter(Boolean).join(' ') || undefined}
          className={`w-full rounded-xl border bg-theme-bg px-4 py-3 text-sm text-theme-text-primary outline-none transition placeholder:text-theme-text-muted focus:border-theme-brand-primary focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-700/30 ${error ? 'border-red-500' : 'border-theme-border'} ${type === 'password' ? 'pr-12' : ''} ${className}`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-theme-text-muted transition hover:text-theme-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-theme-brand-primary"
          >
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        )}
      </div>
      {error && <p id={errorId} className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
      {hint && <p id={hintId} className="text-xs text-theme-text-muted">{hint}</p>}
    </div>
  )
}
