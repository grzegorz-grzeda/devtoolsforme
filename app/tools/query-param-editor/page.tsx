import { QueryParamEditorTool } from "@/components/query-param-editor-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "query-param-editor",
  eyebrow: "Encoding",
  title: "Query Param Editor",
  description: "Build and edit URLs with query parameters without hand-editing long strings.",
  component: QueryParamEditorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
