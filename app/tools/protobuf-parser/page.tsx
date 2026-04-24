import { ProtobufParserTool } from "@/components/protobuf-parser-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "protobuf-parser",
  eyebrow: "Data",
  title: "Protobuf Parser",
  description: "Validate a provided .proto schema, parse protobuf payloads, and move between JSON, hex, and Base64 representations.",
  component: ProtobufParserTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
