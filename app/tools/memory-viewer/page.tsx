import { MemoryViewerTool } from "@/components/memory-viewer-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "memory-viewer",
  eyebrow: "Embedded",
  title: "Memory Viewer",
  description: "Inspect raw hex bytes as offsets, grouped hex, and printable ASCII.",
  component: MemoryViewerTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
