"use client";

import { useMemo, useState } from "react";

type Width = 8 | 16 | 32;

export function TwosComplementTool() {
  const [width, setWidth] = useState<Width>(8);
  const [input, setInput] = useState("255");

  const result = useMemo(() => {
    const value = Number(input);
    if (Number.isNaN(value)) return null;
    const mask = 2 ** width - 1;
    const unsigned = value & mask;
    const signed = unsigned & (1 << (width - 1)) ? unsigned - 2 ** width : unsigned;
    return {
      unsigned,
      signed,
      hex: `0x${(unsigned >>> 0).toString(16).toUpperCase().padStart(width / 4, "0")}`,
      binary: (unsigned >>> 0).toString(2).padStart(width, "0"),
    };
  }, [input, width]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">{([8,16,32] as Width[]).map((value) => <button key={value} type="button" onClick={() => setWidth(value)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${width===value?"bg-accent text-white":"bg-sage text-lake hover:bg-sage/70"}`}>{value}-bit</button>)}</div>
      <label className="block space-y-2 text-sm font-semibold text-ink/80">Input value<input value={input} onChange={(event) => setInput(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-lg outline-none transition focus:border-accent" /></label>
      {!result ? <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">Enter a valid integer.</p> : <div className="grid gap-3 md:grid-cols-4"><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Unsigned</p><p className="mt-2 font-mono text-lg text-ink">{result.unsigned}</p></div><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Signed</p><p className="mt-2 font-mono text-lg text-ink">{result.signed}</p></div><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Hex</p><p className="mt-2 font-mono text-lg text-ink">{result.hex}</p></div><div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Binary</p><p className="mt-2 break-all font-mono text-sm text-ink">{result.binary}</p></div></div>}
    </div>
  );
}
