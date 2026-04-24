import { JSONDiffTool } from "@/components/json-diff-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "json-diff",
  eyebrow: "Data",
  title: "JSON Diff",
  description: "Compare two JSON documents side by side and quickly spot structural or value changes.",
  component: JSONDiffTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
