import type { Metadata } from "next";
import { BitmaskCalculatorTool } from "@/components/bitmask-calculator-tool";
import { ToolShell } from "@/components/tool-shell";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata(
  "Bitmask Calculator",
  "Work with MCU registers and masks by setting, clearing, toggling, and inspecting bits across 8, 16, and 32-bit widths.",
  "bitmask-calculator"
);

export default function BitmaskCalculatorPage() {
  return (
    <ToolShell
      slug="bitmask-calculator"
      eyebrow="Embedded"
      title="Bitmask Calculator"
      description="Work with MCU registers and masks by setting, clearing, toggling, and inspecting bits across 8, 16, and 32-bit widths."
    >
      <BitmaskCalculatorTool />
    </ToolShell>
  );
}
