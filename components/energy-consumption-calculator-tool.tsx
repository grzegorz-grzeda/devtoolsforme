import React, { useMemo, useState } from 'react';
import { EnergyBarChart } from './energy-bar-chart';
import { calculateEnergyConsumption, formatBatteryLife } from '@/lib/energy-consumption';

type Phase = {
    label: string;
    current: string; // mA
    time: string; // s
};

export default function EnergyConsumptionCalculatorTool() {
    const [capacity, setCapacity] = useState('2000');
    const [phases, setPhases] = useState<Phase[]>([
        { label: 'Active', current: '15', time: '1' },
        { label: 'Sleep', current: '0.01', time: '59' },
    ]);

    const result = useMemo(() => calculateEnergyConsumption(capacity, phases), [capacity, phases]);

    function handlePhaseChange(idx: number, field: keyof Phase, value: string) {
        setPhases(phases => phases.map((phase, i) => i === idx ? { ...phase, [field]: value } : phase));
    }

    function addPhase() {
        setPhases(phases => [...phases, { label: `Phase ${phases.length + 1}`, current: '0', time: '1' }]);
    }

    function removePhase(idx: number) {
        setPhases(phases => phases.length > 1 ? phases.filter((_, i) => i !== idx) : phases);
    }

    return (
        <div className="w-full space-y-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
                <section className="rounded-2xl border border-ink/10 bg-white/75 p-5">
                    <form className="space-y-6" onSubmit={event => event.preventDefault()}>
                        <label className="block text-sm font-semibold text-ink/80">
                            Battery capacity [mAh]
                            <input
                                type="number"
                                step="1"
                                min="0"
                                value={capacity}
                                onChange={event => setCapacity(event.target.value)}
                                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent"
                            />
                        </label>

                        <div className="space-y-3">
                            {phases.map((phase, idx) => (
                                <div key={idx} className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,0.85fr)_2.5rem] md:items-end">
                                    <label className="text-sm font-semibold text-ink/80">
                                        Phase name
                                        <input
                                            type="text"
                                            value={phase.label}
                                            onChange={event => handlePhaseChange(idx, 'label', event.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent"
                                        />
                                    </label>
                                    <label className="text-sm font-semibold text-ink/80">
                                        Current [mA]
                                        <input
                                            type="number"
                                            step="0.0001"
                                            min="0"
                                            value={phase.current}
                                            onChange={event => handlePhaseChange(idx, 'current', event.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent"
                                        />
                                    </label>
                                    <label className="text-sm font-semibold text-ink/80">
                                        Time [s]
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={phase.time}
                                            onChange={event => handlePhaseChange(idx, 'time', event.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent"
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        className="h-11 rounded-full px-2 text-lg font-bold text-red-400 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        title="Remove phase"
                                        onClick={() => removePhase(idx)}
                                        disabled={phases.length === 1}
                                    >
                                        x
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-lake transition hover:bg-sage/70"
                            onClick={addPhase}
                        >
                            Add phase
                        </button>
                    </form>
                </section>

                <section className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-ink/10 bg-white/80 p-4">
                            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">Average current</div>
                            <div className="mt-2 font-mono text-2xl font-bold text-ink">
                                {result ? `${result.avgCurrent.toFixed(4)} mA` : '-'}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-ink/10 bg-white/80 p-4">
                            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">Battery lifetime</div>
                            <div className="mt-2 font-mono text-xl font-bold leading-snug text-ink">
                                {result ? formatBatteryLife(result.batteryLife) : '-'}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-ink/10 bg-white/70 p-4">
                        <div className="mb-3 text-xs text-ink/60">
                            {result ? `Cycle time: ${result.totalTime.toFixed(2)} s` : 'Enter a battery capacity and at least one timed phase.'}
                        </div>
                        <EnergyBarChart phases={phases} />
                    </div>
                </section>
            </div>

            <details className="rounded-2xl border border-ink/10 bg-white/70 p-4 text-xs text-ink/70">
                <summary className="cursor-pointer font-semibold text-ink">How does it work?</summary>
                <ul className="ml-4 mt-2 list-disc">
                    <li>You can add any number of cycle phases, such as active, transmit, and sleep.</li>
                    <li>Average current is calculated from the sum of current times duration for each phase.</li>
                    <li>Battery lifetime is estimated as <span className="font-mono">capacity / average current</span>.</li>
                    <li>Battery capacity is expected in mAh and current is expected in mA.</li>
                </ul>
            </details>
        </div>
    );
}
