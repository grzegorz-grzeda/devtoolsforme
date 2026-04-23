import { CaseConverterTool } from "@/components/case-converter-tool";
import { ToolShell } from "@/components/tool-shell";

export default function CaseConverterPage() {
  return (
    <ToolShell
      eyebrow="Text"
      title="Case Converter"
      description="Switch identifiers and phrases between common casing styles when writing code, docs, or content."
    >
      <CaseConverterTool />
    </ToolShell>
  );
}
