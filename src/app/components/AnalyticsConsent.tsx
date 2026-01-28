'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const CONSENT_KEY = 'whichiac:analytics-consent';
const GA_ID = 'G-XH11MVCS63';

type ConsentState = 'unset' | 'granted' | 'denied';

export default function AnalyticsConsent() {
  const [consent, setConsent] = useState<ConsentState>('unset');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === 'granted' || stored === 'denied') {
        setConsent(stored);
      }
    } catch {
      setConsent('unset');
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'granted');
    } catch {
      // Ignore storage failures; user will see the banner again next visit.
    }
    setConsent('granted');
  };

  const decline = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'denied');
    } catch {
      // Ignore storage failures; user will see the banner again next visit.
    }
    setConsent('denied');
  };

  const manage = () => {
    try {
      localStorage.removeItem(CONSENT_KEY);
    } catch {
      // Ignore storage failures; user will see the banner again next visit.
    }
    setConsent('unset');
  };

  return (
    <>
      {consent === 'granted' ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      ) : null}

      {consent !== 'unset' ? (
        <button type="button" className="consent-manage" onClick={manage}>
          Manage cookies
        </button>
      ) : null}

      {consent === 'unset' ? (
        <div className="consent-banner" role="dialog" aria-live="polite">
          <div className="consent-text">
            We use analytics to understand site usage. Do you consent to analytics cookies?
          </div>
          <div className="consent-actions">
            <button type="button" className="ghost" onClick={decline}>
              Decline
            </button>
            <button type="button" className="primary" onClick={accept}>
              Accept
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
