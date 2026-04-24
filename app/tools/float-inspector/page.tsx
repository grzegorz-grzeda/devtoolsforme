import { FloatInspectorTool } from "@/components/float-inspector-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "float-inspector",
  eyebrow: "Embedded",
  title: "IEEE-754 Float Inspector",
  description: "Inspect a float as hex plus its sign, exponent, and mantissa fields.",
  component: FloatInspectorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
