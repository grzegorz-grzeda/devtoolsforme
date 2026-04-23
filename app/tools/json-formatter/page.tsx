import { JSONFormatterTool } from "@/components/json-formatter-tool";
import { ToolShell } from "@/components/tool-shell";

export default function JSONFormatterPage() {
  return (
    <ToolShell
      eyebrow="Data"
      title="JSON Formatter"
      description="Validate JSON, pretty-print it for reading, or minify it for transport without leaving the page."
    >
      <JSONFormatterTool />
    </ToolShell>
  );
}
