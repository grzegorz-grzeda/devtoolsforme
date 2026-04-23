"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }

  const value = Number.parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let h = 0;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  if (delta !== 0) {
    if (max === red) h = ((green - blue) / delta) % 6;
    else if (max === green) h = (blue - red) / delta + 2;
    else h = (red - green) / delta + 4;
  }

  return {
    h: Math.round(h * 60 < 0 ? h * 60 + 360 : h * 60),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function ColorConverterTool() {
  const [hex, setHex] = useState("#EF6C3D");

  const values = useMemo(() => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {
      hex: `#${hex.replace("#", "").toUpperCase()}`,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    };
  }, [hex]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_140px]">
        <label className="block space-y-2 text-sm font-semibold text-ink/80">
          HEX color
          <input value={hex} onChange={(event) => setHex(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-lg outline-none transition focus:border-accent" />
        </label>
        <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Preview</p>
          <div className="mt-3 h-16 rounded-2xl border border-ink/10" style={{ background: values?.hex ?? "transparent" }} />
        </div>
      </div>
      {!values ? (
        <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">Use a 6-digit hex value like #EF6C3D.</p>
      ) : (
        <div className="grid gap-3">
          {Object.entries(values).map(([label, value]) => (
            <div key={label} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">{label}</p>
                <CopyButton value={value} />
              </div>
              <code className="font-mono text-sm text-ink">{value}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
