export type EnergyPhaseInput = {
  current: string;
  time: string;
};

export type EnergyCalculationResult = {
  avgCurrent: number;
  batteryLife: number;
  totalTime: number;
};

function formatNumber(value: number) {
  return value.toFixed(value >= 10 ? 1 : 2).replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
}

function formatDuration(value: number, singularUnit: string, pluralUnit: string) {
  const unit = Math.abs(value - 1) < 0.005 ? singularUnit : pluralUnit;
  return `${formatNumber(value)} ${unit}`;
}

export function calculateEnergyConsumption(capacity: string, phases: EnergyPhaseInput[]): EnergyCalculationResult | null {
  const cap = parseFloat(capacity);
  let totalCurrentTime = 0;
  let totalTime = 0;

  for (const phase of phases) {
    const current = parseFloat(phase.current);
    const time = parseFloat(phase.time);

    if (Number.isFinite(current) && Number.isFinite(time) && current >= 0 && time >= 0) {
      totalCurrentTime += current * time;
      totalTime += time;
    }
  }

  if (!Number.isFinite(cap) || cap <= 0 || totalTime <= 0) {
    return null;
  }

  const avgCurrent = totalCurrentTime / totalTime;
  const batteryLife = avgCurrent > 0 ? cap / avgCurrent : Infinity;

  return { avgCurrent, batteryLife, totalTime };
}

export function formatBatteryLife(hours: number) {
  if (!Number.isFinite(hours)) return "No draw";

  const parts = [`${hours.toFixed(2)} h`];
  const days = hours / 24;

  if (days >= 1) {
    parts.push(formatDuration(days, "day", "days"));
  }

  const months = days / 30.4375;
  if (months >= 1) {
    parts.push(formatDuration(months, "month", "months"));
  }

  const years = days / 365.25;
  if (years >= 1) {
    parts.push(formatDuration(years, "year", "years"));
  }

  return parts.join(" / ");
}
