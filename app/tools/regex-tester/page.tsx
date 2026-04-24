import { RegexTesterTool } from "@/components/regex-tester-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "regex-tester",
  eyebrow: "Text",
  title: "Regex Tester",
  description: "Try patterns, adjust flags, and inspect match positions against real sample text while you refine expressions.",
  component: RegexTesterTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
