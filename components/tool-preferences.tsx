"use client";

import { useEffect, useState } from "react";

const favoritesKey = "dtfm-favorite-tools";
const recentKey = "dtfm-recent-tools";

function readList(key: string) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeList(key: string, values: string[]) {
  window.localStorage.setItem(key, JSON.stringify(values));
  window.dispatchEvent(new Event("tool-preferences-changed"));
}

export function ToolVisitTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const current = readList(recentKey).filter((entry) => entry !== slug);
    writeList(recentKey, [slug, ...current].slice(0, 6));
  }, [slug]);

  return null;
}

export function FavoriteToolButton({ slug }: { slug: string }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const update = () => setFavorite(readList(favoritesKey).includes(slug));
    update();
    window.addEventListener("tool-preferences-changed", update);
    return () => window.removeEventListener("tool-preferences-changed", update);
  }, [slug]);

  function toggleFavorite() {
    const current = readList(favoritesKey);
    const next = current.includes(slug) ? current.filter((entry) => entry !== slug) : [slug, ...current].slice(0, 8);
    writeList(favoritesKey, next);
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
