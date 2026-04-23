import type { Metadata } from "next";
import { IntelHexInspectorTool } from "@/components/intel-hex-inspector-tool";
import { ToolShell } from "@/components/tool-shell";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata(
  "Intel HEX Inspector",
  "Parse Intel HEX firmware records, inspect absolute addresses, and catch checksum issues before programming a target.",
  "intel-hex-inspector"
);

export default function IntelHexInspectorPage() {
  return (
    <ToolShell
      slug="intel-hex-inspector"
      eyebrow="Embedded"
      title="Intel HEX Inspector"
      description="Parse Intel HEX firmware records, inspect absolute addresses, and catch checksum issues before programming a target."
    >
      <IntelHexInspectorTool />
    </ToolShell>
  );
}
