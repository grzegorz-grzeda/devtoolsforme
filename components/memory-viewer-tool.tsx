"use client";

import { useMemo, useState } from "react";

function cleanHex(input: string) {
  return input.replace(/0x/gi, "").replace(/[^0-9a-f]/gi, "").toUpperCase();
}

function printable(byte: number) {
  return byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ".";
}

export function MemoryViewerTool() {
  const [input, setInput] = useState("48656C6C6F20555446210011223344");
  const rows = useMemo(() => {
    const clean = cleanHex(input);
    const bytes = (clean.length % 2 === 0 ? clean : `0${clean}`).match(/.{1,2}/g) ?? [];
    const values = bytes.map((byte) => Number.parseInt(byte, 16));
    const chunks = [] as { offset: string; hex: string; ascii: string }[];
    for (let i = 0; i < values.length; i += 16) {
      const slice = values.slice(i, i + 16);
      chunks.push({
        offset: `0x${i.toString(16).toUpperCase().padStart(4, "0")}`,
        hex: slice.map((value) => value.toString(16).toUpperCase().padStart(2, "0")).join(" "),
        ascii: slice.map(printable).join(""),
      });
    }
    return chunks;
  }, [input]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Hex bytes
        <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={6} className="min-h-[140px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 font-mono text-sm outline-none transition focus:border-accent" />
      </label>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.offset} className="grid gap-3 rounded-[1.4rem] border border-ink/10 bg-white/70 p-4 md:grid-cols-[110px_minmax(0,1fr)_180px]">
            <p className="font-mono text-sm text-lake">{row.offset}</p>
            <p className="font-mono text-sm text-ink">{row.hex}</p>
            <p className="font-mono text-sm text-ink/70">{row.ascii}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
