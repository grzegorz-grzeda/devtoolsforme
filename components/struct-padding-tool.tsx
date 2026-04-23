"use client";

import { useMemo, useState } from "react";

type Field = { id: string; name: string; size: number; align: number };

const typeOptions = {
  uint8_t: { size: 1, align: 1 },
  uint16_t: { size: 2, align: 2 },
  uint32_t: { size: 4, align: 4 },
  uint64_t: { size: 8, align: 8 },
};

export function StructPaddingTool() {
  const [fields, setFields] = useState<Field[]>([
    { id: "a", name: "flag", ...typeOptions.uint8_t },
    { id: "b", name: "count", ...typeOptions.uint32_t },
    { id: "c", name: "mode", ...typeOptions.uint16_t },
  ]);

  const layout = useMemo(() => {
    let offset = 0;
    const rows = fields.map((field) => {
      const padding = (field.align - (offset % field.align)) % field.align;
      offset += padding;
      const start = offset;
      offset += field.size;
      return { ...field, padding, start, end: offset };
    });
    const structAlign = Math.max(...fields.map((field) => field.align));
    const tailPadding = (structAlign - (offset % structAlign)) % structAlign;
    return { rows, totalSize: offset + tailPadding, tailPadding };
  }, [fields]);

  function updateType(id: string, value: keyof typeof typeOptions) {
    setFields((current) => current.map((field) => field.id === id ? { ...field, ...typeOptions[value] } : field));
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.id} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px]">
            <input value={field.name} onChange={(event) => setFields((current) => current.map((entry) => entry.id === field.id ? { ...entry, name: event.target.value } : entry))} className="rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent" />
            <select onChange={(event) => updateType(field.id, event.target.value as keyof typeof typeOptions)} className="rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent">
              {Object.keys(typeOptions).map((type) => <option key={type}>{type}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {layout.rows.map((row) => (
          <div key={row.id} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <div className="flex items-center justify-between gap-3"><p className="font-mono text-sm text-lake">{row.name}</p><p className="text-xs uppercase tracking-[0.2em] text-ink/55">offset {row.start}</p></div>
            <p className="mt-2 text-sm text-ink/70">size {row.size} bytes, align {row.align}, leading padding {row.padding}</p>
          </div>
        ))}
        <div className="rounded-[1.4rem] border border-ink/10 bg-canvas p-4 text-sm text-ink/75">Tail padding: <span className="font-mono">{layout.tailPadding}</span> bytes. Total struct size: <span className="font-mono">{layout.totalSize}</span> bytes.</div>
      </div>
    </div>
  );
}
