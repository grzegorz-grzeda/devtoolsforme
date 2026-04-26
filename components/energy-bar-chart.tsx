import React from "react";

export interface EnergyBarChartProps {
    phases: Array<{ label: string; current: string; time: string }>;
}

type ParsedPhase = {
    label: string;
    current: number;
    time: number;
};

function formatValue(value: number, digits = 2) {
    if (!Number.isFinite(value)) return "0";
    if (value === 0) return "0";
    if (value < 0.01) return value.toExponential(1);
    if (value < 1) return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
    return value.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
}

export function EnergyBarChart({ phases }: EnergyBarChartProps) {
    const parsedPhases: ParsedPhase[] = phases.map(phase => ({
        label: phase.label.trim() || "Phase",
        current: Math.max(parseFloat(phase.current) || 0, 0),
        time: Math.max(parseFloat(phase.time) || 0, 0),
    }));

    const totalTime = parsedPhases.reduce((sum, phase) => sum + phase.time, 0);
    const totalCharge = parsedPhases.reduce((sum, phase) => sum + phase.current * phase.time, 0);
    const avgCurrent = totalTime > 0 ? totalCharge / totalTime : 0;
    const maxCurrent = Math.max(...parsedPhases.map(phase => phase.current), avgCurrent, 1);

    let elapsed = 0;
    const points: string[] = [];
    const phaseBlocks = parsedPhases.map(phase => {
        const start = totalTime > 0 ? (elapsed / totalTime) * 100 : 0;
        elapsed += phase.time;
        const end = totalTime > 0 ? (elapsed / totalTime) * 100 : start + (100 / parsedPhases.length);
        const y = 88 - (phase.current / maxCurrent) * 76;

        if (points.length === 0) {
            points.push(`${start},88`, `${start},${y}`);
        } else {
            points.push(`${start},${y}`);
        }
        points.push(`${end},${y}`, `${end},88`);

        return { ...phase, start, width: Math.max(end - start, 0), y };
    });

    const avgY = 88 - (avgCurrent / maxCurrent) * 76;

    return (
        <div className="w-full">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                    <h3 className="text-sm font-semibold text-ink">Current profile over one cycle</h3>
                    <p className="text-xs text-ink/60">Phase width is time; step height is current.</p>
                </div>
                <div className="rounded-full border border-ink/10 bg-white/70 px-3 py-1 font-mono text-xs text-ink/70">
                    Average current: {formatValue(avgCurrent, 4)} mA
                </div>
            </div>

            <div className="grid grid-cols-[3.5rem_1fr] gap-3">
                <div className="flex h-44 flex-col justify-between py-2 text-right font-mono text-[11px] text-ink/60">
                    <span>{formatValue(maxCurrent)} mA</span>
                    <span>{formatValue(avgCurrent, 4)} mA</span>
                    <span>0 mA</span>
                </div>
                <div className="relative h-44 overflow-hidden rounded-2xl border border-ink/10 bg-white">
                <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="Current draw profile across cycle phases"
                >
                    <defs>
                        <linearGradient id="energy-profile-fill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgb(22 163 74)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="rgb(22 163 74)" stopOpacity="0.06" />
                        </linearGradient>
                    </defs>
                    <path d={`M ${points.join(" L ")} Z`} fill="url(#energy-profile-fill)" />
                    <polyline
                        points={points.join(" ")}
                        fill="none"
                        stroke="rgb(22 163 74)"
                        strokeWidth="1.8"
                        vectorEffect="non-scaling-stroke"
                        strokeLinejoin="round"
                    />
                    <line
                        x1="0"
                        x2="100"
                        y1={avgY}
                        y2={avgY}
                        stroke="rgb(37 99 235)"
                        strokeWidth="1.2"
                        strokeDasharray="4 3"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>

                <div
                    className="absolute right-3 -translate-y-1/2 rounded-md bg-white/90 px-2 py-1 font-mono text-[11px] text-blue-700"
                    style={{ top: `${Math.max(4, Math.min(82, avgY))}%` }}
                >
                    average
                </div>

                {phaseBlocks.map((phase, idx) => (
                    phase.width >= 14 && (
                        <div
                            key={`${phase.label}-current-${idx}`}
                            className="absolute -translate-y-full px-1 text-center font-mono text-[10px] text-ink/65"
                            style={{
                                left: `${phase.start}%`,
                                top: `${Math.max(14, phase.y - 3)}%`,
                                width: `${phase.width}%`,
                            }}
                        >
                            {formatValue(phase.current, 4)} mA
                        </div>
                    )
                ))}
                </div>
            </div>

            <div className="mt-2 grid grid-cols-[3.5rem_1fr] gap-3">
                <div className="pt-2 text-right text-[11px] font-semibold text-ink/60">Time</div>
                <div className="flex w-full overflow-hidden rounded-xl border border-ink/10 bg-white/70">
                {phaseBlocks.map((phase, idx) => (
                    <div
                        key={`${phase.label}-${idx}`}
                        className="min-w-0 border-r border-ink/10 px-2 py-2 text-center last:border-r-0"
                        style={{ width: `${phase.width}%` }}
                        title={`${phase.label}: ${formatValue(phase.current, 4)} mA for ${formatValue(phase.time)} s`}
                    >
                        <div className="truncate text-[11px] font-semibold text-ink">
                            {phase.width >= 9 ? phase.label : ""}
                        </div>
                        <div className="font-mono text-[10px] text-ink/60">
                            {phase.width >= 7 ? `${formatValue(phase.time)}s` : ""}
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}
