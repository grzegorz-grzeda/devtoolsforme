import type { Metadata } from "next";
import { SRecordInspectorTool } from "@/components/s-record-inspector-tool";
import { ToolShell } from "@/components/tool-shell";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata(
  "S-Record Inspector",
  "Decode Motorola S-record files, verify checksums, and inspect addresses and data payloads quickly.",
  "s-record-inspector"
);

export default function SRecordInspectorPage() {
  return (
    <ToolShell
      slug="s-record-inspector"
      eyebrow="Embedded"
      title="S-Record Inspector"
      description="Decode Motorola S-record files, verify checksums, and inspect addresses and data payloads quickly."
    >
      <SRecordInspectorTool />
    </ToolShell>
  );
}
