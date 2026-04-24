import { RegisterFieldBuilderTool } from "@/components/register-field-builder-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "register-field-builder",
  eyebrow: "Embedded",
  title: "Register Field Builder",
  description: "Pack and extract multi-bit register fields by offset and width without redoing mask math by hand.",
  component: RegisterFieldBuilderTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
