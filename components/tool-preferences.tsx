"use client";

import { useEffect, useState } from "react";

const favoritesKey = "dtfm-favorite-tools";
const recentKey = "dtfm-recent-tools";
const openCountsKey = "dtfm-tool-open-counts";

export function readStoredList(key: string) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function readStoredCounts() {
  try {
    const raw = window.localStorage.getItem(openCountsKey);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function writeValue(key: string, value: string[] | Record<string, number>) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("tool-preferences-changed"));
}

export function ToolVisitTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const current = readStoredList(recentKey).filter((entry) => entry !== slug);
    writeValue(recentKey, [slug, ...current].slice(0, 6));

    const counts = readStoredCounts();
    counts[slug] = (counts[slug] ?? 0) + 1;
    writeValue(openCountsKey, counts);
  }, [slug]);

  return null;
}

export function FavoriteToolButton({ slug }: { slug: string }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const update = () => setFavorite(readStoredList(favoritesKey).includes(slug));
    update();
    window.addEventListener("tool-preferences-changed", update);
    return () => window.removeEventListener("tool-preferences-changed", update);
  }, [slug]);

  function toggleFavorite() {
    const current = readStoredList(favoritesKey);
    const next = current.includes(slug) ? current.filter((entry) => entry !== slug) : [slug, ...current].slice(0, 8);
    writeValue(favoritesKey, next);
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        favorite ? "bg-accent text-white hover:bg-accentDark" : "bg-sage text-lake hover:bg-sage/70"
      }`}
    >
      {favorite ? "Favorited" : "Add to favorites"}
    </button>
  );
}

export function ToolCopyLinkButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-lake"
    >
      {copied ? "Copied" : `Copy ${title} link`}
    </button>
  );
}

export const toolPreferenceKeys = {
  favoritesKey,
  recentKey,
  openCountsKey,
};
