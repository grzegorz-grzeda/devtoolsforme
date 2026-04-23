"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

export function CEscapeGeneratorTool() {
  const [text, setText] = useState("Hello\nEmbedded");
  const escaped = useMemo(() => {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/"/g, '\\"');
  }, [text]);
  const hexEscaped = useMemo(() => Array.from(new TextEncoder().encode(text)).map((byte) => `\\x${byte.toString(16).toUpperCase().padStart(2, "0")}`).join(""), [text]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Raw text
        <textarea value={text} onChange={(event) => setText(event.target.value)} rows={5} className="min-h-[120px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 text-sm outline-none transition focus:border-accent" />
      </label>
      {[{ label: "C string literal", value: `\"${escaped}\"` }, { label: "Hex escape sequence", value: `\"${hexEscaped}\"` }].map((entry) => (
        <div key={entry.label} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
          <div className="mb-2 flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">{entry.label}</p><CopyButton value={entry.value} /></div>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm text-ink">{entry.value}</pre>
        </div>
      ))}
    </div>
  );
}
