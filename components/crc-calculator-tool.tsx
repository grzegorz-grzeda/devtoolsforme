"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

function toBytes(input: string) {
  return new TextEncoder().encode(input);
}

function reflect(value: number, bits: number): number {
  let reflected = 0;
  for (let i = 0; i < bits; i++) {
    if (value & (1 << i)) reflected |= 1 << (bits - 1 - i);
  }
  return reflected >>> 0;
}

function computeCrc(bytes: Uint8Array, width: number, poly: number, init: number, refIn: boolean, refOut: boolean, xorOut: number): number {
  const mask = width === 32 ? 0xffffffff : (1 << width) - 1;
  const topBit = 1 << (width - 1);
  let crc = init & mask;
  for (const byte of bytes) {
    const b = refIn ? reflect(byte, 8) : byte;
    crc ^= (b << (width - 8)) & mask;
    for (let i = 0; i < 8; i++) {
      crc = crc & topBit ? (((crc << 1) & mask) ^ poly) : (crc << 1) & mask;
    }
  }
  if (refOut) crc = reflect(crc, width);
  return ((crc ^ xorOut) >>> 0) & mask;
}

type CrcConfig = {
  label: string;
  width: 8 | 16 | 32;
  poly: number;
  init: number;
  refIn: boolean;
  refOut: boolean;
  xorOut: number;
};

const CRC_TYPES: CrcConfig[] = [
  { label: "CRC-8",             width: 8,  poly: 0x07,       init: 0x00,       refIn: false, refOut: false, xorOut: 0x00       },
  { label: "CRC-8/MAXIM",       width: 8,  poly: 0x31,       init: 0x00,       refIn: true,  refOut: true,  xorOut: 0x00       },
  { label: "CRC-16/MODBUS",     width: 16, poly: 0x8005,     init: 0xffff,     refIn: true,  refOut: true,  xorOut: 0x0000     },
  { label: "CRC-16/CCITT-FALSE",width: 16, poly: 0x1021,     init: 0xffff,     refIn: false, refOut: false, xorOut: 0x0000     },
  { label: "CRC-16/KERMIT",     width: 16, poly: 0x1021,     init: 0x0000,     refIn: true,  refOut: true,  xorOut: 0x0000     },
  { label: "CRC-16/USB",        width: 16, poly: 0x8005,     init: 0xffff,     refIn: true,  refOut: true,  xorOut: 0xffff     },
  { label: "CRC-32",            width: 32, poly: 0x04c11db7, init: 0xffffffff, refIn: true,  refOut: true,  xorOut: 0xffffffff },
  { label: "CRC-32/MPEG-2",     width: 32, poly: 0x04c11db7, init: 0xffffffff, refIn: false, refOut: false, xorOut: 0x00000000 },
];

function formatCrc(value: number, width: number): string {
  const hexDigits = width / 4;
  return `0x${(value >>> 0).toString(16).toUpperCase().padStart(hexDigits, "0")}`;
}

function parseHex(value: string): number {
  const trimmed = value.trim().replace(/^0x/i, "");
  const parsed = parseInt(trimmed, 16);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function CRCCalculatorTool() {
  const [input, setInput] = useState("devtoolsforme");
  const [customWidth, setCustomWidth] = useState<8 | 16 | 32>(16);
  const [customPoly, setCustomPoly] = useState("0x1021");
  const [customInit, setCustomInit] = useState("0xFFFF");
  const [customXorOut, setCustomXorOut] = useState("0x0000");
  const [customRefIn, setCustomRefIn] = useState(false);
  const [customRefOut, setCustomRefOut] = useState(false);

  const predefined = useMemo(() => {
    const bytes = toBytes(input);
    return CRC_TYPES.map((cfg) => ({
      label: cfg.label,
      value: formatCrc(computeCrc(bytes, cfg.width, cfg.poly, cfg.init, cfg.refIn, cfg.refOut, cfg.xorOut), cfg.width),
    }));
  }, [input]);

  const customResult = useMemo(() => {
    const bytes = toBytes(input);
    const poly = parseHex(customPoly);
    const init = parseHex(customInit);
    const xorOut = parseHex(customXorOut);
    return formatCrc(computeCrc(bytes, customWidth, poly, init, customRefIn, customRefOut, xorOut), customWidth);
  }, [input, customWidth, customPoly, customInit, customXorOut, customRefIn, customRefOut]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Input text
        <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={6} className="min-h-[150px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 text-sm outline-none transition focus:border-accent" />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        {predefined.map(({ label, value }) => (
          <div key={label} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">{label}</p>
              <CopyButton value={value} />
            </div>
            <p className="font-mono text-sm text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Custom CRC</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block space-y-1 text-sm font-semibold text-ink/80">
            Width
            <select
              value={customWidth}
              onChange={(e) => setCustomWidth(Number(e.target.value) as 8 | 16 | 32)}
              className="mt-1 w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-accent"
            >
              <option value={8}>8-bit</option>
              <option value={16}>16-bit</option>
              <option value={32}>32-bit</option>
            </select>
          </label>
          <label className="block space-y-1 text-sm font-semibold text-ink/80">
            Polynomial (hex)
            <input
              value={customPoly}
              onChange={(e) => setCustomPoly(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2 font-mono text-sm outline-none transition focus:border-accent"
            />
          </label>
          <label className="block space-y-1 text-sm font-semibold text-ink/80">
            Initial value (hex)
            <input
              value={customInit}
              onChange={(e) => setCustomInit(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2 font-mono text-sm outline-none transition focus:border-accent"
            />
          </label>
          <label className="block space-y-1 text-sm font-semibold text-ink/80">
            XOR-Out (hex)
            <input
              value={customXorOut}
              onChange={(e) => setCustomXorOut(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2 font-mono text-sm outline-none transition focus:border-accent"
            />
          </label>
          <div className="flex items-center gap-5 pt-4 sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink/80">
              <input type="checkbox" checked={customRefIn} onChange={(e) => setCustomRefIn(e.target.checked)} className="rounded" />
              Reflect In
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink/80">
              <input type="checkbox" checked={customRefOut} onChange={(e) => setCustomRefOut(e.target.checked)} className="rounded" />
              Reflect Out
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white/80 px-4 py-3">
          <p className="font-mono text-sm text-ink">{customResult}</p>
          <CopyButton value={customResult} />
        </div>
      </div>
    </div>
  );
}
