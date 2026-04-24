import { CronParserTool } from "@/components/cron-parser-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "cron-parser",
  eyebrow: "Time",
  title: "Cron Parser",
  description: "Read a cron expression field by field so schedules become easier to verify.",
  component: CronParserTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
