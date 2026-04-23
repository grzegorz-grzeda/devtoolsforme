"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

function encodeUtf8(value: string) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(value)));
}

function decodeUtf8(value: string) {
  const bytes = Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function Base64Tool() {
  const [source, setSource] = useState("Hello, devtoolsforme!");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const output = useMemo(() => {
    if (!source) {
      return "";
    }

    try {
      return mode === "encode" ? encodeUtf8(source) : decodeUtf8(source);
    } catch {
      return "Invalid input for this mode.";
    }
  }, [mode, source]);

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
            {value === "encode" ? "String -> Base64" : "Base64 -> String"}
          </button>
        ))}
      </div>

      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Input
        <textarea
          value={source}
          onChange={(event) => setSource(event.target.value)}
          rows={8}
          className="min-h-[180px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 text-sm text-ink outline-none transition focus:border-accent"
          placeholder={mode === "encode" ? "Type plain text here" : "Paste Base64 here"}
        />
      </label>

      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Output</h2>
          <CopyButton value={output} />
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-ink">{output || "Your result will appear here."}</pre>
      </div>
    </div>
  );
}
