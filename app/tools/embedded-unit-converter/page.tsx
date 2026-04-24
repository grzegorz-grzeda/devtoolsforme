import { EmbeddedUnitConverterTool } from "@/components/embedded-unit-converter-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "embedded-unit-converter",
  eyebrow: "Embedded",
  title: "Embedded Unit Converter",
  description: "Convert between Hz, kHz, MHz and ns, us, ms for common firmware calculations.",
  component: EmbeddedUnitConverterTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
