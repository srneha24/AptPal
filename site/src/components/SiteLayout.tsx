import { NavLink, Outlet } from 'react-router-dom';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { ThemeMode } from '../theme/colors';

const frontendBaseUrl = import.meta.env.VITE_FRONTEND_URL?.replace(/\/+$/, '');

if (!frontendBaseUrl) {
  throw new Error('VITE_FRONTEND_URL must be configured in site/.env');
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `site-nav-link${isActive ? ' site-nav-link--active' : ''}`;

export function SiteLayout() {
  const { themeMode, setThemeMode } = useTheme();
  const nextThemeMode: Record<ThemeMode, ThemeMode> = {
    system: 'light',
    light: 'dark',
    dark: 'system',
  };
  const ThemeIcon = themeMode === 'system'
    ? Monitor
    : themeMode === 'dark'
      ? Moon
      : Sun;

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <NavLink className="site-brand" to="/" aria-label="AptPal home">
            <img
              className="site-brand-mark"
              src="/android-chrome-192x192.png"
              alt=""
              aria-hidden="true"
            />
            <span>AptPal</span>
          </NavLink>

          <nav className="site-main-nav" aria-label="Main navigation">
            <NavLink className={navLinkClass} to="/postings">Postings</NavLink>
            <NavLink className={navLinkClass} to="/about">About</NavLink>
          </nav>

          <div className="site-header-actions">
            <a className="site-login-link" href={`${frontendBaseUrl}/login`}>Log in</a>
            <a className="site-signup-link" href={`${frontendBaseUrl}/signup`}>Join AptPal</a>
            <button
              type="button"
              className="theme-toggle-button"
              aria-label={`Theme: ${themeMode}. Switch to ${nextThemeMode[themeMode]} mode`}
              title={`Theme: ${themeMode}`}
              onClick={() => setThemeMode(nextThemeMode[themeMode])}
            >
              <ThemeIcon size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="site-footer">
        <div className="site-footer-inner">
          <span>AptPal</span>
          <nav aria-label="Footer navigation">
            <NavLink to="/postings">Postings</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </div>
      </footer>
    </div>
  );
}
