import { describe, expect, it } from "vitest";
import { normalizeThemePreference, resolveSystemTheme, resolveTheme } from "../../lib/theme";

describe("theme helpers", () => {
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
});
