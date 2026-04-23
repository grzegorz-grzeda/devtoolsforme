import { TimestampConverterTool } from "@/components/timestamp-converter-tool";
import { ToolShell } from "@/components/tool-shell";

export default function TimestampConverterPage() {
  return (
    <ToolShell
      eyebrow="Time"
      title="Timestamp Converter"
      description="Translate timestamps into human-readable dates and turn dates back into Unix seconds or milliseconds."
    >
      <TimestampConverterTool />
    </ToolShell>
  );
}
