import { StructPaddingTool } from "@/components/struct-padding-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "struct-padding",
  eyebrow: "Embedded",
  title: "Struct Padding Visualizer",
  description: "Estimate offsets, alignment, and padding for common fixed-width fields in C structs.",
  component: StructPaddingTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
