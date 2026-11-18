import { ThemeProvider, useTheme } from './context/ThemeContext';
import type { ThemeMode } from './theme/colors';
import { Sun, Moon, Monitor, ShieldCheck } from 'lucide-react';

function AdminContent() {
  const { themeMode, setThemeMode, activeTheme, palette } = useTheme();

  const modes: { key: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { key: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
    { key: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { key: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col items-center justify-center p-6 text-center transition-colors duration-200">
      <div className="max-w-md w-full bg-theme-surface rounded-3xl shadow-sm border border-theme-border p-8 transition-colors duration-200">
        {/* App Logo */}
        <div className="w-16 h-16 rounded-2xl bg-theme-tint flex items-center justify-center mx-auto mb-4 text-theme-brand-primary font-extrabold text-2xl shadow-inner transition-colors duration-200">
          AP
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-tint text-theme-brand-primary text-xs font-bold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>MyTempHome Operations & Security</span>
        </div>

        <h1 className="text-3xl font-extrabold text-theme-text-primary mb-1">MyTempHome Admin</h1>
        <p className="text-theme-text-secondary mb-6 text-sm">
          Management portal for post approvals, landlord verification, and platform analytics.
        </p>

        {/* Color Palette Indicators */}
        <div className="flex gap-2 justify-center mb-6">
          <span className="w-5 h-5 rounded-full" style={{ backgroundColor: palette.primary.base }} title="Primary Base" />
          <span className="w-5 h-5 rounded-full" style={{ backgroundColor: palette.secondary.base }} title="Secondary Base" />
          <span className="w-5 h-5 rounded-full" style={{ backgroundColor: palette.tertiary.base }} title="Tertiary Base" />
          <span className="w-5 h-5 rounded-full" style={{ backgroundColor: palette.quaternary.base }} title="Quaternary Base" />
        </div>

        {/* Theme Selector (System / Light / Dark) */}
        <div className="mb-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-theme-text-muted mb-2">
            Theme: <span className="capitalize">{themeMode}</span> ({activeTheme})
          </div>
          <div className="grid grid-cols-3 gap-1 bg-theme-bg p-1 rounded-xl border border-theme-border-subtle">
            {modes.map((m) => {
              const isSelected = themeMode === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setThemeMode(m.key)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-theme-brand-primary text-theme-brand-content shadow-sm'
                      : 'text-theme-text-secondary hover:text-theme-text-primary'
                  }`}
                >
                  {m.icon}
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AdminContent />
    </ThemeProvider>
  );
}
