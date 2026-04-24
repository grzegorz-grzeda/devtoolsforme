import { PllCalculatorTool } from "@/components/pll-calculator-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "pll-calculator",
  eyebrow: "Embedded",
  title: "PLL Calculator",
  description: "Estimate VCO input, VCO output, final PLL frequency, and output period while exploring divider chains.",
  component: PllCalculatorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
