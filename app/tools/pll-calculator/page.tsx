import type { Metadata } from "next";
import { PllCalculatorTool } from "@/components/pll-calculator-tool";
import { ToolShell } from "@/components/tool-shell";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata(
  "PLL Calculator",
  "Estimate VCO input, VCO output, final PLL frequency, and output period while exploring divider chains.",
  "pll-calculator"
);

export default function PllCalculatorPage() {
  return (
    <ToolShell
      slug="pll-calculator"
      eyebrow="Embedded"
      title="PLL Calculator"
      description="Estimate VCO input, VCO output, final PLL frequency, and output period while exploring divider chains."
    >
      <PllCalculatorTool />
    </ToolShell>
  );
}
