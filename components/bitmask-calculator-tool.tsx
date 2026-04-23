"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

type Width = 8 | 16 | 32;
type Base = "hex" | "dec" | "bin";

const maxValueByWidth: Record<Width, number> = {
  8: 0xff,
  16: 0xffff,
  32: 0xffffffff,
};

function parseValue(value: string, base: Base): number | null {
  const trimmed = value.trim();
  if (!trimmed) return 0;

  const normalized =
    base === "hex"
      ? trimmed.replace(/^0x/i, "")
      : base === "bin"
        ? trimmed.replace(/^0b/i, "")
        : trimmed;

  const parsed = Number.parseInt(normalized, base === "hex" ? 16 : base === "bin" ? 2 : 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function formatBinary(value: number, width: Width) {
  const binary = (value >>> 0).toString(2).padStart(width, "0");
  return binary.replace(/(.{4})/g, "$1 ").trim();
}

function clampToWidth(value: number, width: Width) {
  return value & maxValueByWidth[width];
}

function formatValue(value: number, width: Width) {
  const normalized = clampToWidth(value, width) >>> 0;
  return {
    dec: String(normalized),
    hex: `0x${normalized.toString(16).toUpperCase().padStart(width / 4, "0")}`,
    bin: formatBinary(normalized, width),
  };
}

function listBits(mask: number, width: Width) {
  const bits: number[] = [];
  for (let bit = 0; bit < width; bit += 1) {
    if ((mask >>> bit) & 1) {
      bits.push(bit);
    }
  }
  return bits.reverse();
}

export function BitmaskCalculatorTool() {
  const [width, setWidth] = useState<Width>(8);
  const [registerBase, setRegisterBase] = useState<Base>("hex");
  const [maskBase, setMaskBase] = useState<Base>("hex");
  const [registerInput, setRegisterInput] = useState("0x5A");
  const [maskInput, setMaskInput] = useState("0x0F");

  const computed = useMemo(() => {
    const register = parseValue(registerInput, registerBase);
    const mask = parseValue(maskInput, maskBase);

    if (register === null || mask === null) {
      return null;
    }

    const registerValue = clampToWidth(register, width);
    const maskValue = clampToWidth(mask, width);

    const setValue = clampToWidth(registerValue | maskValue, width);
    const clearValue = clampToWidth(registerValue & ~maskValue, width);
    const toggleValue = clampToWidth(registerValue ^ maskValue, width);
    const overlapValue = clampToWidth(registerValue & maskValue, width);

    return {
      registerValue,
      maskValue,
      setValue,
      clearValue,
      toggleValue,
      overlapValue,
      selectedBits: listBits(maskValue, width),
    };
  }, [maskBase, maskInput, registerBase, registerInput, width]);

  const baseButtons: Base[] = ["hex", "dec", "bin"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {[8, 16, 32].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setWidth(value as Width)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              width === value ? "bg-accent text-white" : "bg-sage text-lake hover:bg-sage/70"
            }`}
          >
            {value}-bit
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Register value</p>
            <div className="flex flex-wrap gap-2">
              {baseButtons.map((base) => (
                <button
                  key={base}
                  type="button"
                  onClick={() => setRegisterBase(base)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                    registerBase === base ? "bg-accent text-white" : "bg-sage text-lake hover:bg-sage/70"
                  }`}
                >
                  {base}
                </button>
              ))}
            </div>
          </div>
          <input
            value={registerInput}
            onChange={(event) => setRegisterInput(event.target.value)}
            className="mt-4 w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-xl outline-none transition focus:border-accent"
          />
        </div>

        <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Bitmask</p>
            <div className="flex flex-wrap gap-2">
              {baseButtons.map((base) => (
                <button
                  key={base}
                  type="button"
                  onClick={() => setMaskBase(base)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                    maskBase === base ? "bg-accent text-white" : "bg-sage text-lake hover:bg-sage/70"
                  }`}
                >
                  {base}
                </button>
              ))}
            </div>
          </div>
          <input
            value={maskInput}
            onChange={(event) => setMaskInput(event.target.value)}
            className="mt-4 w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-xl outline-none transition focus:border-accent"
          />
        </div>
      </div>

      {!computed ? (
        <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">Enter valid register and mask values for the selected numeric bases.</p>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.4rem] border border-ink/10 bg-ink p-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Register</p>
              <div className="mt-3 space-y-2 text-sm">
                <p className="font-mono">{formatValue(computed.registerValue, width).hex}</p>
                <p className="font-mono">{formatValue(computed.registerValue, width).dec}</p>
                <p className="font-mono text-white/75">{formatValue(computed.registerValue, width).bin}</p>
              </div>
            </div>
            <div className="rounded-[1.4rem] border border-ink/10 bg-ink p-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Mask</p>
              <div className="mt-3 space-y-2 text-sm">
                <p className="font-mono">{formatValue(computed.maskValue, width).hex}</p>
                <p className="font-mono">{formatValue(computed.maskValue, width).dec}</p>
                <p className="font-mono text-white/75">{formatValue(computed.maskValue, width).bin}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Bits selected by mask</p>
            <p className="mt-3 font-mono text-sm text-ink">
              {computed.selectedBits.length > 0 ? computed.selectedBits.map((bit) => `BIT${bit}`).join(", ") : "No bits selected"}
            </p>
          </div>

          <div className="grid gap-3">
            {[
              { label: "Set bits", detail: "register | mask", value: computed.setValue },
              { label: "Clear bits", detail: "register & ~mask", value: computed.clearValue },
              { label: "Toggle bits", detail: "register ^ mask", value: computed.toggleValue },
              { label: "Masked bits only", detail: "register & mask", value: computed.overlapValue },
            ].map((entry) => {
              const formatted = formatValue(entry.value, width);
              return (
                <div key={entry.label} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">{entry.label}</p>
                      <p className="text-xs text-ink/55">{entry.detail}</p>
                    </div>
                    <CopyButton value={formatted.hex} label="Copy hex" />
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-ink">
                    <p className="font-mono">{formatted.hex}</p>
                    <p className="font-mono">{formatted.dec}</p>
                    <p className="font-mono text-ink/70">{formatted.bin}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
