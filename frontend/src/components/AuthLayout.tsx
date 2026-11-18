import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import aptPalLogo from '../assets/logo.png'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-theme-bg px-4 py-10 text-theme-text-primary transition-colors duration-200 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-200/50 blur-3xl dark:bg-primary-700/30" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-quaternary-200/40 blur-3xl dark:bg-secondary-700/25" />
      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-7 flex items-center justify-center gap-3 text-theme-text-primary no-underline">
          <img src={aptPalLogo} alt="AptPal" className="h-24 w-24 rounded-2xl object-cover" />
        </Link>
        <section className="rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-xl shadow-primary-700/5 transition-colors duration-200 sm:p-9">
          {children}
        </section>
        <p className="mt-6 text-center text-xs text-theme-text-muted">A better place to find your next home.</p>
      </div>
    </main>
  )
}
