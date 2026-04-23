"use client";

import { useMemo, useState } from "react";

type DiffRow = {
  path: string;
  status: "same" | "changed" | "added" | "removed";
  left: string;
  right: string;
};

type FlatEntry = {
  path: string;
  value: string;
};

const statusClass: Record<DiffRow["status"], string> = {
  same: "bg-white/70",
  changed: "bg-[#fff2d8]",
  added: "bg-[#e1f3e7]",
  removed: "bg-[#fde7df]",
};

function flattenJson(value: unknown, prefix = "root"): FlatEntry[] {
  if (value === null || typeof value !== "object") {
    return [{ path: prefix, value: JSON.stringify(value) }];
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return [{ path: prefix, value: "[]" }];
    }

    return value.flatMap((item, index) => flattenJson(item, `${prefix}[${index}]`));
  }

  const entries = Object.entries(value);
  if (entries.length === 0) {
    return [{ path: prefix, value: "{}" }];
  }

  return entries.flatMap(([key, nested]) => flattenJson(nested, `${prefix}.${key}`));
}

export function JSONDiffTool() {
  const [leftInput, setLeftInput] = useState('{"name":"devtoolsforme","version":1,"features":["json","uuid"]}');
  const [rightInput, setRightInput] = useState('{"name":"devtoolsforme","version":2,"features":["json","uuid","diff"],"region":"eu"}');
  const [showSame, setShowSame] = useState(false);

  const result = useMemo(() => {
    try {
      const leftMap = new Map<string, string>(
        flattenJson(JSON.parse(leftInput)).map((entry: FlatEntry) => [entry.path, entry.value])
      );
      const rightMap = new Map<string, string>(
        flattenJson(JSON.parse(rightInput)).map((entry: FlatEntry) => [entry.path, entry.value])
      );
      const keys = Array.from(new Set([...leftMap.keys(), ...rightMap.keys()])).sort();
      const rows: DiffRow[] = keys.map((key) => {
        const left = leftMap.get(key) ?? "";
        const right = rightMap.get(key) ?? "";

        if (!leftMap.has(key)) {
          return { path: key, status: "added", left: "", right };
        }

        if (!rightMap.has(key)) {
          return { path: key, status: "removed", left, right: "" };
        }

        if (left === right) {
          return { path: key, status: "same", left, right };
        }

        return { path: key, status: "changed", left, right };
      });

      const summary = rows.reduce(
        (accumulator, row) => {
          accumulator[row.status] += 1;
          return accumulator;
        },
        { same: 0, changed: 0, added: 0, removed: 0 }
      );

      return { rows, summary, error: "" };
    } catch (error) {
      return {
        rows: [],
        summary: { same: 0, changed: 0, added: 0, removed: 0 },
        error: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  }, [leftInput, rightInput]);

  const visibleRows = showSame ? result.rows : result.rows.filter((row) => row.status !== "same");

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block space-y-2 text-sm font-semibold text-ink/80">
          Left JSON
          <textarea value={leftInput} onChange={(event) => setLeftInput(event.target.value)} rows={9} className="min-h-[200px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 font-mono text-sm outline-none transition focus:border-accent" />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">
          Right JSON
          <textarea value={rightInput} onChange={(event) => setRightInput(event.target.value)} rows={9} className="min-h-[200px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 font-mono text-sm outline-none transition focus:border-accent" />
        </label>
      </div>

      {result.error ? (
        <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">{result.error}</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-lake">
              <span>Changed {result.summary.changed}</span>
              <span>Added {result.summary.added}</span>
              <span>Removed {result.summary.removed}</span>
              <span>Same {result.summary.same}</span>
            </div>
            <button type="button" onClick={() => setShowSame((value) => !value)} className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-lake transition hover:bg-sage/70">
              {showSame ? "Hide unchanged" : "Show unchanged"}
            </button>
          </div>

          <div className="space-y-3">
            {visibleRows.map((row) => (
              <div key={row.path} className={`grid gap-3 rounded-[1.4rem] p-4 md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)] ${statusClass[row.status]}`}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">{row.status}</p>
                  <code className="mt-2 block break-all font-mono text-xs text-ink">{row.path}</code>
                </div>
                <pre className="whitespace-pre-wrap break-words font-mono text-xs text-ink">{row.left || "-"}</pre>
                <pre className="whitespace-pre-wrap break-words font-mono text-xs text-ink">{row.right || "-"}</pre>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
