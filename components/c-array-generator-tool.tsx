"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

export function CArrayGeneratorTool() {
  const [text, setText] = useState("devtoolsforme");
  const [name, setName] = useState("payload");
  const output = useMemo(() => {
    const bytes = Array.from(new TextEncoder().encode(text));
    return `const uint8_t ${name}[] = {\n  ${bytes.map((byte) => `0x${byte.toString(16).toUpperCase().padStart(2, "0")}`).join(", ")}\n};`;
  }, [name, text]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">Array name<input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent" /></label>
      <label className="block space-y-2 text-sm font-semibold text-ink/80">Input text<textarea value={text} onChange={(event) => setText(event.target.value)} rows={5} className="min-h-[120px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 text-sm outline-none transition focus:border-accent" /></label>
      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
        <div className="mb-2 flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Generated array</p><CopyButton value={output} /></div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm text-ink">{output}</pre>
      </div>
    </div>
  );
}
