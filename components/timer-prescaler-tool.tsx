"use client";

import { useMemo, useState } from "react";

export function TimerPrescalerTool() {
  const [clockHz, setClockHz] = useState("16000000");
  const [prescaler, setPrescaler] = useState("64");
  const [timerCounts, setTimerCounts] = useState("250");

  const result = useMemo(() => {
    const clock = Number(clockHz);
    const div = Number(prescaler);
    const counts = Number(timerCounts);
    if ([clock, div, counts].some(Number.isNaN) || div <= 0 || counts <= 0) return null;
    const tick = div / clock;
    const interval = tick * counts;
    return { tick, interval, frequency: 1 / interval };
  }, [clockHz, prescaler, timerCounts]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Clock Hz<input value={clockHz} onChange={(event) => setClockHz(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Prescaler<input value={prescaler} onChange={(event) => setPrescaler(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Timer counts<input value={timerCounts} onChange={(event) => setTimerCounts(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
      </div>
      {!result ? <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">Enter valid numeric values.</p> : <div className="grid gap-3 md:grid-cols-3"><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Timer tick</p><p className="mt-2 font-mono text-lg text-ink">{result.tick.toExponential(6)} s</p></div><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Interval</p><p className="mt-2 font-mono text-lg text-ink">{result.interval.toExponential(6)} s</p></div><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Frequency</p><p className="mt-2 font-mono text-lg text-ink">{result.frequency.toFixed(2)} Hz</p></div></div>}
    </div>
  );
}
