import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { AuthProvider } from './auth/AuthContext'
import { useAuth } from './auth/useAuth'
import aptPalLogo from './assets/logo.png'
import { AuthLayout } from './components/AuthLayout'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { VerifyEmailPage } from './pages/VerifyEmailPage'
import type { ThemeMode } from './theme/colors'
import type { ReactNode } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

function HomePage() {
  const { themeMode, setThemeMode, activeTheme, palette } = useTheme()
  const { user, logout } = useAuth()

  const modes: { key: ThemeMode; label: string; icon: ReactNode }[] = [
    { key: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
    { key: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { key: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-theme-bg p-6 text-center transition-colors duration-200">
      <section className="w-full max-w-md rounded-3xl border border-theme-border bg-theme-surface p-8 shadow-sm transition-colors duration-200">
        <img src={aptPalLogo} alt="AptPal" className="mx-auto mb-4 h-28 w-28 rounded-2xl object-cover" />
        <p className="mb-2 text-sm text-theme-text-secondary">Find and post rentals with ease.</p>
        {user ? (
          <div className="mb-6 flex items-center justify-center gap-2 text-sm text-theme-text-secondary">
            <span>Signed in as {user.first_name}</span>
            <button type="button" onClick={logout} className="font-semibold text-theme-brand-primary underline underline-offset-4">Sign out</button>
          </div>
        ) : (
          <div className="mb-6 flex justify-center gap-4 text-sm font-semibold">
            <Link className="text-theme-brand-primary underline underline-offset-4" to="/login">Log in</Link>
            <Link className="text-theme-brand-primary underline underline-offset-4" to="/signup">Create an account</Link>
          </div>
        )}

        <div className="mb-6 flex justify-center gap-2">
          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: palette.primary.base }} title="Primary Base" />
          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: palette.secondary.base }} title="Secondary Base" />
          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: palette.tertiary.base }} title="Tertiary Base" />
          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: palette.quaternary.base }} title="Quaternary Base" />
        </div>

        <div className="mb-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-theme-text-muted">
            Theme: <span className="capitalize">{themeMode}</span> ({activeTheme})
          </div>
          <div className="grid grid-cols-3 gap-1 rounded-xl border border-theme-border-subtle bg-theme-bg p-1">
            {modes.map((mode) => {
              const isSelected = themeMode === mode.key
              return (
                <button
                  key={mode.key}
                  type="button"
                  onClick={() => setThemeMode(mode.key)}
                  aria-pressed={isSelected}
                  className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${isSelected ? 'bg-theme-brand-primary text-theme-brand-content shadow-sm' : 'text-theme-text-secondary hover:text-theme-text-primary'}`}
                >
                  {mode.icon}
                  {mode.label}
                </button>
              )
            })}
          </div>
        </div>
        <button type="button" className="w-full rounded-xl bg-theme-accent px-4 py-3.5 font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
          Explore Rentals
        </button>
      </section>
    </main>
  )
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/signup" element={user ? <Navigate to="/" replace /> : <AuthLayout><SignupPage /></AuthLayout>} />
      <Route path="/verify-email" element={<AuthLayout><VerifyEmailPage /></AuthLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
