"use client";

import { useMemo, useState } from "react";

function floatToHex(value: number) {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, value, false);
  return `0x${view.getUint32(0, false).toString(16).toUpperCase().padStart(8, "0")}`;
}

export function FloatInspectorTool() {
  const [input, setInput] = useState("3.14159");
  const result = useMemo(() => {
    const numeric = Number(input);
    if (Number.isNaN(numeric)) return null;
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, numeric, false);
    const bits = view.getUint32(0, false).toString(2).padStart(32, "0");
    return {
      hex: floatToHex(numeric),
      sign: bits[0],
      exponent: bits.slice(1, 9),
      mantissa: bits.slice(9),
    };
  }, [input]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">Float value<input value={input} onChange={(event) => setInput(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-lg outline-none transition focus:border-accent" /></label>
      {!result ? <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">Enter a valid floating-point number.</p> : <div className="grid gap-3"><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Hex</p><p className="mt-2 font-mono text-lg text-ink">{result.hex}</p></div><div className="grid gap-3 md:grid-cols-3"><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Sign</p><p className="mt-2 font-mono text-lg text-ink">{result.sign}</p></div><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Exponent</p><p className="mt-2 font-mono text-lg text-ink">{result.exponent}</p></div><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Mantissa</p><p className="mt-2 break-all font-mono text-sm text-ink">{result.mantissa}</p></div></div></div>}
    </div>
  );
}
