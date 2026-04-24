import { LogicLevelConverterTool } from "@/components/logic-level-converter-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "logic-level-converter",
  eyebrow: "Embedded",
  title: "Logic Level ADC DAC Converter",
  description: "Translate voltages into ADC counts and back using your selected reference.",
  component: LogicLevelConverterTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
