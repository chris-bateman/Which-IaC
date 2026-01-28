export type ConsentState = 'unset' | 'granted' | 'denied';

const CONSENT_KEY = 'whichiac:analytics-consent';

export function readConsent(storage: Pick<Storage, 'getItem'>): ConsentState {
  try {
    const stored = storage.getItem(CONSENT_KEY);
    if (stored === 'granted' || stored === 'denied') {
      return stored;
    }
  } catch {
    // Ignore storage errors and fall back to unset.
  }
  return 'unset';
}

export function writeConsent(
  storage: Pick<Storage, 'setItem'>,
  value: Exclude<ConsentState, 'unset'>
): void {
  try {
    storage.setItem(CONSENT_KEY, value);
  } catch {
    // Ignore storage errors; caller should update UI state regardless.
  }
}

export function clearConsent(storage: Pick<Storage, 'removeItem'>): void {
  try {
    storage.removeItem(CONSENT_KEY);
  } catch {
    // Ignore storage errors; caller should update UI state regardless.
  }
}
