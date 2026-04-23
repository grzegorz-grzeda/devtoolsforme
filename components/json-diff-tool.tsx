"use client";

import { useMemo, useState } from "react";

type DiffRow = {
  key: string;
  status: "same" | "changed" | "added" | "removed";
  left: string;
  right: string;
};

const statusClass: Record<DiffRow["status"], string> = {
  same: "bg-white/70",
  changed: "bg-[#fff2d8]",
  added: "bg-[#e1f3e7]",
  removed: "bg-[#fde7df]",
};

function formatJson(value: string) {
  return JSON.stringify(JSON.parse(value), null, 2);
}

export function JSONDiffTool() {
  const [leftInput, setLeftInput] = useState('{"name":"devtoolsforme","version":1,"features":["json","uuid"]}');
  const [rightInput, setRightInput] = useState('{"name":"devtoolsforme","version":2,"features":["json","uuid","diff"],"region":"eu"}');

  const result = useMemo(() => {
    try {
      const left = formatJson(leftInput).split("\n");
      const right = formatJson(rightInput).split("\n");
      const length = Math.max(left.length, right.length);
      const rows: DiffRow[] = [];

      for (let index = 0; index < length; index += 1) {
        const currentLeft = left[index] ?? "";
        const currentRight = right[index] ?? "";
        const status =
          index >= left.length
            ? "added"
            : index >= right.length
              ? "removed"
              : currentLeft === currentRight
                ? "same"
                : "changed";

        rows.push({ key: `${index}-${status}`, status, left: currentLeft, right: currentRight });
      }

      return { rows, error: "" };
    } catch (error) {
      return {
        rows: [],
        error: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  }, [leftInput, rightInput]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block space-y-2 text-sm font-semibold text-ink/80">
          Left JSON
          <textarea value={leftInput} onChange={(event) => setLeftInput(event.target.value)} rows={9} className="min-h-[200px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 font-mono text-sm outline-none transition focus:border-accent" />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">
          Right JSON
          <textarea value={rightInput} onChange={(event) => setRightInput(event.target.value)} rows={9} className="min-h-[200px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 font-mono text-sm outline-none transition focus:border-accent" />
        </label>
      </div>

      {result.error ? (
        <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">{result.error}</p>
      ) : (
        <div className="space-y-3">
          {result.rows.map((row) => (
            <div key={row.key} className={`grid gap-3 rounded-[1.4rem] p-4 md:grid-cols-2 ${statusClass[row.status]}`}>
              <pre className="whitespace-pre-wrap break-words font-mono text-xs text-ink">{row.left || " "}</pre>
              <pre className="whitespace-pre-wrap break-words font-mono text-xs text-ink">{row.right || " "}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
