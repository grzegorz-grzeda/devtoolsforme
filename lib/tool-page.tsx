import type { Metadata } from "next";
import type { ComponentType, ReactElement } from "react";
import { ToolShell } from "../components/tool-shell";
import { createToolMetadata } from "./metadata";

type ToolPageConfig = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  component: ComponentType;
};

export function createToolPage({ slug, eyebrow, title, description, component: ToolComponent }: ToolPageConfig): {
  metadata: Metadata;
  Page: () => ReactElement;
} {
  return {
    metadata: createToolMetadata(title, description, slug),
    Page() {
      return (
        <ToolShell slug={slug} eyebrow={eyebrow} title={title} description={description}>
          <ToolComponent />
        </ToolShell>
      );
    },
  };
}
