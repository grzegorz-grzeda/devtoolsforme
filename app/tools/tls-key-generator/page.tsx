import { TLSKeyGeneratorTool } from "@/components/tls-key-generator-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "tls-key-generator",
  eyebrow: "Security",
  title: "TLS Key Generator",
  description: "Generate RSA keypairs and symmetric secrets directly in the browser, with PEM, hex, and base64 export where useful.",
  component: TLSKeyGeneratorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
