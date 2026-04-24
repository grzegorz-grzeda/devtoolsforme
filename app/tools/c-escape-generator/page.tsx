import { CEscapeGeneratorTool } from "@/components/c-escape-generator-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "c-escape-generator",
  eyebrow: "Embedded",
  title: "C Escape Generator",
  description: "Turn text into escaped C string literals or explicit hex escape sequences.",
  component: CEscapeGeneratorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
