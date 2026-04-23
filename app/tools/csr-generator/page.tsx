import type { Metadata } from "next";
import { CSRGeneratorTool } from "@/components/csr-generator-tool";
import { ToolShell } from "@/components/tool-shell";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata(
  "CSR Generator",
  "Generate an RSA private key and certificate signing request with subject fields and subject alternative names.",
  "csr-generator"
);

export default function CSRGeneratorPage() {
  return (
    <ToolShell slug="csr-generator" eyebrow="Security" title="CSR Generator" description="Generate an RSA private key and certificate signing request with subject fields and subject alternative names.">
      <CSRGeneratorTool />
    </ToolShell>
  );
}
