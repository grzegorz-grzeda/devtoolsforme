import { JWTDecoderTool } from "@/components/jwt-decoder-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "jwt-decoder",
  eyebrow: "Security",
  title: "JWT Decoder",
  description: "Inspect token headers and payload claims locally, with readable time fields and no network roundtrip.",
  component: JWTDecoderTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
