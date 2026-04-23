"use client";

import { useMemo, useState } from "react";

export function FixedPointConverterTool() {
  const [decimalValue, setDecimalValue] = useState("1.5");
  const [fractionBits, setFractionBits] = useState(15);

  const result = useMemo(() => {
    const numeric = Number(decimalValue);
    if (Number.isNaN(numeric)) return null;
    const scaled = Math.round(numeric * 2 ** fractionBits);
    return { scaled, backToDecimal: scaled / 2 ** fractionBits };
  }, [decimalValue, fractionBits]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Decimal<input value={decimalValue} onChange={(event) => setDecimalValue(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-lg outline-none transition focus:border-accent" /></label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Fraction bits<input type="range" min={1} max={31} value={fractionBits} onChange={(event) => setFractionBits(Number(event.target.value))} className="accent-accent" /><span className="font-mono text-lg text-lake">Q{fractionBits}</span></label>
      </div>
      {!result ? <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">Enter a valid decimal number.</p> : <div className="grid gap-3 md:grid-cols-2"><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Scaled integer</p><p className="mt-2 font-mono text-lg text-ink">{result.scaled}</p></div><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Converted back</p><p className="mt-2 font-mono text-lg text-ink">{result.backToDecimal}</p></div></div>}
    </div>
  );
}
