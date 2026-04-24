"use client";

import { useMemo, useState } from "react";
import { filterHTTPStatuses, popularCodes } from "@/lib/http-status";

export function HTTPStatusTool() {
  const [query, setQuery] = useState("404");

  const matches = useMemo(() => filterHTTPStatuses(query), [query]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Search by code, label, or scenario
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try 404, websocket, retry-after, upload"
          className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-lg outline-none transition focus:border-accent"
        />
      </label>
      <div className="flex flex-wrap gap-3">
        {popularCodes.map((code) => (
          <button key={code} type="button" onClick={() => setQuery(code)} className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-lake transition hover:bg-sage/70">{code}</button>
        ))}
      </div>
      <p className="text-sm text-ink/60">
        Showing {matches.length} standard status {matches.length === 1 ? "code" : "codes"}.
      </p>
      <div className="grid gap-3">
        {matches.map(([code, info]) => (
          <div key={code} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">{info.category}</p>
                <h2 className="text-2xl font-bold tracking-tight text-ink">{code} {info.title}</h2>
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-ink/70">{info.detail}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-sage/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Example use cases</p>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-ink/80">
                  {info.examples.map((example) => (
                    <li key={example} className="list-inside list-disc">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-cloud/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Troubleshooting / follow-up</p>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-ink/80">
                  {info.mitigation.map((step) => (
                    <li key={step} className="list-inside list-disc">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
