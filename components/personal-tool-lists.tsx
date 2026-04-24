"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readStoredCounts, readStoredList, toolPreferenceKeys } from "@/components/tool-preferences";
import type { ToolDefinition } from "@/lib/tools";

function mapTools(slugs: string[], tools: ToolDefinition[]) {
  return slugs
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is ToolDefinition => Boolean(tool));
}

function ToolListSection({
  title,
  description,
  tools,
}: {
  title: string;
  description: string;
  tools: ToolDefinition[];
}) {
  return (
    <section className="rounded-[1.5rem] border border-white/60 bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">{title}</p>
          <p className="mt-2 text-sm text-ink/70">{description}</p>
        </div>
        <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-lake">{tools.length}</span>
      </div>

      {tools.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:border-lake/30 hover:bg-white/80"
            >
              {tool.name}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-ink/55">Nothing here yet.</p>
      )}
    </section>
  );
}

export function PersonalToolLists({ tools }: { tools: ToolDefinition[] }) {
  const [favorites, setFavorites] = useState<ToolDefinition[]>([]);
  const [recent, setRecent] = useState<ToolDefinition[]>([]);
  const [popular, setPopular] = useState<ToolDefinition[]>([]);

  useEffect(() => {
    const sync = () => {
      setFavorites(mapTools(readStoredList(toolPreferenceKeys.favoritesKey), tools).slice(0, 8));
      setRecent(mapTools(readStoredList(toolPreferenceKeys.recentKey), tools).slice(0, 8));
      const counts = readStoredCounts();
      const ranked = [...tools]
        .filter((tool) => counts[tool.slug])
        .sort((left, right) => (counts[right.slug] ?? 0) - (counts[left.slug] ?? 0))
        .slice(0, 8);
      setPopular(ranked);
    };

    sync();
    window.addEventListener("tool-preferences-changed", sync);
    return () => window.removeEventListener("tool-preferences-changed", sync);
  }, [tools]);

  const hasAnyTools = favorites.length > 0 || recent.length > 0 || popular.length > 0;

  return (
    <div className="mt-8 space-y-4">
      {!hasAnyTools && (
        <div className="rounded-[1.5rem] border border-dashed border-ink/15 bg-white/50 p-7 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Nothing saved yet</p>
          <p className="mt-3 text-sm leading-7 text-ink/70">
            Open tools to build your recent and popular lists, or favorite a tool to keep it close at hand.
          </p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <ToolListSection title="Favorites" description="Pinned tools saved in this browser." tools={favorites} />
        <ToolListSection title="Recent" description="The latest tools you opened here." tools={recent} />
        <ToolListSection title="Popular" description="Your most-opened tools on this device." tools={popular} />
      </div>
    </div>
  );
}
