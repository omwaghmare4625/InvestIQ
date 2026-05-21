/**
 * useTheme — manages light/dark theme for authenticated app pages.
 * Landing, Login, Signup are always dark (not controlled here).
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (t: Theme) => void;
  compactMode: boolean;
  setCompactMode: (c: boolean) => void;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
    root.classList.toggle('light', !prefersDark);
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      compactMode: false,
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      setCompactMode: (compactMode) => {
        set({ compactMode });
      },
    }),
    { name: 'investiq-theme' }
  )
);

/** Call once on app boot to restore saved theme */
export function initTheme() {
  const saved = localStorage.getItem('investiq-theme');
  let theme: Theme = 'light';
  try {
    const parsed = JSON.parse(saved ?? '{}');
    theme = parsed?.state?.theme ?? 'light';
  } catch {}
  applyTheme(theme);
}
