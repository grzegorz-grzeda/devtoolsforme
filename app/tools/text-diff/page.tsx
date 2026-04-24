import { TextDiffTool } from "@/components/text-diff-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "text-diff",
  eyebrow: "Text",
  title: "Text Diff",
  description: "Compare two text blocks line by line so changed configuration, snippets, and notes stand out immediately.",
  component: TextDiffTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
