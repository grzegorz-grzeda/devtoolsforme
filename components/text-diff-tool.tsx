"use client";

import { useMemo, useState } from "react";

type DiffRow = {
  left: string;
  right: string;
  status: "same" | "changed" | "added" | "removed";
};

function buildDiff(left: string, right: string): DiffRow[] {
  const leftLines = left.split("\n");
  const rightLines = right.split("\n");
  const length = Math.max(leftLines.length, rightLines.length);

  return Array.from({ length }, (_, index) => {
    const currentLeft = leftLines[index] ?? "";
    const currentRight = rightLines[index] ?? "";

    if (index >= leftLines.length) {
      return { left: "", right: currentRight, status: "added" };
    }

    if (index >= rightLines.length) {
      return { left: currentLeft, right: "", status: "removed" };
    }

    if (currentLeft === currentRight) {
      return { left: currentLeft, right: currentRight, status: "same" };
    }

    return { left: currentLeft, right: currentRight, status: "changed" };
  });
}

const statusClasses: Record<DiffRow["status"], string> = {
  same: "bg-white/60",
  changed: "bg-[#fff2d8]",
  added: "bg-[#e1f3e7]",
  removed: "bg-[#fde7df]",
};

export function TextDiffTool() {
  const [left, setLeft] = useState("name=devtoolsforme\nmode=preview\nversion=1");
  const [right, setRight] = useState("name=devtoolsforme\nmode=production\nversion=2\nregion=eu");

  const rows = useMemo(() => buildDiff(left, right), [left, right]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block space-y-2 text-sm font-semibold text-ink/80">
          Left text
          <textarea
            value={left}
            onChange={(event) => setLeft(event.target.value)}
            rows={8}
            className="min-h-[180px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 font-mono text-sm text-ink outline-none transition focus:border-accent"
          />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">
          Right text
          <textarea
            value={right}
            onChange={(event) => setRight(event.target.value)}
            rows={8}
            className="min-h-[180px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 font-mono text-sm text-ink outline-none transition focus:border-accent"
          />
        </label>
      </div>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={index} className={`grid gap-3 rounded-[1.4rem] p-4 md:grid-cols-2 ${statusClasses[row.status]}`}>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-lake">Left {index + 1}</p>
              <pre className="whitespace-pre-wrap break-words font-mono text-sm text-ink">{row.left || " "}</pre>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-lake">Right {index + 1}</p>
              <pre className="whitespace-pre-wrap break-words font-mono text-sm text-ink">{row.right || " "}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
