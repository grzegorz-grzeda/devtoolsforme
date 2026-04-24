import { LoremGeneratorTool } from "@/components/lorem-generator-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "lorem-generator",
  eyebrow: "Content",
  title: "Lorem Generator",
  description: "Create placeholder words, sentences, or paragraphs for mocks, demos, and in-progress layouts.",
  component: LoremGeneratorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
