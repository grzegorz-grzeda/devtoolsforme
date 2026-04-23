"use client";

import { useMemo, useState } from "react";

export function UARTBaudCalculatorTool() {
  const [clockHz, setClockHz] = useState("16000000");
  const [baudRate, setBaudRate] = useState("115200");

  const result = useMemo(() => {
    const clock = Number(clockHz);
    const baud = Number(baudRate);
    if ([clock, baud].some(Number.isNaN) || baud <= 0) return null;
    const ubrr = Math.round(clock / (16 * baud) - 1);
    const actual = clock / (16 * (ubrr + 1));
    const errorPercent = ((actual - baud) / baud) * 100;
    return { ubrr, actual, errorPercent };
  }, [baudRate, clockHz]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Clock Hz<input value={clockHz} onChange={(event) => setClockHz(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Target baud<input value={baudRate} onChange={(event) => setBaudRate(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
      </div>
      {!result ? <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">Enter valid numeric values.</p> : <div className="grid gap-3 md:grid-cols-3"><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">UBRR / divisor</p><p className="mt-2 font-mono text-lg text-ink">{result.ubrr}</p></div><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Actual baud</p><p className="mt-2 font-mono text-lg text-ink">{result.actual.toFixed(2)}</p></div><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Error</p><p className="mt-2 font-mono text-lg text-ink">{result.errorPercent.toFixed(3)}%</p></div></div>}
    </div>
  );
}
