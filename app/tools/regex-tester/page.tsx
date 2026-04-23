import { RegexTesterTool } from "@/components/regex-tester-tool";
import { ToolShell } from "@/components/tool-shell";

export default function RegexTesterPage() {
  return (
    <ToolShell
      eyebrow="Text"
      title="Regex Tester"
      description="Try patterns, adjust flags, and inspect match positions against real sample text while you refine expressions."
    >
      <RegexTesterTool />
    </ToolShell>
  );
}
