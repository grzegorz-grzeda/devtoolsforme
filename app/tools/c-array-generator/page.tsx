import { CArrayGeneratorTool } from "@/components/c-array-generator-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "c-array-generator",
  eyebrow: "Embedded",
  title: "C Array Generator",
  description: "Generate C byte arrays from text or turn uploaded images into SSD1309-ready monochrome bitmaps.",
  component: CArrayGeneratorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
