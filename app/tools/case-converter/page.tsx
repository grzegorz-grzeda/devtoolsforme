import { CaseConverterTool } from "@/components/case-converter-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "case-converter",
  eyebrow: "Text",
  title: "Case Converter",
  description: "Switch identifiers and phrases between common casing styles when writing code, docs, or content.",
  component: CaseConverterTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
