"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

export function URLParserTool() {
  const [input, setInput] = useState("https://devtoolsforme.com/tools/json-formatter?mode=pretty&lang=en#output");

  const parsed = useMemo(() => {
    try {
      const url = new URL(input);
      return {
        href: url.href,
        protocol: url.protocol,
        host: url.host,
        hostname: url.hostname,
        port: url.port || "default",
        pathname: url.pathname,
        hash: url.hash || "none",
        search: url.search || "none",
        params: Array.from(url.searchParams.entries()),
      };
    } catch {
      return null;
    }
  }, [input]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        URL
        <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={5} className="min-h-[130px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 text-sm outline-none transition focus:border-accent" />
      </label>

      {!parsed ? (
        <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">Enter a full valid URL including protocol.</p>
      ) : (
        <div className="grid gap-3">
          {Object.entries(parsed)
            .filter(([key]) => key !== "params")
            .map(([label, value]) => (
              <div key={label} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">{label}</p>
                  <CopyButton value={String(value)} />
                </div>
                <code className="block overflow-x-auto font-mono text-sm text-ink">{String(value)}</code>
              </div>
            ))}
          <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Query parameters</p>
            <div className="mt-3 space-y-2 text-sm text-ink">
              {parsed.params.length === 0 ? <p>No query parameters found.</p> : parsed.params.map(([key, value]) => <p key={`${key}-${value}`}><span className="font-mono text-lake">{key}</span> = <span className="font-mono">{value}</span></p>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
