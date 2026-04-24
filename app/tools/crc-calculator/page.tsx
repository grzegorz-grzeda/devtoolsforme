import { CRCCalculatorTool } from "@/components/crc-calculator-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "crc-calculator",
  eyebrow: "Embedded",
  title: "CRC Calculator",
  description: "Calculate CRC-8, CRC-16 Modbus, and CRC-32 checksums for embedded payloads.",
  component: CRCCalculatorTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
