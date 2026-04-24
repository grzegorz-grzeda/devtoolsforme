import { MQTTClientTool } from "@/components/mqtt-client-tool";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
  slug: "mqtt-client",
  eyebrow: "Network",
  title: "MQTT Client",
  description: "Connect to an MQTT broker over WebSockets, subscribe to topics, publish messages, and inspect traffic directly in the browser.",
  component: MQTTClientTool,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
