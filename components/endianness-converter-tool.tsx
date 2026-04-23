"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

function cleanHex(input: string) {
  return input.replace(/0x/gi, "").replace(/[^0-9a-f]/gi, "").toUpperCase();
}

function splitBytes(hex: string) {
  const normalized = hex.length % 2 === 0 ? hex : `0${hex}`;
  return normalized.match(/.{1,2}/g) ?? [];
}

export function EndiannessConverterTool() {
  const [input, setInput] = useState("1234ABCD");
  const values = useMemo(() => {
    const clean = cleanHex(input);
    if (!clean) return null;
    const bytes = splitBytes(clean);
    return {
      bigEndian: bytes.join(" "),
      littleEndian: [...bytes].reverse().join(" "),
      asWord: `0x${clean}`,
      byteCount: bytes.length,
    };
  }, [input]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Hex word or byte stream
        <input value={input} onChange={(event) => setInput(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-lg outline-none transition focus:border-accent" />
      </label>
      {!values ? (
        <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">Enter at least one hex byte.</p>
      ) : (
        <div className="grid gap-3">
          {[{ label: "Big-endian byte order", value: values.bigEndian }, { label: "Little-endian byte order", value: values.littleEndian }, { label: "Normalized word", value: values.asWord }].map((entry) => (
            <div key={entry.label} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
              <div className="mb-2 flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">{entry.label}</p><CopyButton value={entry.value} /></div>
              <p className="font-mono text-sm text-ink">{entry.value}</p>
            </div>
          ))}
          <p className="text-sm text-ink/65">Byte count: <span className="font-mono">{values.byteCount}</span></p>
        </div>
      )}
    </div>
  );
}
