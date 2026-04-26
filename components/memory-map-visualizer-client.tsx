"use client";
import dynamic from "next/dynamic";

const MemoryMapVisualizerTool = dynamic(
    () => import("@/components/memory-map-visualizer-tool"),
    { ssr: false }
);

export default function MemoryMapVisualizerClient() {
    return <MemoryMapVisualizerTool />;
}
