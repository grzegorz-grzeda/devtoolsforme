"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

function tokenize(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim()
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((token) => token.toLowerCase());
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function CaseConverterTool() {
  const [input, setInput] = useState("dev tools for me");

  const outputs = useMemo(() => {
    const words = tokenize(input);
    return {
      camelCase: words.map((word, index) => (index === 0 ? word : capitalize(word))).join(""),
      PascalCase: words.map(capitalize).join(""),
      snake_case: words.join("_"),
      kebab_case: words.join("-"),
      SCREAMING_SNAKE: words.join("_").toUpperCase(),
      Title_Case: words.map(capitalize).join(" "),
      lowercase: input.toLowerCase(),
      UPPERCASE: input.toUpperCase(),
    };
  }, [input]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-semibold text-ink/80">
        Source text
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={6}
          className="min-h-[150px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 text-sm text-ink outline-none transition focus:border-accent"
        />
      </label>

      <div className="grid gap-3">
        {Object.entries(outputs).map(([label, value]) => (
          <div key={label} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">{label.replace(/_/g, " ")}</p>
              <CopyButton value={value} />
            </div>
            <code className="block overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm text-ink">{value || "-"}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
