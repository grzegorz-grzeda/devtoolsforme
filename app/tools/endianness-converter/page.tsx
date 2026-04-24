import { EndiannessConverterTool } from "@/components/endianness-converter-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "endianness-converter",
  eyebrow: "Embedded",
  title: "Endianness Converter",
  description: "Flip byte order between big-endian and little-endian representations.",
  component: EndiannessConverterTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
