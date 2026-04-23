"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

type InputMode = "hex" | "rgb" | "hsl" | "hsv" | "cmyk";

type RGB = { r: number; g: number; b: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "").trim();
  const expanded = normalized.length === 3 ? normalized.split("").map((value) => value + value).join("") : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return null;

  const value = Number.parseInt(expanded, 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

function rgbToHex({ r, g, b }: RGB) {
  return `#${[r, g, b].map((value) => clamp(Math.round(value), 0, 255).toString(16).toUpperCase().padStart(2, "0")).join("")}`;
}

function parseRgb(input: string) {
  const matches = input.match(/\d+(?:\.\d+)?/g);
  if (!matches || matches.length < 3) return null;
  const [r, g, b] = matches.slice(0, 3).map(Number);
  if ([r, g, b].some((value) => Number.isNaN(value) || value < 0 || value > 255)) return null;
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

function hslToRgb(h: number, s: number, l: number) {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;
  const chroma = (1 - Math.abs(2 * light - 1)) * sat;
  const segment = hue / 60;
  const second = chroma * (1 - Math.abs((segment % 2) - 1));
  const match = light - chroma / 2;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (segment >= 0 && segment < 1) [red, green, blue] = [chroma, second, 0];
  else if (segment < 2) [red, green, blue] = [second, chroma, 0];
  else if (segment < 3) [red, green, blue] = [0, chroma, second];
  else if (segment < 4) [red, green, blue] = [0, second, chroma];
  else if (segment < 5) [red, green, blue] = [second, 0, chroma];
  else [red, green, blue] = [chroma, 0, second];

  return {
    r: Math.round((red + match) * 255),
    g: Math.round((green + match) * 255),
    b: Math.round((blue + match) * 255),
  };
}

function parseHsl(input: string) {
  const matches = input.match(/-?\d+(?:\.\d+)?/g);
  if (!matches || matches.length < 3) return null;
  const [h, s, l] = matches.slice(0, 3).map(Number);
  if ([h, s, l].some((value) => Number.isNaN(value))) return null;
  if (s < 0 || s > 100 || l < 0 || l > 100) return null;
  return { h, s, l };
}

function hsvToRgb(h: number, s: number, v: number) {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const value = clamp(v, 0, 100) / 100;
  const chroma = value * sat;
  const segment = hue / 60;
  const second = chroma * (1 - Math.abs((segment % 2) - 1));
  const match = value - chroma;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (segment >= 0 && segment < 1) [red, green, blue] = [chroma, second, 0];
  else if (segment < 2) [red, green, blue] = [second, chroma, 0];
  else if (segment < 3) [red, green, blue] = [0, chroma, second];
  else if (segment < 4) [red, green, blue] = [0, second, chroma];
  else if (segment < 5) [red, green, blue] = [second, 0, chroma];
  else [red, green, blue] = [chroma, 0, second];

  return {
    r: Math.round((red + match) * 255),
    g: Math.round((green + match) * 255),
    b: Math.round((blue + match) * 255),
  };
}

function parseHsv(input: string) {
  const matches = input.match(/-?\d+(?:\.\d+)?/g);
  if (!matches || matches.length < 3) return null;
  const [h, s, v] = matches.slice(0, 3).map(Number);
  if ([h, s, v].some((value) => Number.isNaN(value))) return null;
  if (s < 0 || s > 100 || v < 0 || v > 100) return null;
  return { h, s, v };
}

function rgbToHsv(r: number, g: number, b: number) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === red) h = ((green - blue) / delta) % 6;
    else if (max === green) h = (blue - red) / delta + 2;
    else h = (red - green) / delta + 4;
  }

  return {
    h: Math.round(h * 60 < 0 ? h * 60 + 360 : h * 60),
    s: Math.round((max === 0 ? 0 : delta / max) * 100),
    v: Math.round(max * 100),
  };
}

