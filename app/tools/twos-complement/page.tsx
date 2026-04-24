import { TwosComplementTool } from "@/components/twos-complement-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "twos-complement",
  eyebrow: "Embedded",
  title: "Two's Complement Converter",
  description: "Interpret integer values as signed, unsigned, binary, and hex across common widths.",
  component: TwosComplementTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
