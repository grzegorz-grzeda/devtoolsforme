"use client";

import { useEffect, useState } from "react";

const consentKey = "dtfm-consent-analytics";
const gaId = process.env.NEXT_PUBLIC_GA_ID;

function dispatchConsentUpdate() {
  window.dispatchEvent(new Event("analytics-consent-changed"));
}

export function ConsentBanner() {
  const [resolved, setResolved] = useState(true);

  useEffect(() => {
    const current = window.localStorage.getItem(consentKey);
    setResolved(Boolean(current));
  }, []);

  function choose(value: "granted" | "denied") {
    window.localStorage.setItem(consentKey, value);
    setResolved(true);
    dispatchConsentUpdate();
  }

  if (!gaId || resolved) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-[1.8rem] border border-white/70 bg-ink p-5 text-white shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Privacy choices</p>
          <p className="mt-2 text-sm leading-7 text-white/85">
            We use Google Analytics only if you allow it. Accept to enable usage insights, or decline to keep analytics off.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accentDark"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
