import { resolveThemeChoice, type ThemeChoice } from './theme';

type Listener = () => void;

const listeners = new Set<Listener>();
const storageKey = 'theme';

export function getThemeSnapshot(): ThemeChoice {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(storageKey);
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  const resolved = resolveThemeChoice(stored, prefersDark);
  if (document.documentElement.dataset.theme !== resolved) {
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  }
  return resolved;
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
