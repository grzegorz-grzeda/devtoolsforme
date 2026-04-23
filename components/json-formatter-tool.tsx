"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

export function JSONFormatterTool() {
  const [input, setInput] = useState('{"name":"devtoolsforme","tools":["uuid","json"]}');
  const [mode, setMode] = useState<"pretty" | "minify">("pretty");

  const result = useMemo(() => {
    if (!input.trim()) {
      return { output: "", error: "" };
    }

    try {
      const parsed = JSON.parse(input);
      return {
        output: mode === "pretty" ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed),
        error: "",
      };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  }, [input, mode]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {(["pretty", "minify"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === value ? "bg-accent text-white" : "bg-sage text-lake hover:bg-sage/70"
            }`}
          >
            {value === "pretty" ? "Pretty print" : "Minify"}
          </button>
        ))}
      </div>

      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        JSON input
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={10}
          className="min-h-[220px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 font-mono text-sm text-ink outline-none transition focus:border-accent"
        />
      </label>

      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Output</h2>
          <CopyButton value={result.output} />
        </div>
        {result.error ? (
          <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">{result.error}</p>
        ) : (
          <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-ink">
            {result.output || "Formatted JSON will appear here."}
          </pre>
        )}
      </div>
    </div>
  );
}
