"use client";

import { Fragment, useMemo, useState } from "react";

function buildHighlightedParts(text: string, matches: { start: number; end: number }[]) {
  if (matches.length === 0) {
    return [{ value: text, highlight: false }];
  }

  const parts: { value: string; highlight: boolean }[] = [];
  let cursor = 0;

  matches.forEach((match) => {
    if (cursor < match.start) {
      parts.push({ value: text.slice(cursor, match.start), highlight: false });
    }
    parts.push({ value: text.slice(match.start, match.end), highlight: true });
    cursor = match.end;
  });

  if (cursor < text.length) {
    parts.push({ value: text.slice(cursor), highlight: false });
  }

  return parts;
}

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}");
  const [flags, setFlags] = useState("gi");
  const [sample, setSample] = useState("Contact devtoolsforme@example.com or support@example.org for access.");

  const analysis = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
      const matches = Array.from(sample.matchAll(regex)).map((match) => ({
        value: match[0],
        index: match.index ?? 0,
        groups: match.slice(1).filter(Boolean),
      }));
      const highlighted = buildHighlightedParts(
        sample,
        matches.map((match) => ({ start: match.index, end: match.index + match.value.length }))
      );
      return { matches, highlighted, error: "" };
    } catch (error) {
      return {
        matches: [],
        highlighted: [{ value: sample, highlight: false }],
        error: error instanceof Error ? error.message : "Invalid regular expression",
      };
    }
  }, [flags, pattern, sample]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_140px]">
        <label className="block space-y-2 text-sm font-semibold text-ink/80">
          Pattern
          <input value={pattern} onChange={(event) => setPattern(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">
          Flags
          <input value={flags} onChange={(event) => setFlags(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" />
        </label>
      </div>

      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Sample text
        <textarea value={sample} onChange={(event) => setSample(event.target.value)} rows={8} className="min-h-[180px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 text-sm text-ink outline-none transition focus:border-accent" />
      </label>

      {analysis.error ? (
        <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">{analysis.error}</p>
      ) : (
        <>
          <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Highlighted preview</h2>
              <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-lake">{analysis.matches.length} matches</span>
            </div>
            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-8 text-ink">
              {analysis.highlighted.map((part, index) => (
                <Fragment key={`${part.value}-${index}`}>
                  {part.highlight ? <mark className="rounded bg-[#ffd28c] px-1 py-0.5 text-ink">{part.value}</mark> : part.value}
                </Fragment>
              ))}
            </p>
          </div>

          <div className="space-y-3">
            {analysis.matches.length === 0 ? (
              <p className="text-sm text-ink/65">No matches found for the current pattern and flags.</p>
            ) : (
              analysis.matches.map((match, index) => (
                <div key={`${match.index}-${index}`} className="rounded-2xl bg-canvas px-4 py-3 text-sm leading-7 text-ink">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Match {index + 1}</p>
                  <p className="font-mono">{match.value}</p>
                  <p className="text-xs text-ink/55">Index: {match.index}</p>
                  {match.groups.length > 0 && <p className="text-xs text-ink/55">Groups: {match.groups.join(", ")}</p>}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
