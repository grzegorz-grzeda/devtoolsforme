import { Base64Tool } from "@/components/base64-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "base64",
  eyebrow: "Encoding",
  title: "Base64 Encoder",
  description: "Convert between plain text and Base64 directly in the browser with UTF-8-safe encoding and decoding.",
  component: Base64Tool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
