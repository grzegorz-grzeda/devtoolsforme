"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ToolCard } from "@/components/tool-card";
import { readStoredCounts, readStoredList, toolPreferenceKeys } from "@/components/tool-preferences";
import type { ToolDefinition } from "@/lib/tools";

const allCategory = "All";
const featuredCategory = "Embedded";

const embeddedHighlights = [
  { title: "Registers", detail: "bitmasks, fields, signed values" },
  { title: "Firmware", detail: "HEX, S-record, memory inspection" },
  { title: "Timing", detail: "UART, PLL, DMA, timers" },
  { title: "Protocols", detail: "CRC, CAN, Modbus, buses" },
];

function mapTools(slugs: string[], tools: ToolDefinition[]) {
  return slugs
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is ToolDefinition => Boolean(tool));
}

function CompactToolLinks({ title, tools }: { title: string; tools: ToolDefinition[] }) {
  if (tools.length === 0) return null;

  return (
    <div className="rounded-[1.25rem] border border-ink/10 bg-white/75 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">{title}</p>
        <span className="text-xs font-semibold text-ink/45">{tools.length}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="rounded-full border border-ink/10 bg-card px-3 py-1.5 text-sm font-medium text-ink transition hover:border-lake/30 hover:bg-white"
          >
            {tool.name}
          </Link>
        ))}
      </div>
    </div>
  );
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
        .slice(0, 6);
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

  const embeddedTools = useMemo(
    () => tools.filter((tool) => tool.category === featuredCategory),
    [tools]
  );

  const featuredTools = useMemo(() => embeddedTools.slice(0, 4), [embeddedTools]);

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
      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="rounded-[1.6rem] border border-white/60 bg-ink p-5 text-white shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Embedded quick access</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">Advanced firmware helpers, without the clutter.</h2>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
              {embeddedTools.length} tools
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {embeddedHighlights.map((item) => (
              <div key={item.title} className="rounded-[1.15rem] border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">{item.title}</p>
                <p className="mt-1 text-sm text-white/85">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} index={tools.findIndex((entry) => entry.slug === tool.slug)} compact />
            ))}
          </div>
        </section>

        <div className="space-y-4">
          <div className="rounded-[1.6rem] border border-white/60 bg-card p-5 shadow-soft backdrop-blur">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <label className="block space-y-2 text-sm font-semibold text-ink/80">
                Search tools
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Find hex, regex, json, crc, uart..."
                  className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                />
              </label>
              <div className="rounded-2xl bg-ink px-4 py-3 text-sm text-white">
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

          {(favorites.length > 0 || recent.length > 0 || popular.length > 0) && (
            <div className="grid gap-3 lg:grid-cols-3">
              <CompactToolLinks title="Favorites" tools={favorites.slice(0, 5)} />
              <CompactToolLinks title="Recent" tools={recent.slice(0, 5)} />
              <CompactToolLinks title="Popular" tools={popular.slice(0, 5)} />
            </div>
          )}
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
