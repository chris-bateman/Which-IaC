'use client';

import dynamic from 'next/dynamic';

const ThemeToggle = dynamic(() => import('./ThemeToggle'), {
  ssr: false,
  loading: () => <div className="theme-toggle-placeholder" aria-hidden="true" />
});

const AnalyticsConsent = dynamic(() => import('./AnalyticsConsent'), {
  ssr: false,
  loading: () => <div className="consent-placeholder" aria-hidden="true" />
});

export function ClientThemeToggle() {
  return <ThemeToggle />;
}

export function ClientAnalyticsConsent() {
  return <AnalyticsConsent />;
}
