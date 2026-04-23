"use client";

import { useMemo, useState } from "react";

export function LogicLevelConverterTool() {
  const [referenceVoltage, setReferenceVoltage] = useState("3.3");
  const [resolution, setResolution] = useState("4095");
  const [voltage, setVoltage] = useState("1.65");

  const result = useMemo(() => {
    const ref = Number(referenceVoltage);
    const res = Number(resolution);
    const vin = Number(voltage);
    if ([ref, res, vin].some(Number.isNaN) || ref <= 0 || res <= 0) return null;
    const counts = Math.round((vin / ref) * res);
    return { counts, reconstructed: (counts / res) * ref };
  }, [referenceVoltage, resolution, voltage]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Reference voltage<input value={referenceVoltage} onChange={(event) => setReferenceVoltage(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">ADC max count<input value={resolution} onChange={(event) => setResolution(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Input voltage<input value={voltage} onChange={(event) => setVoltage(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
      </div>
      {!result ? <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">Enter valid numeric values.</p> : <div className="grid gap-3 md:grid-cols-2"><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">ADC counts</p><p className="mt-2 font-mono text-lg text-ink">{result.counts}</p></div><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Voltage from count</p><p className="mt-2 font-mono text-lg text-ink">{result.reconstructed.toFixed(4)} V</p></div></div>}
    </div>
  );
}
