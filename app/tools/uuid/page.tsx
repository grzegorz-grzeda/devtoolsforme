import { ToolShell } from "@/components/tool-shell";
import { UUIDTool } from "@/components/uuid-tool";

export default function UUIDPage() {
  return (
    <ToolShell
      eyebrow="Identity"
      title="UUID Generator"
      description="Generate RFC 4122 version 4 UUIDs in batches, then copy single values or the whole set for your next task."
    >
      <UUIDTool />
    </ToolShell>
  );
}
