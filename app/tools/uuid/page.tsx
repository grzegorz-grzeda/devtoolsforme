import type { Metadata } from "next";
import { ToolShell } from "@/components/tool-shell";
import { UUIDTool } from "@/components/uuid-tool";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata(
  "UUID Generator",
  "Generate UUID v1, v3, v4, v5, and v7 values, with timestamp or namespace inputs shown when a version needs them.",
  "uuid"
);

export default function UUIDPage() {
  return (
    <ToolShell
      slug="uuid"
      eyebrow="Identity"
      title="UUID Generator"
      description="Generate UUID v1, v3, v4, v5, and v7 values, with timestamp or namespace inputs shown when a version needs them."
    >
      <UUIDTool />
    </ToolShell>
  );
}
