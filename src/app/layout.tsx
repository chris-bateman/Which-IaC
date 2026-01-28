import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import AnalyticsConsent from './components/AnalyticsConsent';

export const metadata: Metadata = {
  title: 'Which IaC',
  description: 'Compare infrastructure as code tools with transparent, auditable rules.'
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Which IaC',
  url: 'https://whichiac.com',
  description: 'Compare infrastructure as code tools with transparent, auditable rules.'
};

const jsonLdString = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
        <AnalyticsConsent />
        <div className="page">
          <header className="site-header">
            <div className="brand">
              <Link href="/">Which IaC</Link>
              <span className="tagline">Tools that fit your needs</span>
            </div>
            <nav aria-label="Primary">
              <Link href="/quiz/">Quiz</Link>
              <Link href="/compare/">Compare</Link>
              <Link href="/about/">About</Link>
              <a href="https://github.com/chris-bateman/Which-IaC" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </nav>
          </header>
          <main className="content">{children}</main>
          <footer className="site-footer">
            <div>
              <a href="https://github.com/chris-bateman/Which-IaC" target="_blank" rel="noreferrer">
                View the project on GitHub
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
