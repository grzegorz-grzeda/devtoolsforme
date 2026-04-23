import type { Metadata } from "next";
import { TLSKeyGeneratorTool } from "@/components/tls-key-generator-tool";
import { ToolShell } from "@/components/tool-shell";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata(
  "TLS Key Generator",
  "Generate RSA keypairs and symmetric secrets directly in the browser, with PEM, hex, and base64 export where useful.",
  "tls-key-generator"
);

export default function TLSKeyGeneratorPage() {
  return (
    <ToolShell slug="tls-key-generator" eyebrow="Security" title="TLS Key Generator" description="Generate RSA keypairs and symmetric secrets directly in the browser, with PEM, hex, and base64 export where useful.">
      <TLSKeyGeneratorTool />
    </ToolShell>
  );
}
