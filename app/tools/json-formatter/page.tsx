import { JSONFormatterTool } from "@/components/json-formatter-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "json-formatter",
  eyebrow: "Data",
  title: "JSON Formatter",
  description: "Validate JSON, pretty-print it for reading, or minify it for transport without leaving the page.",
  component: JSONFormatterTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
