import { Base64Tool } from "@/components/base64-tool";
import { ToolShell } from "@/components/tool-shell";

export default function Base64Page() {
  return (
    <ToolShell
      eyebrow="Encoding"
      title="Base64 Encoder"
      description="Convert between plain text and Base64 directly in the browser with UTF-8-safe encoding and decoding."
    >
      <Base64Tool />
    </ToolShell>
  );
}
