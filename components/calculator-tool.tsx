"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

const buttons = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  "(",
  ")",
  "C",
  "%",
  "+",
  "=",
];

function evaluateExpression(expression: string) {
  if (!expression.trim()) {
    return "";
  }

  if (!/^[0-9+\-*/%().\s]+$/.test(expression)) {
    return "Unsupported characters";
  }

  try {
    const result = Function(`"use strict"; return (${expression})`)();
    return Number.isFinite(result) ? String(result) : "Invalid calculation";
  } catch {
    return "Invalid calculation";
  }
}

export function CalculatorTool() {
  const [expression, setExpression] = useState("(12 + 8) / 5");
  const result = useMemo(() => evaluateExpression(expression), [expression]);

  function append(value: string) {
    if (value === "C") {
      setExpression("");
      return;
    }

    if (value === "=") {
      if (result && result !== "Invalid calculation" && result !== "Unsupported characters") {
        setExpression(result);
      }
      return;
    }

    setExpression((current) => `${current}${value}`);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[1.6rem] bg-ink p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Expression</p>
        <textarea
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          rows={3}
          className="mt-3 min-h-[96px] w-full resize-none bg-transparent text-3xl font-medium tracking-tight outline-none"
        />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Result</p>
            <p className="text-2xl font-bold">{result || "0"}</p>
          </div>
          <CopyButton value={result} label="Copy result" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {buttons.map((button) => (
          <button
            key={button}
            type="button"
            onClick={() => append(button)}
            className={`rounded-2xl px-4 py-4 text-lg font-semibold transition ${
              button === "="
                ? "bg-accent text-white hover:bg-accentDark"
                : button === "C"
                  ? "bg-lake text-white hover:bg-lake/90"
                  : "bg-white/80 text-ink hover:bg-white"
            }`}
          >
            {button}
          </button>
        ))}
      </div>
    </div>
  );
}
