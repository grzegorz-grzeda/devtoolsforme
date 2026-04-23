import type { Metadata } from "next";
import { DmaThroughputCalculatorTool } from "@/components/dma-throughput-calculator-tool";
import { ToolShell } from "@/components/tool-shell";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata(
  "DMA Throughput Calculator",
  "Estimate burst count, cycle cost, transfer time, and throughput for DMA-style memory moves.",
  "dma-throughput-calculator"
);

export default function DmaThroughputCalculatorPage() {
  return (
    <ToolShell
      slug="dma-throughput-calculator"
      eyebrow="Embedded"
      title="DMA Throughput Calculator"
      description="Estimate burst count, cycle cost, transfer time, and throughput for DMA-style memory moves."
    >
      <DmaThroughputCalculatorTool />
    </ToolShell>
  );
}
