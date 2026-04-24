import { ModbusRTUHelperTool } from "@/components/modbus-rtu-helper-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "modbus-rtu-helper",
  eyebrow: "Embedded",
  title: "Modbus RTU Helper",
  description: "Build Modbus RTU frames, append CRC bytes, and exchange them over a local serial port.",
  component: ModbusRTUHelperTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
