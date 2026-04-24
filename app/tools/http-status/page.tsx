import { HTTPStatusTool } from "@/components/http-status-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "http-status",
  eyebrow: "Reference",
  title: "HTTP Status Lookup",
  description: "Search all standard HTTP response codes with practical examples and troubleshooting guidance.",
  component: HTTPStatusTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
