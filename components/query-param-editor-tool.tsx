"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

type ParamRow = { key: string; value: string; id: string };

export function QueryParamEditorTool() {
  const [baseUrl, setBaseUrl] = useState("https://devtoolsforme.com/tools/url-parser");
  const [rows, setRows] = useState<ParamRow[]>([
    { id: "1", key: "tab", value: "overview" },
    { id: "2", key: "lang", value: "en" },
  ]);

  const finalUrl = useMemo(() => {
    try {
      const url = new URL(baseUrl);
      url.search = "";
      rows.forEach((row) => {
        if (row.key) {
          url.searchParams.set(row.key, row.value);
        }
      });
      return url.toString();
    } catch {
      return "Enter a full base URL including protocol.";
    }
  }, [baseUrl, rows]);

  function updateRow(id: string, field: "key" | "value", value: string) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Base URL
        <input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent" />
      </label>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <input value={row.key} onChange={(event) => updateRow(row.id, "key", event.target.value)} placeholder="key" className="rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent" />
            <input value={row.value} onChange={(event) => updateRow(row.id, "value", event.target.value)} placeholder="value" className="rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent" />
            <button type="button" onClick={() => setRows((current) => current.filter((entry) => entry.id !== row.id))} className="rounded-full bg-lake px-4 py-2 text-sm font-semibold text-white transition hover:bg-lake/90">Remove</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setRows((current) => [...current, { id: crypto.randomUUID(), key: "", value: "" }])} className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-lake transition hover:bg-sage/70">Add parameter</button>
      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
        <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Final URL</h2><CopyButton value={finalUrl.startsWith("http") ? finalUrl : ""} /></div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-ink">{finalUrl}</pre>
      </div>
    </div>
  );
}
