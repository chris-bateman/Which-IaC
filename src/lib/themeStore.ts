import type { ThemeChoice } from './theme';

type Listener = () => void;

const listeners = new Set<Listener>();

export function getThemeSnapshot(): ThemeChoice {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function subscribeTheme(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setThemeSnapshot(theme: ThemeChoice) {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }
  for (const listener of listeners) {
    listener();
  }
}
