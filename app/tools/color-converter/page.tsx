import { ColorConverterTool } from "@/components/color-converter-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "color-converter",
  eyebrow: "Design",
  title: "Color Converter",
  description: "Convert HEX, RGB, and HSL colors into richer design-ready formats with live previews and palettes.",
  component: ColorConverterTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
