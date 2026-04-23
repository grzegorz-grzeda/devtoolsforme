"use client";

import { useMemo, useState } from "react";

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}");
  const [flags, setFlags] = useState("gi");
  const [sample, setSample] = useState("Contact devtoolsforme@example.com or support@example.org for access.");

  const analysis = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = Array.from(sample.matchAll(regex));
      return { matches, error: "" };
    } catch (error) {
      return {
        matches: [],
        error: error instanceof Error ? error.message : "Invalid regular expression",
      };
    }
  }, [flags, pattern, sample]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_140px]">
        <label className="block space-y-2 text-sm font-semibold text-ink/80">
          Pattern
          <input
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent"
          />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">
          Flags
          <input
            value={flags}
            onChange={(event) => setFlags(event.target.value)}
            className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent"
          />
        </label>
      </div>

      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Sample text
        <textarea
          value={sample}
          onChange={(event) => setSample(event.target.value)}
          rows={8}
          className="min-h-[180px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 text-sm text-ink outline-none transition focus:border-accent"
        />
      </label>

      {analysis.error ? (
        <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">{analysis.error}</p>
      ) : (
        <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Matches</h2>
            <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-lake">
              {analysis.matches.length}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {analysis.matches.length === 0 ? (
              <p className="text-sm text-ink/65">No matches found for the current pattern and flags.</p>
            ) : (
              analysis.matches.map((match, index) => (
                <div key={`${match.index}-${index}`} className="rounded-2xl bg-canvas px-4 py-3 text-sm leading-7 text-ink">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Match {index + 1}</p>
                  <p className="font-mono">{match[0]}</p>
                  <p className="text-xs text-ink/55">Index: {match.index ?? 0}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
