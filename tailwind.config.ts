import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        ink: "rgb(var(--color-text) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        accentDark: "rgb(var(--color-accent-strong) / <alpha-value>)",
        sage: "rgb(var(--color-muted-surface) / <alpha-value>)",
        lake: "rgb(var(--color-muted-text) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
      },
      boxShadow: {
        soft: "0 24px 60px rgb(var(--color-shadow) / 0.22)",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Avenir Next", "Segoe UI", "sans-serif"],
        mono: ["IBM Plex Mono", "Menlo", "monospace"],
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgb(var(--color-grid) / 0.22) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-grid) / 0.22) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
