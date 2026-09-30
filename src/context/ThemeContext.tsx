import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_STORAGE_KEY = 'portalbuild_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });

  const applyThemeToDOM = (targetTheme: Theme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    if (targetTheme === 'light') {
      root.classList.add('theme-light-active');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      if (body) {
        body.style.backgroundColor = '#f8fafc';
        body.style.color = '#0f172a';
      }
    } else {
      root.classList.remove('theme-light-active');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      if (body) {
        body.style.backgroundColor = '#020617';
        body.style.color = '#ffffff';
      }
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {}
    applyThemeToDOM(newTheme);
    window.dispatchEvent(new CustomEvent('portalbuild-theme-changed', { detail: { theme: newTheme } }));
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  // Sync to DOM on initial mount & listen for multi-tab / event updates
  useEffect(() => {
    applyThemeToDOM(theme);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue);
        applyThemeToDOM(e.newValue);
      }
    };

    const handleCustomChange = (e: Event) => {
      const custom = e as CustomEvent<{ theme: Theme }>;
      if (custom.detail?.theme && custom.detail.theme !== theme) {
        setThemeState(custom.detail.theme);
        applyThemeToDOM(custom.detail.theme);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('portalbuild-theme-changed', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('portalbuild-theme-changed', handleCustomChange);
    };
  }, [theme]);

  // Global hotkey: Ctrl/Cmd + Shift + L or Alt + T to toggle theme
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable);

      if (isInput) return;

      if ((e.shiftKey && (e.metaKey || e.ctrlKey) && (e.key === 'L' || e.key === 'l')) || (e.altKey && (e.key === 't' || e.key === 'T'))) {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isLight: theme === 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Graceful fallback if called outside provider
    return {
      theme: 'dark' as Theme,
      toggleTheme: () => {},
      setTheme: () => {},
      isLight: false,
    };
  }
  return context;
}
