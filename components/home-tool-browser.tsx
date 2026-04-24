"use client";

import { useMemo, useState } from "react";
import { ToolCard } from "@/components/tool-card";
import type { ToolDefinition } from "@/lib/tools";

const allCategory = "All";

export function HomeToolBrowser({ tools }: { tools: ToolDefinition[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(allCategory);

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
    <section className="mt-6 space-y-5">
      <div className="rounded-[1.6rem] border border-white/60 bg-card p-5 shadow-soft backdrop-blur">
        <div className="flex items-end gap-4">
          <label className="block flex-1 space-y-2 text-sm font-semibold text-ink/80">
            Search tools
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find hex, regex, json, crc, uart..."
              className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
            />
          </label>
          <div className="shrink-0 rounded-2xl bg-ink px-4 py-3 text-sm text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Showing</p>
            <p className="mt-1 text-xl font-bold">{filteredTools.length}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                activeCategory === category ? "bg-accent text-white" : "bg-sage text-lake hover:bg-sage/70"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {orderedGroups.length === 0 ? (
        <div className="rounded-[1.6rem] border border-dashed border-ink/15 bg-white/50 p-7 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">No matches</p>
          <p className="mt-3 text-sm leading-7 text-ink/70">Try a broader search or change the category filter.</p>
        </div>
      ) : (
        orderedGroups.map(([category, items]) => (
          <section key={category} className="space-y-3">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lake/80">{category}</p>
                <h3 className="mt-1 text-xl font-bold tracking-tight text-ink">{items.length} tools</h3>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((tool) => {
                const index = tools.findIndex((entry) => entry.slug === tool.slug);
                return <ToolCard key={tool.slug} tool={tool} index={index} compact />;
              })}
            </div>
          </section>
        ))
      )}
    </section>
  );
}
