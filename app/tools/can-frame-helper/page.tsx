import { CANFrameHelperTool } from "@/components/can-frame-helper-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "can-frame-helper",
  eyebrow: "Embedded",
  title: "CAN Frame Helper",
  description: "Inspect simple CAN ID, frame type, DLC, and data byte layouts.",
  component: CANFrameHelperTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
