import { describe, expect, it } from 'vitest';
import { resolveThemeChoice } from './theme';

describe('resolveThemeChoice', () => {
  it('returns stored theme when valid', () => {
    expect(resolveThemeChoice('dark', false)).toBe('dark');
    expect(resolveThemeChoice('light', true)).toBe('light');
  });

  it('falls back to prefers-color-scheme when storage is unset', () => {
    expect(resolveThemeChoice(null, true)).toBe('dark');
    expect(resolveThemeChoice(null, false)).toBe('light');
  });

  it('ignores invalid stored values', () => {
    expect(resolveThemeChoice('invalid', true)).toBe('dark');
    expect(resolveThemeChoice('invalid', false)).toBe('light');
  });
});
