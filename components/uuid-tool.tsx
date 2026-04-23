"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

function createBatch(size: number) {
  return Array.from({ length: size }, () => crypto.randomUUID());
}

export function UUIDTool() {
  const [count, setCount] = useState(4);
  const [refreshKey, setRefreshKey] = useState(0);

  const uuids = useMemo(() => createBatch(count), [count, refreshKey]);
  const joined = uuids.join("\n");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex min-w-[180px] flex-col gap-2 text-sm font-medium text-ink/80">
          Number of UUIDs
          <input
            type="range"
            min={1}
            max={12}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="accent-accent"
          />
          <span className="font-mono text-lg text-lake">{count}</span>
        </label>
        <button
          type="button"
          onClick={() => setRefreshKey((value) => value + 1)}
          className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accentDark"
        >
          Generate new batch
        </button>
        <CopyButton value={joined} label="Copy all" />
      </div>

      <div className="grid gap-3">
        {uuids.map((uuid, index) => (
          <div
            key={`${uuid}-${index}`}
            className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white/70 p-4 md:flex-row md:items-center md:justify-between"
          >
            <code className="overflow-x-auto font-mono text-sm text-lake">{uuid}</code>
            <CopyButton value={uuid} />
          </div>
        ))}
      </div>
    </div>
  );
}
