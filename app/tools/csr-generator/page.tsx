import { CSRGeneratorTool } from "@/components/csr-generator-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "csr-generator",
  eyebrow: "Security",
  title: "CSR Generator",
  description: "Generate an RSA private key and certificate signing request with subject fields and subject alternative names.",
  component: CSRGeneratorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
