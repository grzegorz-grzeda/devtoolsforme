import Link from "next/link";
import type { ToolDefinition } from "@/lib/tools";

export function ToolCard({ tool, index }: { tool: ToolDefinition; index: number }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative overflow-hidden rounded-[1.8rem] border border-ink/10 bg-card p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-lake/30"
    >
      <div className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-lake">
        0{index + 1}
      </div>
      <div className="mb-8 inline-flex rounded-full bg-sage px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-lake">
        {tool.badge}
      </div>
      <h2 className="max-w-xs text-2xl font-bold tracking-tight text-ink">{tool.name}</h2>
      <p className="mt-3 max-w-sm text-sm leading-7 text-ink/75">{tool.description}</p>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent transition group-hover:gap-3">
        Open tool
        <span aria-hidden="true">-&gt;</span>
      </span>
    </Link>
  );
}
