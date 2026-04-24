import { CertificateInspectorTool } from "@/components/certificate-inspector-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "certificate-inspector",
  eyebrow: "Security",
  title: "Certificate Inspector",
  description: "Parse a PEM certificate and inspect subject, issuer, validity, SANs, key usage, and fingerprint values.",
  component: CertificateInspectorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
