"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  darkMediaQuery,
  normalizeThemePreference,
  resolveSystemTheme,
  resolveTheme,
  themeAttribute,
  themeEventName,
  themePreferenceAttribute,
  themeStorageKey,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(preference: ThemePreference, resolvedTheme: ResolvedTheme) {
  const root = document.documentElement;
  root.setAttribute(themeAttribute, resolvedTheme);
  root.setAttribute(themePreferenceAttribute, preference);
  root.style.colorScheme = resolvedTheme;
}

function readStoredPreference() {
  return normalizeThemePreference(window.localStorage.getItem(themeStorageKey));
}

function syncTheme(preference: ThemePreference, prefersDark: boolean) {
  const resolvedTheme = resolveTheme(preference, resolveSystemTheme(prefersDark));
  applyTheme(preference, resolvedTheme);
  return resolvedTheme;
}

export function ThemeController({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const media = window.matchMedia(darkMediaQuery);

    const refresh = () => {
      const nextPreference = readStoredPreference();
      setPreferenceState(nextPreference);
      setResolvedTheme(syncTheme(nextPreference, media.matches));
    };

    const handleMediaChange = () => refresh();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === null || event.key === themeStorageKey) {
        refresh();
      }
    };

    refresh();

    media.addEventListener("change", handleMediaChange);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(themeEventName, refresh);

    return () => {
      media.removeEventListener("change", handleMediaChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(themeEventName, refresh);
    };
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolvedTheme,
      setPreference: (nextPreference) => {
        window.localStorage.setItem(themeStorageKey, nextPreference);
        window.dispatchEvent(new Event(themeEventName));
      },
    }),
    [preference, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("Theme components must be used within ThemeController.");
  }

  return context;
}

const options: Array<{ value: ThemePreference; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div className="theme-toggle-shell" role="radiogroup" aria-label="Color theme">
      {options.map((option) => {
        const active = option.value === preference;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            data-state={active ? "active" : "inactive"}
            className="theme-toggle-button"
            onClick={() => setPreference(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
