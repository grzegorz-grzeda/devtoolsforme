import { ASCIIHexByteTool } from "@/components/ascii-hex-byte-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "ascii-hex-byte",
  eyebrow: "Embedded",
  title: "ASCII Hex Byte Converter",
  description: "Convert strings into byte values, hex bytes, and C-friendly representations.",
  component: ASCIIHexByteTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
