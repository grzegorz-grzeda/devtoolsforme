import { SRecordInspectorTool } from "@/components/s-record-inspector-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "s-record-inspector",
  eyebrow: "Embedded",
  title: "S-Record Inspector",
  description: "Decode Motorola S-record files, verify checksums, and inspect addresses and data payloads quickly.",
  component: SRecordInspectorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
