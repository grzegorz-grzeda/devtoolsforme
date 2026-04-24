import { JSONToTypeScriptTool } from "@/components/json-to-typescript-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "json-to-typescript",
  eyebrow: "Data",
  title: "JSON to TypeScript",
  description: "Turn sample JSON into a fast starter TypeScript type definition.",
  component: JSONToTypeScriptTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
