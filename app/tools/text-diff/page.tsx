import { TextDiffTool } from "@/components/text-diff-tool";
import { ToolShell } from "@/components/tool-shell";

export default function TextDiffPage() {
  return (
    <ToolShell
      eyebrow="Text"
      title="Text Diff"
      description="Compare two text blocks line by line so changed configuration, snippets, and notes stand out immediately."
    >
      <TextDiffTool />
    </ToolShell>
  );
}
