'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { clearConsent, readConsent, writeConsent, type ConsentState } from '../../lib/consent';
const GA_ID = 'G-XH11MVCS63';

export default function AnalyticsConsent() {
  const [consent, setConsent] = useState<ConsentState>('unset');

  useEffect(() => {
    setConsent(readConsent(localStorage));
  }, []);

  const accept = () => {
    writeConsent(localStorage, 'granted');
    setConsent('granted');
  };

  const decline = () => {
    writeConsent(localStorage, 'denied');
    setConsent('denied');
  };

  const manage = () => {
    clearConsent(localStorage);
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
