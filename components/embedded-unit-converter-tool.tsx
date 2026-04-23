"use client";

import { useMemo, useState } from "react";

export function EmbeddedUnitConverterTool() {
  const [frequencyHz, setFrequencyHz] = useState("16000000");
  const [timeNs, setTimeNs] = useState("1000");
  const result = useMemo(() => {
    const hz = Number(frequencyHz);
    const ns = Number(timeNs);
    if ([hz, ns].some(Number.isNaN) || hz <= 0 || ns <= 0) return null;
    return {
      khz: hz / 1_000,
      mhz: hz / 1_000_000,
      periodNs: 1_000_000_000 / hz,
      timeUs: ns / 1_000,
      timeMs: ns / 1_000_000,
    };
  }, [frequencyHz, timeNs]);
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-4 rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><label className="block space-y-2 text-sm font-semibold text-ink/80">Frequency (Hz)<input value={frequencyHz} onChange={(event) => setFrequencyHz(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>{result && <div className="space-y-2 font-mono text-sm text-ink"><p>{result.khz.toFixed(2)} kHz</p><p>{result.mhz.toFixed(6)} MHz</p><p>{result.periodNs.toFixed(2)} ns period</p></div>}</div>
      <div className="space-y-4 rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><label className="block space-y-2 text-sm font-semibold text-ink/80">Time (ns)<input value={timeNs} onChange={(event) => setTimeNs(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>{result && <div className="space-y-2 font-mono text-sm text-ink"><p>{result.timeUs.toFixed(3)} us</p><p>{result.timeMs.toFixed(6)} ms</p></div>}</div>
    </div>
  );
}
