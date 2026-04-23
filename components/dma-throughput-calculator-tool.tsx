"use client";

import { useMemo, useState } from "react";

export function DmaThroughputCalculatorTool() {
  const [busClockHz, setBusClockHz] = useState("120000000");
  const [busWidthBits, setBusWidthBits] = useState("32");
  const [beatsPerBurst, setBeatsPerBurst] = useState("4");
  const [overheadCycles, setOverheadCycles] = useState("2");
  const [transferBytes, setTransferBytes] = useState("4096");

  const result = useMemo(() => {
    const clock = Number(busClockHz);
    const widthBits = Number(busWidthBits);
    const burst = Number(beatsPerBurst);
    const overhead = Number(overheadCycles);
    const bytes = Number(transferBytes);

    if ([clock, widthBits, burst, overhead, bytes].some((value) => !Number.isFinite(value) || value <= 0)) {
      return { error: "Enter positive numeric values for each DMA parameter." };
    }

    const bytesPerBeat = widthBits / 8;
    const bursts = Math.ceil(bytes / (bytesPerBeat * burst));
    const cyclesPerBurst = burst + overhead;
    const totalCycles = bursts * cyclesPerBurst;
    const seconds = totalCycles / clock;
    const throughput = bytes / seconds;

    return {
      bytesPerBeat,
      bursts,
      totalCycles,
      seconds,
      throughput,
    };
  }, [beatsPerBurst, busClockHz, busWidthBits, overheadCycles, transferBytes]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Bus clock (Hz)" value={busClockHz} onChange={setBusClockHz} />
        <Field label="Bus width (bits)" value={busWidthBits} onChange={setBusWidthBits} />
        <Field label="Beats per burst" value={beatsPerBurst} onChange={setBeatsPerBurst} />
        <Field label="Overhead cycles per burst" value={overheadCycles} onChange={setOverheadCycles} />
        <Field label="Transfer size (bytes)" value={transferBytes} onChange={setTransferBytes} />
      </div>

      {"error" in result ? (
        <div className="rounded-[1.4rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">{result.error}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Metric label="Bytes per beat" value={result.bytesPerBeat.toFixed(2)} />
          <Metric label="Bursts required" value={String(result.bursts)} />
          <Metric label="Total cycles" value={String(result.totalCycles)} />
          <Metric label="Transfer time" value={`${(result.seconds * 1_000_000).toFixed(3)} us`} />
          <Metric label="Throughput" value={`${(result.throughput / 1_000_000).toFixed(3)} MB/s`} />
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-ink/80">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent"
      />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-ink/10 bg-white/75 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">{label}</p>
      <p className="mt-2 font-mono text-lg text-ink">{value}</p>
    </div>
  );
}
