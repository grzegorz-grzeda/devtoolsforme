"use client";
import dynamic from "next/dynamic";

const EnergyConsumptionCalculatorTool = dynamic(
    () => import("@/components/energy-consumption-calculator-tool"),
    { ssr: false }
);

export default function EnergyConsumptionCalculatorClient() {
    return <EnergyConsumptionCalculatorTool />;
}
