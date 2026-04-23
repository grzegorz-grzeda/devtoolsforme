"use client";

import { useMemo, useState } from "react";

const fieldNames = ["minute", "hour", "day of month", "month", "day of week"];

function describeField(name: string, value: string) {
  if (value === "*") return `Every ${name}`;
  if (value.includes("/")) {
    const [base, step] = value.split("/");
    return `${base === "*" ? "Every" : base} ${name}, every ${step} step(s)`;
  }
  if (value.includes(",")) return `${name} values: ${value}`;
  if (value.includes("-")) return `${name} range: ${value}`;
  return `${name}: ${value}`;
}

export function CronParserTool() {
  const [expression, setExpression] = useState("*/15 9-17 * * 1-5");

  const result = useMemo(() => {
    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5) {
      return null;
    }

    return parts.map((part, index) => ({
      field: fieldNames[index],
      raw: part,
      description: describeField(fieldNames[index], part),
    }));
  }, [expression]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Cron expression
        <input value={expression} onChange={(event) => setExpression(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-lg outline-none transition focus:border-accent" />
      </label>

      {!result ? (
        <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">Use a standard 5-part cron expression: minute hour day month weekday.</p>
      ) : (
        <div className="grid gap-3">
          {result.map((item) => (
            <div key={item.field} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">{item.field}</p>
              <p className="mt-2 font-mono text-sm text-ink">{item.raw}</p>
              <p className="mt-2 text-sm leading-7 text-ink/70">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
