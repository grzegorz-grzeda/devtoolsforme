import { UARTBaudCalculatorTool } from "@/components/uart-baud-calculator-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "uart-baud-calculator",
  eyebrow: "Embedded",
  title: "UART Baud Calculator",
  description: "Estimate baud register divisors, actual baud rates, and error percentages.",
  component: UARTBaudCalculatorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
