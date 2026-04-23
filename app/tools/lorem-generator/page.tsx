import { LoremGeneratorTool } from "@/components/lorem-generator-tool";
import { ToolShell } from "@/components/tool-shell";

export default function LoremGeneratorPage() {
  return (
    <ToolShell
      eyebrow="Content"
      title="Lorem Generator"
      description="Create placeholder words, sentences, or paragraphs for mocks, demos, and in-progress layouts."
    >
      <LoremGeneratorTool />
    </ToolShell>
  );
}
