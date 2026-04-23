import type { Metadata } from "next";
import { CertificateInspectorTool } from "@/components/certificate-inspector-tool";
import { ToolShell } from "@/components/tool-shell";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata(
  "Certificate Inspector",
  "Parse a PEM certificate and inspect subject, issuer, validity, SANs, key usage, and fingerprint values.",
  "certificate-inspector"
);

export default function CertificateInspectorPage() {
  return (
    <ToolShell slug="certificate-inspector" eyebrow="Security" title="Certificate Inspector" description="Parse a PEM certificate and inspect subject, issuer, validity, SANs, key usage, and fingerprint values.">
      <CertificateInspectorTool />
    </ToolShell>
  );
}
