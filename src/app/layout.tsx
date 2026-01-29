import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { ClientAnalyticsConsent, ClientThemeToggle } from './components/ClientIslands';

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

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-sans'
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-mono'
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="light" style={{ colorScheme: 'light' }}>
      <body
        suppressHydrationWarning
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
      >
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
              <ClientThemeToggle />
            </div>
          </header>
          <main className="content">{children}</main>
          <footer className="site-footer">
            <div className="footer-content">
              <a
                className="footer-link"
                href="https://www.linkedin.com/in/chris-bateman1/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile for Chris Bateman"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  focusable="false"
                  role="img"
                >
                  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 23.5h4V8.5h-4v15ZM8.5 8.5h3.8v2.04h.05c.53-1 1.84-2.04 3.78-2.04 4.04 0 4.78 2.66 4.78 6.12v8.88h-4v-7.88c0-1.88-.03-4.3-2.62-4.3-2.62 0-3.02 2.04-3.02 4.16v8.02h-4v-15Z" />
                </svg>
                <span className="sr-only">LinkedIn: Chris Bateman</span>
              </a>
              <ClientAnalyticsConsent />
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
