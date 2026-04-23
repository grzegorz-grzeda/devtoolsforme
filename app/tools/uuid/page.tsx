import type { Metadata } from "next";
import { ToolShell } from "@/components/tool-shell";
import { UUIDTool } from "@/components/uuid-tool";
import { createToolMetadata } from "@/lib/metadata";
export const metadata: Metadata = createToolMetadata("UUID Generator", "Generate RFC 4122 version 4 UUIDs in batches, then copy single values or the whole set for your next task.", "uuid");
export default function UUIDPage() { return <ToolShell slug="uuid" eyebrow="Identity" title="UUID Generator" description="Generate RFC 4122 version 4 UUIDs in batches, then copy single values or the whole set for your next task."><UUIDTool /></ToolShell>; }
