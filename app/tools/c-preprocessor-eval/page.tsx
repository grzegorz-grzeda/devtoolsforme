import { CPreprocessorEvalTool } from "@/components/c-preprocessor-eval-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "c-preprocessor-eval",
  eyebrow: "Embedded",
  title: "C Preprocessor Expression Evaluator",
  description: "Evaluate macro-style numeric expressions with shifts, masks, and arithmetic.",
  component: CPreprocessorEvalTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
