import { MIMELookupTool } from "@/components/mime-lookup-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "mime-lookup",
  eyebrow: "Reference",
  title: "MIME Lookup",
  description: "Look up common file extensions and MIME types for headers, uploads, and assets.",
  component: MIMELookupTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
