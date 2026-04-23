"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

export function ASCIIHexByteTool() {
  const [text, setText] = useState("Hello MCU");
  const output = useMemo(() => {
    const bytes = Array.from(new TextEncoder().encode(text));
    return {
      ascii: text,
      hex: bytes.map((byte) => byte.toString(16).toUpperCase().padStart(2, "0")).join(" "),
      decimal: bytes.join(", "),
      cArray: `{ ${bytes.map((byte) => `0x${byte.toString(16).toUpperCase().padStart(2, "0")}`).join(", ")} }`,
    };
  }, [text]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        ASCII text
        <textarea value={text} onChange={(event) => setText(event.target.value)} rows={5} className="min-h-[120px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 text-sm outline-none transition focus:border-accent" />
      </label>
      <div className="grid gap-3">
        {Object.entries(output).map(([label, value]) => (
          <div key={label} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <div className="mb-2 flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">{label}</p><CopyButton value={value} /></div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm text-ink">{value}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
