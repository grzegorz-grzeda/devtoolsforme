import type { Metadata } from "next";
import { MQTTClientTool } from "@/components/mqtt-client-tool";
import { ToolShell } from "@/components/tool-shell";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata(
  "MQTT Client",
  "Connect to an MQTT broker over WebSockets, subscribe to topics, publish messages, and inspect traffic directly in the browser.",
  "mqtt-client"
);

export default function MQTTClientPage() {
  return (
    <ToolShell
      slug="mqtt-client"
      eyebrow="Network"
      title="MQTT Client"
      description="Connect to an MQTT broker over WebSockets, subscribe to topics, publish messages, and inspect traffic directly in the browser."
    >
      <MQTTClientTool />
    </ToolShell>
  );
}
