"use client";

import { useMemo, useState } from "react";
import { formatHex, parseNumericInput } from "@/lib/embedded-advanced";

const widths = [8, 16, 32] as const;

type FieldDraft = {
  id: string;
  name: string;
  offset: string;
  width: string;
  value: string;
};

type ResolvedField = {
  id: string;
  name: string;
  offset: number;
  width: number;
  value: number;
  truncatedValue: number;
  mask: number;
  shiftedValue: number;
  extracted: number;
  overlap: boolean;
};

const initialFields: FieldDraft[] = [
  { id: "mode", name: "MODE", offset: "8", width: "3", value: "0x5" },
  { id: "enable", name: "ENABLE", offset: "2", width: "1", value: "1" },
];

export function RegisterFieldBuilderTool() {
  const [registerWidth, setRegisterWidth] = useState<(typeof widths)[number]>(32);
  const [registerValue, setRegisterValue] = useState("0x40021000");
  const [fields, setFields] = useState<FieldDraft[]>(initialFields);

  const result = useMemo(() => {
    const baseRegister = parseNumericInput(registerValue);
    if (baseRegister === null) {
      return { error: "Use decimal, 0x hex, or 0b binary for the base register value." };
    }

    const registerMask = registerWidth === 32 ? 0xffffffff : (1 << registerWidth) - 1;
    const resolvedFields: ResolvedField[] = [];
    const fieldErrors: string[] = [];
    let mergedMask = 0;
    let mergedShiftedValue = 0;

    for (const field of fields) {
      const offset = parseNumericInput(field.offset);
      const width = parseNumericInput(field.width);
      const value = parseNumericInput(field.value);
      const name = field.name.trim() || `Field ${resolvedFields.length + 1}`;

      if (offset === null || width === null || value === null) {
        fieldErrors.push(`${name}: use decimal, 0x hex, or 0b binary values.`);
        continue;
      }

      if (width < 1 || width > registerWidth) {
        fieldErrors.push(`${name}: width must stay between 1 and ${registerWidth} bits.`);
        continue;
      }

      if (offset + width > registerWidth) {
        fieldErrors.push(`${name}: offset + width must fit inside the register.`);
        continue;
      }

      const rawMask = width === 32 ? 0xffffffff : ((1 << width) - 1) << offset;
      const mask = rawMask & registerMask;
      const truncatedValue = value & (width === 32 ? 0xffffffff : (1 << width) - 1);
      const shiftedValue = (truncatedValue << offset) & registerMask;
      const extracted = (baseRegister & mask) >>> offset;
      const overlap = (mergedMask & mask) !== 0;

      mergedMask |= mask;
      mergedShiftedValue |= shiftedValue;
      resolvedFields.push({
        id: field.id,
        name,
        offset,
        width,
        value,
        truncatedValue,
        mask,
        shiftedValue,
        extracted,
        overlap,
      });
    }

    if (fieldErrors.length > 0) {
      return { error: fieldErrors.join(" ") };
    }

    const overlapCount = resolvedFields.filter((field) => field.overlap).length;
    const updatedRegister = ((baseRegister & ~mergedMask) | mergedShiftedValue) & registerMask;

    return {
      baseRegister,
      mergedMask,
      mergedShiftedValue,
      updatedRegister,
      overlapCount,
      resolvedFields,
    };
  }, [fields, registerValue, registerWidth]);

  function updateField(id: string, key: keyof Omit<FieldDraft, "id">, nextValue: string) {
    setFields((current) => current.map((field) => (field.id === id ? { ...field, [key]: nextValue } : field)));
  }

  function addField() {
    setFields((current) => [
      ...current,
      {
        id: `field-${current.length + 1}-${Date.now()}`,
        name: `FIELD_${current.length + 1}`,
        offset: "0",
        width: "1",
        value: "0",
      },
    ]);
  }

  function removeField(id: string) {
    setFields((current) => (current.length === 1 ? current : current.filter((field) => field.id !== id)));
  }

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

      <FieldInput label="Base register value" value={registerValue} onChange={setRegisterValue} />

      <div className="space-y-4 rounded-[1.6rem] border border-ink/10 bg-white/80 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Field definitions</p>
            <p className="mt-1 text-sm text-ink/70">Compose several named bitfields and inspect the final packed register value.</p>
          </div>
          <button
            type="button"
            onClick={addField}
            className="rounded-full border border-ink/10 bg-card px-4 py-2 text-sm font-semibold text-ink transition hover:-translate-y-0.5"
          >
            Add field
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.id} className="grid gap-3 rounded-[1.3rem] border border-ink/10 bg-card p-4 md:grid-cols-[1.1fr_0.8fr_0.8fr_1fr_auto]">
              <FieldInput label="Name" value={field.name} onChange={(value) => updateField(field.id, "name", value)} />
              <FieldInput label="Offset" value={field.offset} onChange={(value) => updateField(field.id, "offset", value)} />
              <FieldInput label="Width" value={field.width} onChange={(value) => updateField(field.id, "width", value)} />
              <FieldInput label="Value" value={field.value} onChange={(value) => updateField(field.id, "value", value)} />
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeField(field.id)}
                  disabled={fields.length === 1}
                  className="rounded-full border border-ink/10 bg-white/90 px-3 py-2 text-sm font-semibold text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {"error" in result ? (
        <div className="rounded-[1.4rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">{result.error}</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Metric label="Base register" value={formatHex(result.baseRegister, registerWidth / 4)} />
            <Metric label="Combined field mask" value={formatHex(result.mergedMask, registerWidth / 4)} />
            <Metric label="Combined shifted value" value={formatHex(result.mergedShiftedValue, registerWidth / 4)} />
            <Metric label="Updated register" value={formatHex(result.updatedRegister, registerWidth / 4)} />
          </div>

          {result.overlapCount > 0 ? (
            <div className="rounded-[1.4rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {result.overlapCount} field{result.overlapCount === 1 ? "" : "s"} overlap. Later fields do not automatically clear earlier conflicts, so review the masks below.
            </div>
          ) : null}

          <div className="overflow-x-auto rounded-[1.6rem] border border-ink/10 bg-white/80">
            <table className="min-w-full divide-y divide-ink/10 text-left text-sm text-ink/80">
              <thead className="bg-sage/40 text-xs uppercase tracking-[0.18em] text-lake">
                <tr>
                  <th className="px-4 py-3">Field</th>
                  <th className="px-4 py-3">Offset</th>
                  <th className="px-4 py-3">Width</th>
                  <th className="px-4 py-3">Mask</th>
                  <th className="px-4 py-3">Incoming</th>
                  <th className="px-4 py-3">Shifted</th>
                  <th className="px-4 py-3">Current</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 font-mono text-xs md:text-sm">
                {result.resolvedFields.map((field) => (
                  <tr key={field.id} className={field.overlap ? "bg-amber-50/80" : ""}>
                    <td className="px-4 py-3 font-sans font-semibold text-ink">{field.name}</td>
                    <td className="px-4 py-3">{field.offset}</td>
                    <td className="px-4 py-3">{field.width}</td>
                    <td className="px-4 py-3">{formatHex(field.mask, registerWidth / 4)}</td>
                    <td className="px-4 py-3">{field.truncatedValue}</td>
                    <td className="px-4 py-3">{formatHex(field.shiftedValue, registerWidth / 4)}</td>
                    <td className="px-4 py-3">{formatHex(field.extracted, Math.max(2, Math.ceil(registerWidth / 8)))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function FieldInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
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
