import { TimerPrescalerTool } from "@/components/timer-prescaler-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "timer-prescaler",
  eyebrow: "Embedded",
  title: "Timer Prescaler Calculator",
  description: "Estimate timer tick periods, interrupt intervals, and resulting frequencies.",
  component: TimerPrescalerTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
