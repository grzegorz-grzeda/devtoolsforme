"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

function toBytes(input: string) {
  return new TextEncoder().encode(input);
}

function crc8(bytes: Uint8Array) {
  let crc = 0x00;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) crc = crc & 0x80 ? ((crc << 1) ^ 0x07) & 0xff : (crc << 1) & 0xff;
  }
  return crc;
}

function crc16Modbus(bytes: Uint8Array) {
  let crc = 0xffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) crc = crc & 1 ? (crc >> 1) ^ 0xa001 : crc >> 1;
  }
  return crc & 0xffff;
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function CRCCalculatorTool() {
  const [input, setInput] = useState("devtoolsforme");
  const result = useMemo(() => {
    const bytes = toBytes(input);
    return {
      crc8: `0x${crc8(bytes).toString(16).toUpperCase().padStart(2, "0")}`,
      crc16: `0x${crc16Modbus(bytes).toString(16).toUpperCase().padStart(4, "0")}`,
      crc32: `0x${crc32(bytes).toString(16).toUpperCase().padStart(8, "0")}`,
    };
  }, [input]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Input text
        <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={6} className="min-h-[150px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 text-sm outline-none transition focus:border-accent" />
      </label>
      <div className="grid gap-3">
        {Object.entries(result).map(([label, value]) => (
          <div key={label} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <div className="mb-2 flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">{label}</p><CopyButton value={value} /></div>
            <p className="font-mono text-sm text-ink">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