function rgbToCmyk(r: number, g: number, b: number) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const k = 1 - Math.max(red, green, blue);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - red - k) / (1 - k)) * 100),
    m: Math.round(((1 - green - k) / (1 - k)) * 100),
    y: Math.round(((1 - blue - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function cmykToRgb(c: number, m: number, y: number, k: number) {
  const cyan = clamp(c, 0, 100) / 100;
  const magenta = clamp(m, 0, 100) / 100;
  const yellow = clamp(y, 0, 100) / 100;
  const key = clamp(k, 0, 100) / 100;

  return {
    r: Math.round(255 * (1 - cyan) * (1 - key)),
    g: Math.round(255 * (1 - magenta) * (1 - key)),
    b: Math.round(255 * (1 - yellow) * (1 - key)),
  };
}

function parseCmyk(input: string) {
  const matches = input.match(/\d+(?:\.\d+)?/g);
  if (!matches || matches.length < 4) return null;
  const [c, m, y, k] = matches.slice(0, 4).map(Number);
  if ([c, m, y, k].some((value) => Number.isNaN(value) || value < 0 || value > 100)) return null;
  return { c, m, y, k };
}

function luminance(channel: number) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function contrastRatio(foreground: RGB, background: RGB) {
  const fgL = 0.2126 * luminance(foreground.r) + 0.7152 * luminance(foreground.g) + 0.0722 * luminance(foreground.b);
  const bgL = 0.2126 * luminance(background.r) + 0.7152 * luminance(background.g) + 0.0722 * luminance(background.b);
  const lighter = Math.max(fgL, bgL);
  const darker = Math.min(fgL, bgL);
  return (lighter + 0.05) / (darker + 0.05);
}

function readableForeground(color: RGB) {
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 17, g: 24, b: 39 };
  return contrastRatio(white, color) >= contrastRatio(black, color) ? white : black;
}

function rotateHue(rgb: RGB, degrees: number) {
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return hslToRgb((hsl.h + degrees + 360) % 360, hsl.s, hsl.l);
}

function slugifyHex(hex: string) {
  return `accent-${hex.replace("#", "").toLowerCase()}`;
}

export function ColorConverterTool() {
  const [inputMode, setInputMode] = useState<InputMode>("hex");
  const [hexInput, setHexInput] = useState("#EF6C3D");
  const [rgbInput, setRgbInput] = useState("239, 108, 61");
  const [hslInput, setHslInput] = useState("17, 85%, 59%");
  const [hsvInput, setHsvInput] = useState("17, 74%, 94%");
  const [cmykInput, setCmykInput] = useState("0%, 55%, 74%, 6%");

  const values = useMemo(() => {
    const rgb = inputMode === "hex"
      ? hexToRgb(hexInput)
      : inputMode === "rgb"
        ? parseRgb(rgbInput)
        : inputMode === "hsl"
          ? (() => {
            const hsl = parseHsl(hslInput);
            return hsl ? hslToRgb(hsl.h, hsl.s, hsl.l) : null;
          })()
          : inputMode === "hsv"
            ? (() => {
                const hsv = parseHsv(hsvInput);
                return hsv ? hsvToRgb(hsv.h, hsv.s, hsv.v) : null;
              })()
            : (() => {
                const cmyk = parseCmyk(cmykInput);
                return cmyk ? cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k) : null;
              })();
    if (!rgb) return null;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    const hex = rgbToHex(rgb);
    const foreground = readableForeground(rgb);
    const complementary = rotateHue(rgb, 180);
    const analogousA = rotateHue(rgb, -30);
    const analogousB = rotateHue(rgb, 30);
    const triadicA = rotateHue(rgb, 120);
    const triadicB = rotateHue(rgb, -120);

    return {
      rgbObject: rgb,
      foregroundHex: rgbToHex(foreground),
      hex,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
      css: `${hex} / rgb(${rgb.r} ${rgb.g} ${rgb.b}) / hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`,
      cssVariable: `--${slugifyHex(hex)}: ${hex};`,
      tailwind: `'${slugifyHex(hex)}': '${hex}'`,
      complementary: rgbToHex(complementary),
      analogous: `${rgbToHex(analogousA)}  ${rgbToHex(analogousB)}`,
      triadic: `${rgbToHex(triadicA)}  ${rgbToHex(triadicB)}`,
    };
  }, [cmykInput, hexInput, hslInput, hsvInput, inputMode, rgbInput]);

  function updateFromPicker(value: string) {
    setHexInput(value.toUpperCase());
    setInputMode("hex");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {[
          { value: "hex", label: "HEX" },
          { value: "rgb", label: "RGB" },
          { value: "hsl", label: "HSL" },
          { value: "hsv", label: "HSV" },
          { value: "cmyk", label: "CMYK" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setInputMode(option.value as InputMode)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${inputMode === option.value ? "bg-ink text-white" : "border border-ink/10 bg-white text-ink hover:bg-canvas"}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <div className="space-y-4">
          {inputMode === "hex" ? (
            <label className="block space-y-2 text-sm font-semibold text-ink/80">
              HEX color
              <input value={hexInput} onChange={(event) => setHexInput(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-lg outline-none transition focus:border-accent" />
            </label>
          ) : null}
          {inputMode === "rgb" ? (
            <label className="block space-y-2 text-sm font-semibold text-ink/80">
              RGB channels
              <input value={rgbInput} onChange={(event) => setRgbInput(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-lg outline-none transition focus:border-accent" />
            </label>
          ) : null}
          {inputMode === "hsl" ? (
            <label className="block space-y-2 text-sm font-semibold text-ink/80">
              HSL channels
              <input value={hslInput} onChange={(event) => setHslInput(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-lg outline-none transition focus:border-accent" />
            </label>
          ) : null}
          {inputMode === "hsv" ? (
            <label className="block space-y-2 text-sm font-semibold text-ink/80">
              HSV channels
              <input value={hsvInput} onChange={(event) => setHsvInput(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-lg outline-none transition focus:border-accent" />
            </label>
          ) : null}
          {inputMode === "cmyk" ? (
            <label className="block space-y-2 text-sm font-semibold text-ink/80">
              CMYK channels
              <input value={cmykInput} onChange={(event) => setCmykInput(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-lg outline-none transition focus:border-accent" />
            </label>
          ) : null}

          <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4 text-sm text-ink/75">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Accepted formats</p>
            <p className="mt-2 font-mono">HEX: #EF6C3D or EF6C3D</p>
            <p className="mt-1 font-mono">RGB: 239, 108, 61</p>
            <p className="mt-1 font-mono">HSL: 17, 85%, 59%</p>
            <p className="mt-1 font-mono">HSV: 17, 74%, 94%</p>
            <p className="mt-1 font-mono">CMYK: 0%, 55%, 74%, 6%</p>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Preview</p>
            <input type="color" value={values?.hex ?? "#000000"} onChange={(event) => updateFromPicker(event.target.value)} className="h-10 w-14 cursor-pointer rounded-xl border border-ink/10 bg-white p-1" />
          </div>
          <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-ink/10">
            <div className="px-5 py-6" style={{ background: values?.hex ?? "transparent", color: values?.foregroundHex ?? "#111827" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Active color</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">{values?.hex ?? "Invalid color"}</h2>
              <p className="mt-2 text-sm leading-7">Use the preview to judge surface color, readable foreground text, and relationships with nearby tones.</p>
            </div>
            <div className="grid grid-cols-3">
              {[values?.complementary, values?.triadic?.split("  ")[0], values?.triadic?.split("  ")[1]].map((color, index) => (
                <div key={`${color ?? "empty"}-${index}`} className="h-14" style={{ background: color ?? "transparent" }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {!values ? (
        <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">Enter a valid HEX, RGB, or HSL color to convert it.</p>
      ) : (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            {[
              ["hex", values.hex],
              ["rgb", values.rgb],
              ["hsl", values.hsl],
              ["hsv", values.hsv],
              ["cmyk", values.cmyk],
              ["css", values.css],
              ["css variable", values.cssVariable],
              ["tailwind token", values.tailwind],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">{label}</p>
                  <CopyButton value={value} />
                </div>
                <code className="font-mono text-sm text-ink break-all">{value}</code>
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["Complementary", values.complementary],
              ["Analogous", values.analogous],
              ["Triadic", values.triadic],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">{label}</p>
                  <CopyButton value={value} />
                </div>
                <code className="font-mono text-sm text-ink break-all">{value}</code>
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Suggested foreground</p>
              <p className="mt-2 font-mono text-sm text-ink">{values.foregroundHex}</p>
            </div>
            <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">White contrast</p>
              <p className="mt-2 text-2xl font-bold text-ink">{contrastRatio({ r: 255, g: 255, b: 255 }, values.rgbObject).toFixed(2)}</p>
            </div>
            <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Dark contrast</p>
              <p className="mt-2 text-2xl font-bold text-ink">{contrastRatio({ r: 17, g: 24, b: 39 }, values.rgbObject).toFixed(2)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
