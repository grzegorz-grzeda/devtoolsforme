import { IntegerRangesTool } from "@/components/integer-ranges-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "integer-ranges",
  eyebrow: "Embedded",
  title: "Integer Type Ranges",
  description: "Reference exact-width integer ranges plus stdint.h limit macros and stddef.h size and pointer-difference types.",
  component: IntegerRangesTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
