import { HashGeneratorTool } from "@/components/hash-generator-tool";
import { ToolShell } from "@/components/tool-shell";

export default function HashGeneratorPage() {
  return (
    <ToolShell
      eyebrow="Identity"
      title="Hash Generator"
      description="Generate SHA-family digests locally in the browser for quick integrity checks and comparisons."
    >
      <HashGeneratorTool />
    </ToolShell>
  );
}
