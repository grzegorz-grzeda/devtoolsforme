"use client";

import { useMemo, useState } from "react";
import { formatHex, parseNumericInput } from "@/lib/embedded-advanced";

const widths = [8, 16, 32] as const;

export function RegisterFieldBuilderTool() {
  const [registerWidth, setRegisterWidth] = useState<(typeof widths)[number]>(32);
  const [registerValue, setRegisterValue] = useState("0x40021000");
  const [offset, setOffset] = useState("8");
  const [fieldWidth, setFieldWidth] = useState("3");
  const [fieldValue, setFieldValue] = useState("0x5");

  const result = useMemo(() => {
    const reg = parseNumericInput(registerValue);
    const shift = parseNumericInput(offset);
    const width = parseNumericInput(fieldWidth);
    const value = parseNumericInput(fieldValue);

    if ([reg, shift, width, value].some((entry) => entry === null)) {
      return { error: "Use decimal, 0x hex, or 0b binary values for every field." };
    }

    if ((width ?? 0) < 1 || (width ?? 0) > registerWidth) {
      return { error: `Field width must stay between 1 and ${registerWidth} bits.` };
    }

    if ((shift ?? 0) < 0 || (shift ?? 0) + (width ?? 0) > registerWidth) {
      return { error: "Field offset + width must fit inside the register." };
    }

    const register = reg as number;
    const fieldShift = shift as number;
    const fieldBitWidth = width as number;
    const nextValue = value as number;
    const registerMask = registerWidth === 32 ? 0xffffffff : (1 << registerWidth) - 1;
    const rawMask = fieldBitWidth === 32 ? 0xffffffff : ((1 << fieldBitWidth) - 1) << fieldShift;
    const safeMask = rawMask & registerMask;
    const truncatedValue = nextValue & (fieldBitWidth === 32 ? 0xffffffff : (1 << fieldBitWidth) - 1);
    const shiftedValue = (truncatedValue << fieldShift) & registerMask;
    const updatedRegister = ((register & ~safeMask) | shiftedValue) & registerMask;
    const extracted = (register & safeMask) >>> fieldShift;

    return {
      mask: safeMask,
      shiftedValue,
      updatedRegister,
      extracted,
      truncatedValue,
    };
  }, [fieldValue, fieldWidth, offset, registerValue, registerWidth]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {widths.map((width) => (
          <button
            key={width}
            type="button"
            onClick={() => setRegisterWidth(width)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${registerWidth === width ? "bg-ink text-white" : "border border-ink/10 bg-white/80 text-ink hover:-translate-y-0.5"}`}
          >
            {width}-bit register
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Register value" value={registerValue} onChange={setRegisterValue} />
        <Field label="Field value" value={fieldValue} onChange={setFieldValue} />
        <Field label="Field offset" value={offset} onChange={setOffset} />
        <Field label="Field width" value={fieldWidth} onChange={setFieldWidth} />
      </div>

      {"error" in result ? (
        <div className="rounded-[1.4rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">{result.error}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Field mask" value={formatHex(result.mask, registerWidth / 4)} />
          <Metric label="Shifted field" value={formatHex(result.shiftedValue, registerWidth / 4)} />
          <Metric label="Updated register" value={formatHex(result.updatedRegister, registerWidth / 4)} />
          <Metric label="Extracted current field" value={formatHex(result.extracted, Math.max(2, Math.ceil(registerWidth / 8)))} />
          <Metric label="Truncated field value" value={String(result.truncatedValue)} />
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
      <p className="mt-2 break-all font-mono text-base text-ink">{value}</p>
    </div>
  );
}
