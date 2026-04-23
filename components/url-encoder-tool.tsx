"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

export function URLEncoderTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("hello world?tool=devtoolsforme&mode=fast");

  const output = useMemo(() => {
    if (!input) {
      return "";
    }

    try {
      return mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch {
      return "Invalid URL-encoded input.";
    }
  }, [input, mode]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {(["encode", "decode"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === value ? "bg-accent text-white" : "bg-sage text-lake hover:bg-sage/70"
            }`}
          >
            {value === "encode" ? "Text -> URL" : "URL -> Text"}
          </button>
        ))}
      </div>

      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Input
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={8}
          className="min-h-[180px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 text-sm text-ink outline-none transition focus:border-accent"
        />
      </label>

      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Output</h2>
          <CopyButton value={output} />
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-ink">{output || "Converted output will appear here."}</pre>
      </div>
    </div>
  );
}
