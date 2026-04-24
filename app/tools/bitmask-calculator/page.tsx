import { BitmaskCalculatorTool } from "@/components/bitmask-calculator-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "bitmask-calculator",
  eyebrow: "Embedded",
  title: "Bitmask Calculator",
  description: "Work with MCU registers and masks by setting, clearing, toggling, and inspecting bits across 8, 16, and 32-bit widths.",
  component: BitmaskCalculatorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
