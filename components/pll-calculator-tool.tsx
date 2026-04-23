"use client";

import { useMemo, useState } from "react";

function formatFrequency(hz: number) {
  if (hz >= 1_000_000) return `${(hz / 1_000_000).toFixed(3)} MHz`;
  if (hz >= 1_000) return `${(hz / 1_000).toFixed(3)} kHz`;
  return `${hz.toFixed(3)} Hz`;
}

export function PllCalculatorTool() {
  const [sourceHz, setSourceHz] = useState("8000000");
  const [preDivider, setPreDivider] = useState("1");
  const [multiplier, setMultiplier] = useState("9");
  const [postDivider, setPostDivider] = useState("1");

  const result = useMemo(() => {
    const source = Number(sourceHz);
    const pre = Number(preDivider);
    const mult = Number(multiplier);
    const post = Number(postDivider);

    if ([source, pre, mult, post].some((value) => !Number.isFinite(value) || value <= 0)) {
      return { error: "Enter positive numeric values for source, pre-divider, multiplier, and post-divider." };
    }

    const vcoInput = source / pre;
    const vcoOutput = vcoInput * mult;
    const finalOutput = vcoOutput / post;
    const periodNs = 1_000_000_000 / finalOutput;

    return { vcoInput, vcoOutput, finalOutput, periodNs };
  }, [multiplier, postDivider, preDivider, sourceHz]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Source clock (Hz)" value={sourceHz} onChange={setSourceHz} />
        <Field label="Pre-divider" value={preDivider} onChange={setPreDivider} />
        <Field label="Multiplier" value={multiplier} onChange={setMultiplier} />
        <Field label="Post-divider" value={postDivider} onChange={setPostDivider} />
      </div>

      {"error" in result ? (
        <div className="rounded-[1.4rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">{result.error}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="VCO input" value={formatFrequency(result.vcoInput)} />
          <Metric label="VCO output" value={formatFrequency(result.vcoOutput)} />
          <Metric label="PLL output" value={formatFrequency(result.finalOutput)} />
          <Metric label="Output period" value={`${result.periodNs.toFixed(3)} ns`} />
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
