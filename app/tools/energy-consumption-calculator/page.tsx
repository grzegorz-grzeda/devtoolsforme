
import EnergyConsumptionCalculatorClient from "@/components/energy-consumption-calculator-client";
import { createToolPage } from "@/lib/tool-page";

const toolPage = createToolPage({
    slug: "energy-consumption-calculator",
    eyebrow: "Embedded",
    title: "Energy Consumption Calculator",
    description: "Calculate average current draw and estimated battery life for battery-powered IoT devices.",
    component: EnergyConsumptionCalculatorClient,
});

export const metadata = toolPage.metadata;
export default toolPage.Page;
