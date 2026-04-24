"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import {
  MAX_LOREM_COUNT,
  clampLoremCount,
  generateParagraphs,
  generateSentences,
  generateWords,
} from "@/lib/lorem-generator";

export function LoremGeneratorTool() {
  const [mode, setMode] = useState<"words" | "sentences" | "paragraphs">("paragraphs");
  const [count, setCount] = useState(3);

  const output = useMemo(() => {
    if (mode === "words") {
      return generateWords(count);
    }

    if (mode === "sentences") {
      return generateSentences(count);
    }

    return generateParagraphs(count);
  }, [count, mode]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {(["words", "sentences", "paragraphs"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
              mode === value ? "bg-accent text-white" : "bg-sage text-lake hover:bg-sage/70"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-2 text-sm font-semibold text-ink/80">
        Amount
        <input
          type="number"
          min={1}
          max={MAX_LOREM_COUNT}
          step={1}
          inputMode="numeric"
          value={count}
          onChange={(event) => setCount(clampLoremCount(Number.parseInt(event.target.value, 10)))}
          className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-base text-lake outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <span className="font-mono text-sm text-ink/60">1–{MAX_LOREM_COUNT}</span>
      </label>

      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Generated content</h2>
          <CopyButton value={output} />
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm leading-7 text-ink">{output}</pre>
      </div>
    </div>
  );
}
