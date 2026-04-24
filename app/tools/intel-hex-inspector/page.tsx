import { IntelHexInspectorTool } from "@/components/intel-hex-inspector-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "intel-hex-inspector",
  eyebrow: "Embedded",
  title: "Intel HEX Inspector",
  description: "Parse Intel HEX firmware records, inspect absolute addresses, and catch checksum issues before programming a target.",
  component: IntelHexInspectorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
