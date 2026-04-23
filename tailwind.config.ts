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
        canvas: "#f7f3eb",
        ink: "#15241d",
        accent: "#ef6c3d",
        accentDark: "#b94821",
        sage: "#dce5d3",
        lake: "#1f5460",
        card: "rgba(255, 252, 247, 0.8)",
      },
      boxShadow: {
        soft: "0 24px 60px rgba(21, 36, 29, 0.12)",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Avenir Next", "Segoe UI", "sans-serif"],
        mono: ["IBM Plex Mono", "Menlo", "monospace"],
      },
      backgroundImage: {
        "hero-grid": "linear-gradient(rgba(21,36,29,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(21,36,29,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
