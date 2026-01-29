import { clearConsent, readConsent, writeConsent, type ConsentState } from './consent';

type Listener = () => void;

const listeners = new Set<Listener>();

export function getConsentSnapshot(): ConsentState {
  if (typeof window === 'undefined') return 'unset';
  return readConsent(localStorage);
}

export function subscribeConsent(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setConsentSnapshot(value: Exclude<ConsentState, 'unset'>) {
  if (typeof window !== 'undefined') {
    writeConsent(localStorage, value);
  }
  for (const listener of listeners) {
    listener();
  }
}

export function clearConsentSnapshot() {
  if (typeof window !== 'undefined') {
    clearConsent(localStorage);
  }
  for (const listener of listeners) {
    listener();
  }
}
