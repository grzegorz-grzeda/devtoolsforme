"use client";

import { useMemo, useState } from "react";

export function CPreprocessorEvalTool() {
  const [expression, setExpression] = useState("(1 << 5) | (1 << 2)");
  const result = useMemo(() => {
    if (!/^[0-9xXa-fA-F()<>|&~+\-*/%\s]+$/.test(expression)) return "Unsupported characters";
    try {
      const value = Function(`"use strict"; return (${expression});`)();
      return Number.isFinite(value) ? String(value >>> 0) : "Invalid expression";
    } catch {
      return "Invalid expression";
    }
  }, [expression]);
  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">Expression<input value={expression} onChange={(event) => setExpression(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Result</p><p className="mt-2 font-mono text-lg text-ink">{result}</p></div>
    </div>
  );
}
