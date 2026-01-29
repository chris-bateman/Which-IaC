import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import AnalyticsConsent from './components/AnalyticsConsent';
import ThemeToggle from './components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Which IaC (beta)',
  description: 'Technical decision aid for IaC tools with inspectable rules and documented inputs.'
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Which IaC (beta)',
  url: 'https://whichiac.com',
  description: 'Technical decision aid for IaC tools with inspectable rules and documented inputs.'
};

const jsonLdString = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
const themeScript = `
(() => {
  const storageKey = 'theme';
  const stored = window.localStorage.getItem(storageKey);
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = stored || preferred;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
`.trim();

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="light" style={{ colorScheme: 'light' }}>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
        <div className="page">
          <header className="site-header">
            <div className="brand">
              <Link href="/">Which IaC (beta)</Link>
              <span className="tagline">Decision aid for IaC tooling</span>
            </div>
            <div className="header-actions">
              <nav aria-label="Primary">
                <Link href="/quiz/">Quiz</Link>
                <Link href="/compare/">Compare</Link>
                <Link href="/about/">About</Link>
                <a
                  href="https://github.com/chris-bateman/Which-IaC"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </nav>
              <ThemeToggle />
            </div>
          </header>
          <main className="content">{children}</main>
          <footer className="site-footer">
            <div className="footer-content">
              <a href="https://github.com/chris-bateman/Which-IaC" target="_blank" rel="noreferrer">
                View source and scoring rules
              </a>
              <AnalyticsConsent />
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
