"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolCard } from "@/components/tool-card";
import { readStoredCounts, readStoredList, toolPreferenceKeys } from "@/components/tool-preferences";
import type { ToolDefinition } from "@/lib/tools";

const allCategory = "All";

function mapTools(slugs: string[], tools: ToolDefinition[]) {
  return slugs
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is ToolDefinition => Boolean(tool));
}

export function HomeToolBrowser({ tools }: { tools: ToolDefinition[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(allCategory);
  const [favorites, setFavorites] = useState<ToolDefinition[]>([]);
  const [recent, setRecent] = useState<ToolDefinition[]>([]);
  const [popular, setPopular] = useState<ToolDefinition[]>([]);

  useEffect(() => {
    const sync = () => {
      setFavorites(mapTools(readStoredList(toolPreferenceKeys.favoritesKey), tools));
      setRecent(mapTools(readStoredList(toolPreferenceKeys.recentKey), tools));
      const counts = readStoredCounts();
      const ranked = [...tools]
        .filter((tool) => counts[tool.slug])
        .sort((left, right) => (counts[right.slug] ?? 0) - (counts[left.slug] ?? 0))
        .slice(0, 4);
      setPopular(ranked);
    };

    sync();
    window.addEventListener("tool-preferences-changed", sync);
    return () => window.removeEventListener("tool-preferences-changed", sync);
  }, [tools]);

  const categories = useMemo(
    () => [allCategory, ...Array.from(new Set(tools.map((tool) => tool.category)))],
    [tools]
  );

  const filteredTools = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesCategory = activeCategory === allCategory || tool.category === activeCategory;
      const matchesQuery =
        !normalized ||
        tool.name.toLowerCase().includes(normalized) ||
        tool.description.toLowerCase().includes(normalized) ||
        tool.badge.toLowerCase().includes(normalized) ||
        tool.category.toLowerCase().includes(normalized);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, tools]);

  const groupedTools = useMemo(() => {
    return filteredTools.reduce<Record<string, ToolDefinition[]>>((accumulator, tool) => {
      accumulator[tool.category] ??= [];
      accumulator[tool.category].push(tool);
      return accumulator;
    }, {});
  }, [filteredTools]);

  const orderedGroups = categories
    .filter((category) => category !== allCategory)
    .map((category) => [category, groupedTools[category] ?? []] as const)
    .filter(([, items]) => items.length > 0);

  return (
    <section className="mt-6 space-y-8">
      <div className="rounded-[2rem] border border-white/60 bg-card p-5 shadow-soft backdrop-blur md:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <label className="block space-y-2 text-sm font-semibold text-ink/80">
            Search tools
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find JSON, regex, encoding, timestamps..."
              className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
            />
          </label>
          <div className="rounded-2xl bg-ink px-4 py-3 text-sm text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Showing</p>
            <p className="mt-1 text-2xl font-bold">{filteredTools.length}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category ? "bg-accent text-white" : "bg-sage text-lake hover:bg-sage/70"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {(favorites.length > 0 || recent.length > 0 || popular.length > 0) && (
        <section className="grid gap-5 xl:grid-cols-3">
          {favorites.length > 0 && (
            <div className="rounded-[2rem] border border-white/60 bg-card p-5 shadow-soft backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-lake/80">Favorites</p>
              <div className="mt-4 grid gap-4">
                {favorites.slice(0, 3).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} index={tools.findIndex((entry) => entry.slug === tool.slug)} />
                ))}
              </div>
            </div>
          )}
          {recent.length > 0 && (
            <div className="rounded-[2rem] border border-white/60 bg-card p-5 shadow-soft backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-lake/80">Recently opened</p>
              <div className="mt-4 grid gap-4">
                {recent.slice(0, 3).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} index={tools.findIndex((entry) => entry.slug === tool.slug)} />
                ))}
              </div>
            </div>
          )}
          {popular.length > 0 && (
            <div className="rounded-[2rem] border border-white/60 bg-card p-5 shadow-soft backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-lake/80">Most used on this device</p>
              <div className="mt-4 grid gap-4">
                {popular.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} index={tools.findIndex((entry) => entry.slug === tool.slug)} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {orderedGroups.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-ink/15 bg-white/50 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">No matches</p>
          <p className="mt-3 text-sm leading-7 text-ink/70">
            Try a broader search or switch back to another category filter.
          </p>
        </div>
      ) : (
        orderedGroups.map(([category, items]) => (
          <section key={category} className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-lake/80">{category}</p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-ink">{items.length} tools ready</h3>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((tool) => {
                const index = tools.findIndex((entry) => entry.slug === tool.slug);
                return <ToolCard key={tool.slug} tool={tool} index={index} />;
              })}
            </div>
          </section>
        ))
      )}
    </section>
  );
}
