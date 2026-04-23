"use client";

import { useMemo, useState } from "react";

const mimeEntries = [
  ["json", "application/json"],
  ["js", "text/javascript"],
  ["ts", "video/mp2t"],
  ["html", "text/html"],
  ["css", "text/css"],
  ["svg", "image/svg+xml"],
  ["png", "image/png"],
  ["jpg", "image/jpeg"],
  ["webp", "image/webp"],
  ["pdf", "application/pdf"],
  ["zip", "application/zip"],
  ["csv", "text/csv"],
  ["xml", "application/xml"],
  ["md", "text/markdown"],
  ["woff2", "font/woff2"],
] as const;

export function MIMELookupTool() {
  const [query, setQuery] = useState("json");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return mimeEntries.filter(([extension, mime]) => !normalized || extension.includes(normalized) || mime.includes(normalized));
  }, [query]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Search extension or MIME type
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-lg outline-none transition focus:border-accent" />
      </label>
      <div className="space-y-3">
        {results.map(([extension, mime]) => (
          <div key={extension} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">.{extension}</p>
            <p className="mt-2 font-mono text-sm text-ink">{mime}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
