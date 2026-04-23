import { describe, expect, it } from "vitest";
import {
  darkMediaQuery,
  getThemeBootstrapScript,
  isThemePreference,
  normalizeThemePreference,
  resolveSystemTheme,
  resolveTheme,
  themeAttribute,
  themePreferenceAttribute,
  themeStorageKey,
} from "../../lib/theme";

describe("theme helpers", () => {
  it("detects supported preferences", () => {
    expect(isThemePreference("light")).toBe(true);
    expect(isThemePreference("dark")).toBe(true);
    expect(isThemePreference("system")).toBe(true);
    expect(isThemePreference("auto")).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });

  it("defaults unknown preferences to system", () => {
    expect(normalizeThemePreference(null)).toBe("system");
    expect(normalizeThemePreference("custom")).toBe("system");
  });

  it("keeps supported preferences", () => {
    expect(normalizeThemePreference("light")).toBe("light");
    expect(normalizeThemePreference("dark")).toBe("dark");
    expect(normalizeThemePreference("system")).toBe("system");
  });

  it("resolves system theme from media state", () => {
    expect(resolveSystemTheme(true)).toBe("dark");
    expect(resolveSystemTheme(false)).toBe("light");
  });

  it("resolves the final theme from preference and system state", () => {
    expect(resolveTheme("light", "dark")).toBe("light");
    expect(resolveTheme("dark", "light")).toBe("dark");
    expect(resolveTheme("system", "dark")).toBe("dark");
    expect(resolveTheme("system", "light")).toBe("light");
  });

  it("builds a bootstrap script with runtime and fallback theme handling", () => {
    const script = getThemeBootstrapScript();

    expect(script).toContain(`const storageKey = ${JSON.stringify(themeStorageKey)};`);
    expect(script).toContain(`const themeAttribute = ${JSON.stringify(themeAttribute)};`);
    expect(script).toContain(`const preferenceAttribute = ${JSON.stringify(themePreferenceAttribute)};`);
    expect(script).toContain(`const mediaQuery = ${JSON.stringify(darkMediaQuery)};`);
    expect(script).toContain("const preference = stored === \"light\" || stored === \"dark\" || stored === \"system\" ? stored : \"system\";");
    expect(script).toContain("root.setAttribute(themeAttribute, resolved);");
    expect(script).toContain("root.setAttribute(preferenceAttribute, preference);");
    expect(script).toContain("root.style.colorScheme = resolved;");
    expect(script).toContain(`document.documentElement.setAttribute(${JSON.stringify(themeAttribute)}, "light");`);
    expect(script).toContain(`document.documentElement.setAttribute(${JSON.stringify(themePreferenceAttribute)}, "system");`);
    expect(script).toContain("document.documentElement.style.colorScheme = \"light\";");
  });
});
