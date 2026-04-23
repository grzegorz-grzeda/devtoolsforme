import type { Metadata } from "next";
import { RegisterFieldBuilderTool } from "@/components/register-field-builder-tool";
import { ToolShell } from "@/components/tool-shell";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata(
  "Register Field Builder",
  "Pack and extract multi-bit register fields by offset and width without redoing mask math by hand.",
  "register-field-builder"
);

export default function RegisterFieldBuilderPage() {
  return (
    <ToolShell
      slug="register-field-builder"
      eyebrow="Embedded"
      title="Register Field Builder"
      description="Pack and extract multi-bit register fields by offset and width without redoing mask math by hand."
    >
      <RegisterFieldBuilderTool />
    </ToolShell>
  );
}
