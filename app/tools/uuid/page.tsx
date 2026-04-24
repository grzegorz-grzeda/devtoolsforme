import { UUIDTool } from "@/components/uuid-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "uuid",
  eyebrow: "Identity",
  title: "UUID Generator",
  description: "Generate UUID v1, v3, v4, v5, and v7 values, with timestamp or namespace inputs shown when a version needs them.",
  component: UUIDTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
