import { HashGeneratorTool } from "@/components/hash-generator-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "hash-generator",
  eyebrow: "Identity",
  title: "Hash Generator",
  description: "Generate SHA-family digests locally in the browser for quick integrity checks and comparisons.",
  component: HashGeneratorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
