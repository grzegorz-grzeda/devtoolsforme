
import MemoryMapVisualizerClient from "@/components/memory-map-visualizer-client";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
    slug: "memory-map-visualizer",
    eyebrow: "Embedded",
    title: "Memory Map Visualizer",
    description: "Visualize C struct field offsets, alignment padding, and final memory layout.",
    component: MemoryMapVisualizerClient,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
