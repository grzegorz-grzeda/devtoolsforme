import { HexCalculatorTool } from "@/components/hex-calculator-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "hex-calculator",
  eyebrow: "Number Systems",
  title: "Hex Calculator",
  description: "Translate values across decimal, hexadecimal, binary, and octal so you can inspect and compare formats quickly.",
  component: HexCalculatorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
