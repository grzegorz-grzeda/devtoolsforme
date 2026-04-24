import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createToolMetadata } from "../../lib/metadata";
import { tools } from "../../lib/tools";

describe("createToolMetadata", () => {
  it("builds homepage metadata when no slug is provided", () => {
    const metadata = createToolMetadata("Home", "Landing page copy");

    expect(metadata).toMatchObject({
      title: "Home | devtoolsforme",
      description: "Landing page copy",
      alternates: {
        canonical: "/",
      },
      openGraph: {
        title: "Home | devtoolsforme",
        description: "Landing page copy",
        url: "https://devtoolsforme.com/",
        siteName: "devtoolsforme",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Home | devtoolsforme",
        description: "Landing page copy",
      },
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "/og/site-home.svg",
        width: 1200,
        height: 630,
        alt: "Home preview",
      },
    ]);
    expect(metadata.twitter?.images).toEqual(["/og/site-home.svg"]);
  });

  it("builds tool-specific metadata when a slug is provided", () => {
    const metadata = createToolMetadata("JSON Formatter", "Format and validate JSON", "json-formatter");

    expect(metadata).toMatchObject({
      title: "JSON Formatter | devtoolsforme",
      description: "Format and validate JSON",
      alternates: {
        canonical: "/tools/json-formatter",
      },
      openGraph: {
        url: "https://devtoolsforme.com/tools/json-formatter",
      },
      twitter: {
        images: ["/og/json-formatter.svg"],
      },
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "/og/json-formatter.svg",
        width: 1200,
        height: 630,
        alt: "JSON Formatter preview",
      },
    ]);
  });
});

describe("tools catalog", () => {
  it("defines unique slugs and names", () => {
    const slugs = tools.map((tool) => tool.slug);
    const names = tools.map((tool) => tool.name);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it("keeps required content populated for every tool", () => {
    for (const tool of tools) {
      expect(tool.slug).toMatch(/^[a-z0-9-]+$/);
      expect(tool.name).not.toHaveLength(0);
      expect(tool.description.length).toBeGreaterThan(20);
      expect(tool.badge).not.toHaveLength(0);
      expect(tool.category).not.toHaveLength(0);
    }
  });

  it("has a page for every tool slug", () => {
    for (const tool of tools) {
      const pagePath = path.join(process.cwd(), "app", "tools", tool.slug, "page.tsx");
      expect(existsSync(pagePath), `${tool.slug} should map to ${pagePath}`).toBe(true);
    }
  });

  it("keeps tool route modules on the shared page helper", () => {
    for (const tool of tools) {
      const pagePath = path.join(process.cwd(), "app", "tools", tool.slug, "page.tsx");
      const pageSource = readFileSync(pagePath, "utf8");

      expect(pageSource).toContain('import { createToolPage } from "@/lib/tool-page";');
      expect(pageSource).toContain("const toolPage = createToolPage({");
      expect(pageSource).toContain("export const metadata = toolPage.metadata;");
      expect(pageSource).toContain("export default toolPage.Page;");
    }
  });
});
