import { TimestampConverterTool } from "@/components/timestamp-converter-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "timestamp-converter",
  eyebrow: "Time",
  title: "Timestamp Converter",
  description: "Translate timestamps into human-readable dates and turn dates back into Unix seconds or milliseconds.",
  component: TimestampConverterTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
