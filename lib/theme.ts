export const themeStorageKey = "dtfm-theme-preference";
export const themeEventName = "theme-preference-changed";
export const themeAttribute = "data-theme";
export const themePreferenceAttribute = "data-theme-preference";
export const darkMediaQuery = "(prefers-color-scheme: dark)";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export function isThemePreference(value: string | null | undefined): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function normalizeThemePreference(value: string | null | undefined): ThemePreference {
  return isThemePreference(value) ? value : "system";
}

export function resolveTheme(preference: ThemePreference, systemTheme: ResolvedTheme): ResolvedTheme {
  return preference === "system" ? systemTheme : preference;
}

export function resolveSystemTheme(prefersDark: boolean): ResolvedTheme {
  return prefersDark ? "dark" : "light";
}

export function getThemeBootstrapScript() {
  return `(() => {
    try {
      const storageKey = ${JSON.stringify(themeStorageKey)};
      const themeAttribute = ${JSON.stringify(themeAttribute)};
      const preferenceAttribute = ${JSON.stringify(themePreferenceAttribute)};
      const mediaQuery = ${JSON.stringify(darkMediaQuery)};
      const stored = window.localStorage.getItem(storageKey);
      const preference = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
      const systemTheme = window.matchMedia(mediaQuery).matches ? "dark" : "light";
      const resolved = preference === "system" ? systemTheme : preference;
      const root = document.documentElement;
      root.setAttribute(themeAttribute, resolved);
      root.setAttribute(preferenceAttribute, preference);
      root.style.colorScheme = resolved;
    } catch {
      document.documentElement.setAttribute(${JSON.stringify(themeAttribute)}, "light");
      document.documentElement.setAttribute(${JSON.stringify(themePreferenceAttribute)}, "system");
      document.documentElement.style.colorScheme = "light";
    }
  })();`;
}
