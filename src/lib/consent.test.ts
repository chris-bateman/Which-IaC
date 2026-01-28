import { describe, expect, it } from 'vitest';
import { clearConsent, readConsent, writeConsent } from './consent';

function createStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    getSnapshot: () => Object.fromEntries(store.entries())
  };
}

describe('consent storage helpers', () => {
  it('reads valid consent values', () => {
    const storage = createStorage({ 'whichiac:analytics-consent': 'granted' });
    expect(readConsent(storage)).toBe('granted');
  });

  it('returns unset for missing or invalid values', () => {
    const empty = createStorage();
    expect(readConsent(empty)).toBe('unset');

    const invalid = createStorage({ 'whichiac:analytics-consent': 'maybe' });
    expect(readConsent(invalid)).toBe('unset');
  });

  it('writes and clears consent values', () => {
    const storage = createStorage();
    writeConsent(storage, 'denied');
    expect(storage.getSnapshot()).toEqual({ 'whichiac:analytics-consent': 'denied' });

    clearConsent(storage);
    expect(storage.getSnapshot()).toEqual({});
  });
});
