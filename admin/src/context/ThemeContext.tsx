import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { palette, semanticColors } from '../theme/colors';
import type { ThemeMode, ActiveTheme } from '../theme/colors';

interface ThemeContextType {
  themeMode: ThemeMode;
  activeTheme: ActiveTheme;
  isDark: boolean;
  colors: typeof semanticColors.light | typeof semanticColors.dark;
  palette: typeof palette;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  activeTheme: 'light',
  isDark: false,
  colors: semanticColors.light,
  palette,
  setThemeMode: () => {},
});

const STORAGE_KEY = 'aptpal_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved;
      }
    }
    return 'system';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const activeTheme: ActiveTheme = useMemo(() => {
    if (themeMode === 'system') {
      return systemIsDark ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, systemIsDark]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (activeTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [activeTheme]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  };

  const value = useMemo(() => ({
    themeMode,
    activeTheme,
    isDark: activeTheme === 'dark',
    colors: semanticColors[activeTheme],
    palette,
    setThemeMode,
  }), [themeMode, activeTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
