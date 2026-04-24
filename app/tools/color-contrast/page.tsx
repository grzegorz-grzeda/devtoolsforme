import { ColorContrastTool } from "@/components/color-contrast-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "color-contrast",
  eyebrow: "Design",
  title: "Color Contrast Checker",
  description: "Check foreground and background combinations against common WCAG contrast thresholds.",
  component: ColorContrastTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
