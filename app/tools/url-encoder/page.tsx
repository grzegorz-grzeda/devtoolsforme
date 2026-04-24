import { URLEncoderTool } from "@/components/url-encoder-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "url-encoder",
  eyebrow: "Encoding",
  title: "URL Encoder",
  description: "Encode and decode URL-safe text quickly so query strings, paths, and copied values stay intact.",
  component: URLEncoderTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
