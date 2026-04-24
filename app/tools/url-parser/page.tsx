import { URLParserTool } from "@/components/url-parser-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "url-parser",
  eyebrow: "Encoding",
  title: "URL Parser",
  description: "Break down a URL into protocol, host, path, parameters, and fragment parts instantly.",
  component: URLParserTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
