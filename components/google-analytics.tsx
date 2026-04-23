"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const consentKey = "dtfm-consent-analytics";

function readConsent() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(consentKey) === "granted";
}

export function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const updateConsent = () => setEnabled(readConsent());
    updateConsent();
    window.addEventListener("analytics-consent-changed", updateConsent);
    return () => window.removeEventListener("analytics-consent-changed", updateConsent);
  }, []);

  if (!GA_ID || !enabled) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
