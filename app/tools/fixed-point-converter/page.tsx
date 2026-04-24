import { FixedPointConverterTool } from "@/components/fixed-point-converter-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "fixed-point-converter",
  eyebrow: "Embedded",
  title: "Fixed-Point Converter",
  description: "Convert decimal values into scaled fixed-point integers using configurable Q formats.",
  component: FixedPointConverterTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
