"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

function fromTimestamp(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const numeric = Number(trimmed);
  if (Number.isNaN(numeric)) {
    return null;
  }

  const milliseconds = trimmed.length <= 10 ? numeric * 1000 : numeric;
  const date = new Date(milliseconds);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function TimestampConverterTool() {
  const [timestamp, setTimestamp] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().slice(0, 16));

  const timestampDate = useMemo(() => fromTimestamp(timestamp), [timestamp]);
  const fromDateInput = useMemo(() => {
    if (!dateInput) {
      return null;
    }

    const date = new Date(dateInput);
    return Number.isNaN(date.getTime()) ? null : date;
  }, [dateInput]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
          <label className="block space-y-2 text-sm font-semibold text-ink/80">
            Unix timestamp
            <input
              value={timestamp}
              onChange={(event) => setTimestamp(event.target.value)}
              className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-lg outline-none transition focus:border-accent"
            />
          </label>
          <div className="mt-4 space-y-3 text-sm leading-7 text-ink/75">
            <div className="rounded-2xl bg-canvas px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">UTC</p>
              <p className="font-mono">{timestampDate ? timestampDate.toISOString() : "Invalid timestamp"}</p>
            </div>
            <div className="rounded-2xl bg-canvas px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Local</p>
              <p className="font-mono">{timestampDate ? timestampDate.toLocaleString() : "Invalid timestamp"}</p>
            </div>
          </div>
          <div className="mt-4">
            <CopyButton value={timestampDate ? timestampDate.toISOString() : ""} label="Copy UTC" />
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
          <label className="block space-y-2 text-sm font-semibold text-ink/80">
            Date and time
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(event) => setDateInput(event.target.value)}
              className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-lg outline-none transition focus:border-accent"
            />
          </label>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-ink/75">
            <div className="rounded-2xl bg-canvas px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Unix seconds</p>
              <p className="font-mono">{fromDateInput ? Math.floor(fromDateInput.getTime() / 1000) : "Invalid date"}</p>
            </div>
            <div className="rounded-2xl bg-canvas px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Unix milliseconds</p>
              <p className="font-mono">{fromDateInput ? fromDateInput.getTime() : "Invalid date"}</p>
            </div>
          </div>
          <div className="mt-4">
            <CopyButton
              value={fromDateInput ? String(Math.floor(fromDateInput.getTime() / 1000)) : ""}
              label="Copy seconds"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
