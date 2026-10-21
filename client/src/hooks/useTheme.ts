import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'speclens_theme';
const EVENT_NAME = 'speclens_theme_updated';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)')?.matches) {
      return 'dark';
    }
  } catch {
    // Ignore
  }
  return 'light';
}

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // Ignore storage errors
  }
  return getSystemTheme();
}

function applyThemeToDocument(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const initial = getInitialTheme();
    applyThemeToDocument(initial);
    return initial;
  });

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  useEffect(() => {
    const handleSync = () => {
      const current = getInitialTheme();
      setThemeState(current);
      applyThemeToDocument(current);
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener(EVENT_NAME, handleSync);

    const mediaQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const handleMediaChange = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          const newTheme: Theme = e.matches ? 'dark' : 'light';
          setThemeState(newTheme);
          applyThemeToDocument(newTheme);
        }
      } catch {
        // Ignore
      }
    };

    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    }

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener(EVENT_NAME, handleSync);
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      }
    };
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch {
      // Ignore quota errors
    }
    setThemeState(newTheme);
    applyThemeToDocument(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme
  };
}
