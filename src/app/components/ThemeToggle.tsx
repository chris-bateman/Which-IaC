'use client';

import { useSyncExternalStore } from 'react';
import type { ThemeChoice } from '../../lib/theme';
import { getThemeSnapshot, setThemeSnapshot, subscribeTheme } from '../../lib/themeStore';

const storageKey = 'theme';

const applyTheme = (theme: ThemeChoice) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
};

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => 'light');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem(storageKey, next);
    setThemeSnapshot(next);
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span aria-hidden="true" className="theme-toggle-icon">
        {isDark ? '☾' : '☀'}
      </span>
      <span className="theme-toggle-label">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
