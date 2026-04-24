import { HTMLEntitiesTool } from "@/components/html-entities-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "html-entities",
  eyebrow: "Encoding",
  title: "HTML Entity Tool",
  description: "Encode raw markup safely or decode escaped entities back into readable HTML and text.",
  component: HTMLEntitiesTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
