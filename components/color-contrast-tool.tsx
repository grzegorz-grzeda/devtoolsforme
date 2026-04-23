"use client";

import { useMemo, useState } from "react";

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }
  const value = Number.parseInt(normalized, 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

function luminance(channel: number) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function contrastRatio(foreground: string, background: string) {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  if (!fg || !bg) return null;
  const fgL = 0.2126 * luminance(fg.r) + 0.7152 * luminance(fg.g) + 0.0722 * luminance(fg.b);
  const bgL = 0.2126 * luminance(bg.r) + 0.7152 * luminance(bg.g) + 0.0722 * luminance(bg.b);
  const lighter = Math.max(fgL, bgL);
  const darker = Math.min(fgL, bgL);
  return (lighter + 0.05) / (darker + 0.05);
}

export function ColorContrastTool() {
  const [foreground, setForeground] = useState("#15241D");
  const [background, setBackground] = useState("#F7F3EB");

  const ratio = useMemo(() => contrastRatio(foreground, background), [foreground, background]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2 text-sm font-semibold text-ink/80">
          Foreground
          <input value={foreground} onChange={(event) => setForeground(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-lg outline-none transition focus:border-accent" />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">
          Background
          <input value={background} onChange={(event) => setBackground(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-lg outline-none transition focus:border-accent" />
        </label>
      </div>
      <div className="rounded-[1.6rem] border border-ink/10 p-6" style={{ color: foreground, backgroundColor: background }}>
        <p className="text-xs font-semibold uppercase tracking-[0.24em]">Preview</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">Readable interface text</h2>
        <p className="mt-3 text-sm leading-7">Use this preview to judge readability and pair it with the WCAG ratio below.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Contrast ratio</p><p className="mt-2 text-2xl font-bold text-ink">{ratio ? ratio.toFixed(2) : "Invalid"}</p></div>
        <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">AA normal text</p><p className="mt-2 text-2xl font-bold text-ink">{ratio && ratio >= 4.5 ? "Pass" : "Fail"}</p></div>
        <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">AAA normal text</p><p className="mt-2 text-2xl font-bold text-ink">{ratio && ratio >= 7 ? "Pass" : "Fail"}</p></div>
      </div>
    </div>
  );
}
