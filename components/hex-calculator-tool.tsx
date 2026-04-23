"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

type BaseKey = "dec" | "hex" | "bin" | "oct";

const baseConfig: Record<BaseKey, { base: number; label: string; prefix: string }> = {
  dec: { base: 10, label: "Decimal", prefix: "10" },
  hex: { base: 16, label: "Hexadecimal", prefix: "16" },
  bin: { base: 2, label: "Binary", prefix: "2" },
  oct: { base: 8, label: "Octal", prefix: "8" },
};

function parseValue(value: string, base: number) {
  if (!value.trim()) {
    return null;
  }

  const sanitized = value.trim().replace(/^0x/i, "");
  const parsed = Number.parseInt(sanitized, base);
  return Number.isNaN(parsed) ? null : parsed;
}

export function HexCalculatorTool() {
  const [activeBase, setActiveBase] = useState<BaseKey>("hex");
  const [input, setInput] = useState("FF");

  const conversions = useMemo(() => {
    const parsed = parseValue(input, baseConfig[activeBase].base);
    if (parsed === null) {
      return null;
    }

    return {
      dec: parsed.toString(10),
      hex: parsed.toString(16).toUpperCase(),
      bin: parsed.toString(2),
      oct: parsed.toString(8),
    };
  }, [activeBase, input]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {(Object.keys(baseConfig) as BaseKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveBase(key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeBase === key ? "bg-accent text-white" : "bg-sage text-lake hover:bg-sage/70"
            }`}
          >
            {baseConfig[key].label}
          </button>
        ))}
      </div>

      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Enter {baseConfig[activeBase].label.toLowerCase()} value
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 text-2xl font-mono text-ink outline-none transition focus:border-accent"
          placeholder={`Base ${baseConfig[activeBase].prefix}`}
        />
      </label>

      <div className="grid gap-3">
        {(Object.keys(baseConfig) as BaseKey[]).map((key) => (
          <div key={key} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lake">{baseConfig[key].label}</p>
                <p className="text-xs text-ink/50">Base {baseConfig[key].prefix}</p>
              </div>
              <CopyButton value={conversions?.[key] ?? ""} />
            </div>
            <code className="block overflow-x-auto font-mono text-lg text-ink">
              {conversions?.[key] ?? "Invalid input"}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}
