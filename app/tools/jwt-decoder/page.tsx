import { JWTDecoderTool } from "@/components/jwt-decoder-tool";
import { ToolShell } from "@/components/tool-shell";

export default function JWTDecoderPage() {
  return (
    <ToolShell
      eyebrow="Security"
      title="JWT Decoder"
      description="Inspect token headers and payload claims locally, with readable time fields and no network roundtrip."
    >
      <JWTDecoderTool />
    </ToolShell>
  );
}
