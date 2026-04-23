"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

function inferType(value: unknown, depth = 0): string {
  if (depth > 4) return "unknown";
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const types = Array.from(new Set(value.map((entry) => inferType(entry, depth + 1))));
    return `(${types.join(" | ")})[]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    return `{
${entries.map(([key, nested]) => `  ${key}: ${inferType(nested, depth + 1)};`).join("\n")}
}`;
  }
  return typeof value;
}

export function JSONToTypeScriptTool() {
  const [input, setInput] = useState('{"name":"devtoolsforme","active":true,"tools":[{"slug":"uuid","favorite":false}]}');
  const [typeName, setTypeName] = useState("ToolResponse");

  const output = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      return `export type ${typeName} = ${inferType(parsed)};`;
    } catch (error) {
      return error instanceof Error ? error.message : "Invalid JSON";
    }
  }, [input, typeName]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">Type name<input value={typeName} onChange={(event) => setTypeName(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent" /></label>
      <label className="block space-y-2 text-sm font-semibold text-ink/80">JSON input<textarea value={input} onChange={(event) => setInput(event.target.value)} rows={9} className="min-h-[200px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 font-mono text-sm outline-none transition focus:border-accent" /></label>
      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
        <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Generated type</h2><CopyButton value={output.startsWith("export type") ? output : ""} /></div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-ink">{output}</pre>
      </div>
    </div>
  );
}
