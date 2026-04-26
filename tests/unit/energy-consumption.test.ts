import { describe, expect, it } from "vitest";
import { calculateEnergyConsumption, formatBatteryLife } from "../../lib/energy-consumption";

describe("calculateEnergyConsumption", () => {
  it("calculates weighted average current and battery lifetime in hours", () => {
    const result = calculateEnergyConsumption("2000", [
      { current: "15", time: "1" },
      { current: "0.01", time: "59" },
    ]);

    expect(result?.totalTime).toBe(60);
    expect(result?.avgCurrent).toBeCloseTo(0.259833, 6);
    expect(result?.batteryLife).toBeCloseTo(7697.2418, 4);
  });

  it("ignores invalid and negative phase values", () => {
    const result = calculateEnergyConsumption("100", [
      { current: "10", time: "10" },
      { current: "bad", time: "60" },
      { current: "20", time: "-1" },
    ]);

    expect(result).toMatchObject({
      avgCurrent: 10,
      batteryLife: 10,
      totalTime: 10,
    });
  });

  it("returns null for invalid capacity or missing positive cycle time", () => {
    expect(calculateEnergyConsumption("0", [{ current: "1", time: "1" }])).toBeNull();
    expect(calculateEnergyConsumption("100", [{ current: "1", time: "0" }])).toBeNull();
    expect(calculateEnergyConsumption("bad", [{ current: "1", time: "1" }])).toBeNull();
  });

  it("returns infinite battery life when the cycle has time but no current draw", () => {
    const result = calculateEnergyConsumption("100", [{ current: "0", time: "60" }]);

    expect(result?.avgCurrent).toBe(0);
    expect(result?.batteryLife).toBe(Infinity);
  });
});

describe("formatBatteryLife", () => {
  it("shows only hours below one day", () => {
    expect(formatBatteryLife(23.5)).toBe("23.50 h");
  });

  it("adds days once lifetime reaches one day", () => {
    expect(formatBatteryLife(24)).toBe("24.00 h / 1 day");
    expect(formatBatteryLife(320)).toBe("320.00 h / 13.3 days");
  });

  it("adds months and years for long lifetimes", () => {
    expect(formatBatteryLife(24 * 45)).toBe("1080.00 h / 45 days / 1.48 months");
    expect(formatBatteryLife(24 * 400)).toBe("9600.00 h / 400 days / 13.1 months / 1.1 years");
  });

  it("handles zero-current lifetime", () => {
    expect(formatBatteryLife(Infinity)).toBe("No draw");
  });
});
