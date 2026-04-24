import { DmaThroughputCalculatorTool } from "@/components/dma-throughput-calculator-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "dma-throughput-calculator",
  eyebrow: "Embedded",
  title: "DMA Throughput Calculator",
  description: "Estimate burst count, cycle cost, transfer time, and throughput for DMA-style memory moves.",
  component: DmaThroughputCalculatorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
