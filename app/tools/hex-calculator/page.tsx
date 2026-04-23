import { HexCalculatorTool } from "@/components/hex-calculator-tool";
import { ToolShell } from "@/components/tool-shell";

export default function HexCalculatorPage() {
  return (
    <ToolShell
      eyebrow="Number Systems"
      title="Hex Calculator"
      description="Translate values across decimal, hexadecimal, binary, and octal so you can inspect and compare formats quickly."
    >
      <HexCalculatorTool />
    </ToolShell>
  );
}
