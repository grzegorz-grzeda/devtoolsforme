import { ToolShell } from "@/components/tool-shell";
import { URLEncoderTool } from "@/components/url-encoder-tool";

export default function URLEncoderPage() {
  return (
    <ToolShell
      eyebrow="Encoding"
      title="URL Encoder"
      description="Encode and decode URL-safe text quickly so query strings, paths, and copied values stay intact."
    >
      <URLEncoderTool />
    </ToolShell>
  );
}
