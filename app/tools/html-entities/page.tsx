import { HTMLEntitiesTool } from "@/components/html-entities-tool";
import { ToolShell } from "@/components/tool-shell";

export default function HTMLEntitiesPage() {
  return (
    <ToolShell
      eyebrow="Encoding"
      title="HTML Entity Tool"
      description="Encode raw markup safely or decode escaped entities back into readable HTML and text."
    >
      <HTMLEntitiesTool />
    </ToolShell>
  );
}
