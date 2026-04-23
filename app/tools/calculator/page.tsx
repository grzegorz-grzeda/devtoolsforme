import { CalculatorTool } from "@/components/calculator-tool";
import { ToolShell } from "@/components/tool-shell";

export default function CalculatorPage() {
  return (
    <ToolShell
      eyebrow="Math"
      title="Calculator"
      description="Handle quick arithmetic without opening a heavier app, with editable expressions and one-tap result copying."
    >
      <CalculatorTool />
    </ToolShell>
  );
}
