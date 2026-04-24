import { CalculatorTool } from "@/components/calculator-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "calculator",
  eyebrow: "Math",
  title: "Calculator",
  description: "Handle quick arithmetic without opening a heavier app, with editable expressions and one-tap result copying.",
  component: CalculatorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
