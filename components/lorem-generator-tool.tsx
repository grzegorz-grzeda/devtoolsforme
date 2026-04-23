"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

const sourceWords = [
  "devtoolsforme", "browser", "workflow", "deploy", "utility", "signal", "format", "inspect",
  "token", "layout", "compose", "iterate", "build", "preview", "release", "clarity", "focus",
  "streamline", "syntax", "helper", "snippet", "design", "console", "pipeline", "typing",
];

function generateWords(count: number) {
  return Array.from({ length: count }, (_, index) => sourceWords[index % sourceWords.length]).join(" ");
}

function generateSentences(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const start = (index * 7) % sourceWords.length;
    const words = Array.from({ length: 10 }, (_, offset) => sourceWords[(start + offset) % sourceWords.length]);
    return `${words[0].charAt(0).toUpperCase()}${words[0].slice(1)} ${words.slice(1).join(" ")}.`;
  }).join(" ");
}

function generateParagraphs(count: number) {
  return Array.from({ length: count }, (_, index) => generateSentences(3 + (index % 2))).join("\n\n");
}

export function LoremGeneratorTool() {
  const [mode, setMode] = useState<"words" | "sentences" | "paragraphs">("paragraphs");
  const [count, setCount] = useState(3);

  const output = useMemo(() => {
    if (mode === "words") {
      return generateWords(count * 12);
    }

    if (mode === "sentences") {
      return generateSentences(count * 3);
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
          type="range"
          min={1}
          max={10}
          value={count}
          onChange={(event) => setCount(Number(event.target.value))}
          className="accent-accent"
        />
        <span className="font-mono text-lg text-lake">{count}</span>
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
