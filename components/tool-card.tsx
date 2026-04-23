import Link from "next/link";
import type { ToolDefinition } from "@/lib/tools";

export function ToolCard({ tool, index, compact = false }: { tool: ToolDefinition; index: number; compact?: boolean }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group relative overflow-hidden rounded-[1.4rem] border border-ink/10 bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:border-lake/30 ${compact ? "p-4" : "p-6"}`}
    >
      <div className={`absolute right-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-lake ${compact ? "" : "md:right-4 md:top-4 md:px-3"}`}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className={`inline-flex rounded-full bg-sage px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-lake ${compact ? "mb-4" : "mb-8"}`}>
        {tool.badge}
      </div>
      <h2 className={`${compact ? "max-w-sm text-lg" : "max-w-xs text-2xl"} font-bold tracking-tight text-ink`}>
        {tool.name}
      </h2>
      <p className={`${compact ? "mt-2 line-clamp-2 text-[13px] leading-6" : "mt-3 max-w-sm text-sm leading-7"} text-ink/75`}>
        {tool.description}
      </p>
      <span className={`${compact ? "mt-4 text-sm" : "mt-8 text-sm"} inline-flex items-center gap-2 font-semibold text-accent transition group-hover:gap-3`}>
        Open tool
        <span aria-hidden="true">-&gt;</span>
      </span>
    </Link>
  );
}
