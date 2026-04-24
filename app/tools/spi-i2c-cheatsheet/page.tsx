import { SPII2CCheatsheetTool } from "@/components/spi-i2c-cheatsheet-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "spi-i2c-cheatsheet",
  eyebrow: "Embedded",
  title: "SPI I2C Cheatsheet",
  description: "Reference SPI modes, convert I2C addresses, and estimate practical pull-up values.",
  component: SPII2CCheatsheetTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
