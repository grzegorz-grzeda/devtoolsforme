"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

const buttons = [
  "7", "8", "9", "/",
  "4", "5", "6", "*",
  "1", "2", "3", "-",
  "0", ".", "(", ")",
  "C", "%", "+", "=",
];

const ERROR_INVALID = "Invalid calculation";
const ERROR_UNSUPPORTED = "Unsupported characters";

function evaluateExpression(expression: string) {
  if (!expression.trim()) {
    return "";
  }

  if (!/^[0-9+\-*/%().\s]+$/.test(expression)) {
    return ERROR_UNSUPPORTED;
  }

  try {
    const result = Function(`"use strict"; return (${expression})`)();
    return Number.isFinite(result) ? String(result) : ERROR_INVALID;
  } catch {
    return ERROR_INVALID;
  }
}

function getAlternativeBases(result: string): { hex: string; oct: string; bin: string } | null {
  const num = Number(result);
  if (!Number.isFinite(num)) return null;
  if (!Number.isInteger(num)) {
    return { hex: "N/A (float)", oct: "N/A (float)", bin: "N/A (float)" };
  }
  if (!Number.isSafeInteger(num)) {
    return { hex: "N/A (too large)", oct: "N/A (too large)", bin: "N/A (too large)" };
  }
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";
  return {
    hex: `${sign}0x${abs.toString(16).toUpperCase()}`,
    oct: `${sign}0o${abs.toString(8)}`,
    bin: `${sign}0b${abs.toString(2)}`,
  };
}

export function CalculatorTool() {
  const [expression, setExpression] = useState("(12 + 8) / 5");
  const [history, setHistory] = useState<string[]>([]);
  const result = useMemo(() => evaluateExpression(expression), [expression]);
  const altBases = useMemo(() => (result && result !== ERROR_INVALID && result !== ERROR_UNSUPPORTED ? getAlternativeBases(result) : null), [result]);

  function append(value: string) {
    if (value === "C") {
      setExpression("");
      return;
    }

    if (value === "=") {
      if (result && result !== ERROR_INVALID && result !== ERROR_UNSUPPORTED) {
        setHistory((current) => [`${expression} = ${result}`, ...current].slice(0, 6));
        setExpression(result);
      }
      return;
    }

    setExpression((current) => `${current}${value}`);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((/^[0-9+\-*/%().]$/).test(event.key)) {
        setExpression((current) => `${current}${event.key}`);
      } else if (event.key === "Enter") {
        event.preventDefault();
        append("=");
      } else if (event.key === "Backspace") {
        setExpression((current) => current.slice(0, -1));
      } else if (event.key.toLowerCase() === "c" && (event.ctrlKey || event.metaKey)) {
        return;
      } else if (event.key === "Escape") {
        setExpression("");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expression, result]);

  return (
    <div className="space-y-5">
      <div className="rounded-[1.6rem] bg-ink p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Expression</p>
        <textarea value={expression} onChange={(event) => setExpression(event.target.value)} rows={3} className="mt-3 min-h-[96px] w-full resize-none bg-transparent text-3xl font-medium tracking-tight outline-none" />
        <div className="mt-2 text-xs text-white/55">Keyboard: numbers/operators, `Enter` to evaluate, `Backspace` to delete, `Esc` to clear.</div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Result</p>
            <p className="text-2xl font-bold">{result || "0"}</p>
            {altBases && (
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-white/70">
                <span><span className="text-white/40">HEX</span> {altBases.hex}</span>
                <span><span className="text-white/40">OCT</span> {altBases.oct}</span>
                <span><span className="text-white/40">BIN</span> {altBases.bin}</span>
              </div>
            )}
          </div>
          <CopyButton value={result} label="Copy result" />
        </div>
      </div>

      {history.length > 0 && (
        <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Recent calculations</h2>
          <div className="mt-3 space-y-2">
            {history.map((entry) => (
              <button key={entry} type="button" onClick={() => setExpression(entry.split(" = ")[0])} className="block w-full rounded-2xl bg-canvas px-4 py-3 text-left font-mono text-sm text-ink transition hover:bg-white">
                {entry}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        {buttons.map((button) => (
          <button key={button} type="button" onClick={() => append(button)} className={`rounded-2xl px-4 py-4 text-lg font-semibold transition ${button === "=" ? "bg-accent text-white hover:bg-accentDark" : button === "C" ? "bg-lake text-white hover:bg-lake/90" : "bg-white/80 text-ink hover:bg-white"}`}>
            {button}
          </button>
        ))}
      </div>
    </div>
  );
}
