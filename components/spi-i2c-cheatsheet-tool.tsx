"use client";

import { useMemo, useState } from "react";

const i2cPullups = [
  { speed: "100 kHz", riseTimeNs: 1000, suggestion: "4.7k - 10k typical" },
  { speed: "400 kHz", riseTimeNs: 300, suggestion: "2.2k - 4.7k typical" },
  { speed: "1 MHz", riseTimeNs: 120, suggestion: "1k - 2.2k depending on bus capacitance" },
];

const spiModes = [
  {
    mode: "Mode 0",
    cpol: 0,
    cpha: 0,
    idleClock: "Low",
    sampleEdge: "Rising",
    shiftEdge: "Falling",
    aliases: "(0,0)",
  },
  {
    mode: "Mode 1",
    cpol: 0,
    cpha: 1,
    idleClock: "Low",
    sampleEdge: "Falling",
    shiftEdge: "Rising",
    aliases: "(0,1)",
  },
  {
    mode: "Mode 2",
    cpol: 1,
    cpha: 0,
    idleClock: "High",
    sampleEdge: "Falling",
    shiftEdge: "Rising",
    aliases: "(1,0)",
  },
  {
    mode: "Mode 3",
    cpol: 1,
    cpha: 1,
    idleClock: "High",
    sampleEdge: "Rising",
    shiftEdge: "Falling",
    aliases: "(1,1)",
  },
];

const commonI2CFrequencies = ["100000", "400000", "1000000"];
const commonCapacitances = ["50", "100", "200", "400"];
const commonResistors = [1000, 1200, 1500, 1800, 2200, 2700, 3300, 4700, 6800, 10000];

function formatHex(value: number, width = 2) {
  return `0x${value.toString(16).toUpperCase().padStart(width, "0")}`;
}

function formatBinary(value: number, width = 8) {
  return value.toString(2).padStart(width, "0");
}

function clamp7BitAddress(value: number) {
  if (Number.isNaN(value)) return null;
  return Math.min(0x7f, Math.max(0, value));
}

export function SPII2CCheatsheetTool() {
  const [addressInput, setAddressInput] = useState("0x3C");
  const [vccInput, setVccInput] = useState("3.3");
  const [capacitanceInput, setCapacitanceInput] = useState("100");
  const [frequencyInput, setFrequencyInput] = useState("400000");

  const addressInfo = useMemo(() => {
    const normalized = addressInput.trim().toLowerCase();
    const parsed = normalized.startsWith("0x")
      ? Number.parseInt(normalized.slice(2), 16)
      : Number.parseInt(normalized, 16);

    const address7Bit = clamp7BitAddress(parsed);
    if (address7Bit === null) return null;

    const writeByte = address7Bit << 1;
    const readByte = writeByte | 1;

    return {
      address7Bit,
      writeByte,
      readByte,
      isReserved: address7Bit <= 0x07 || address7Bit >= 0x78,
    };
  }, [addressInput]);

  const pullupEstimate = useMemo(() => {
    const vcc = Number(vccInput);
    const busCapacitancePf = Number(capacitanceInput);
    const busFrequency = Number(frequencyInput);
    if ([vcc, busCapacitancePf, busFrequency].some(Number.isNaN)) return null;
    if (vcc <= 0 || busCapacitancePf <= 0 || busFrequency <= 0) return null;

    const selectedSpeed = i2cPullups.find((row) => Number(row.speed.split(" ")[0]) * 1000 === busFrequency / 100);
    const riseTimeNs = busFrequency <= 100000 ? 1000 : busFrequency <= 400000 ? 300 : 120;
    const capacitanceFarads = busCapacitancePf * 1e-12;
    const maxResistor = (riseTimeNs * 1e-9) / (0.8473 * capacitanceFarads);
    const minResistor = vcc / 0.003;
    const recommended = commonResistors.filter((value) => value >= minResistor && value <= maxResistor);

    return {
      speedLabel: selectedSpeed?.speed ?? `${(busFrequency / 1000).toFixed(0)} kHz`,
      maxResistor,
      minResistor,
      recommended,
      sinkCurrentMaAt47k: (vcc / 4700) * 1000,
    };
  }, [capacitanceInput, frequencyInput, vccInput]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <section className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">SPI mode quick reference</p>
              <p className="mt-1 text-sm text-ink/70">Check idle clock level and which edge samples incoming data.</p>
            </div>
            <div className="rounded-2xl bg-canvas px-3 py-2 text-xs text-ink/70">
              CPOL sets idle SCLK level. CPHA picks the sample edge.
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-ink">
              <thead>
                <tr className="border-b border-ink/10 text-xs uppercase tracking-[0.18em] text-ink/55">
                  <th className="px-3 py-2 font-semibold">Mode</th>
                  <th className="px-3 py-2 font-semibold">CPOL/CPHA</th>
                  <th className="px-3 py-2 font-semibold">Idle</th>
                  <th className="px-3 py-2 font-semibold">Sample</th>
                  <th className="px-3 py-2 font-semibold">Shift</th>
                </tr>
              </thead>
              <tbody>
                {spiModes.map((row) => (
                  <tr key={row.mode} className="border-b border-ink/5 last:border-b-0">
                    <td className="px-3 py-3 font-semibold">{row.mode}</td>
                    <td className="px-3 py-3 font-mono text-xs">{row.aliases}</td>
                    <td className="px-3 py-3">{row.idleClock}</td>
                    <td className="px-3 py-3">{row.sampleEdge}</td>
                    <td className="px-3 py-3">{row.shiftEdge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-canvas px-4 py-3 text-sm text-ink">
              <p className="font-semibold">Wiring mnemonic</p>
              <p className="mt-1 text-ink/75">Controller-out is MOSI/COPI, controller-in is MISO/CIPO, clock is SCLK, and each target needs its own chip-select.</p>
            </div>
            <div className="rounded-2xl bg-canvas px-4 py-3 text-sm text-ink">
              <p className="font-semibold">Bring-up order</p>
              <p className="mt-1 text-ink/75">Confirm voltage levels, then CS polarity, then mode, then bit order, then maximum clock rate.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">I2C address helper</p>
          <p className="mt-1 text-sm text-ink/70">Enter a 7-bit slave address to get the transmitted read and write bytes.</p>

          <label className="mt-4 block space-y-2 text-sm font-semibold text-ink/80">
            7-bit address (hex)
            <input
              value={addressInput}
              onChange={(event) => setAddressInput(event.target.value)}
              className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent"
              placeholder="0x3C"
            />
          </label>

          {!addressInfo ? (
            <p className="mt-4 rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">Enter a valid 7-bit hex address, for example 0x3C.</p>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-canvas px-4 py-3 text-sm text-ink">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Write byte</p>
                  <p className="mt-2 font-mono text-lg">{formatHex(addressInfo.writeByte)}</p>
                  <p className="mt-1 font-mono text-xs text-ink/65">{formatBinary(addressInfo.writeByte)}</p>
                </div>
                <div className="rounded-2xl bg-canvas px-4 py-3 text-sm text-ink">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Read byte</p>
                  <p className="mt-2 font-mono text-lg">{formatHex(addressInfo.readByte)}</p>
                  <p className="mt-1 font-mono text-xs text-ink/65">{formatBinary(addressInfo.readByte)}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-ink/10 bg-white/85 px-4 py-3 text-sm text-ink">
                <p>
                  7-bit address: <span className="font-mono">{formatHex(addressInfo.address7Bit)}</span>
                </p>
                <p className="mt-1 text-ink/70">On the bus, the address is shifted left by one and the lowest bit becomes the R/W flag.</p>
                {addressInfo.isReserved ? (
                  <p className="mt-2 text-accentDark">This address sits in the reserved range. Double-check that the target actually uses it.</p>
                ) : null}
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">I2C pull-up guidance</p>
          <p className="mt-1 text-sm text-ink/70">Use the table for quick defaults, then sanity-check with estimated bus capacitance and sink current.</p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <label className="block space-y-2 text-sm font-semibold text-ink/80">
              Bus speed
              <select
                value={frequencyInput}
                onChange={(event) => setFrequencyInput(event.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent"
              >
                {commonI2CFrequencies.map((value) => (
                  <option key={value} value={value}>
                    {(Number(value) / 1000).toFixed(0)} kHz
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2 text-sm font-semibold text-ink/80">
              Bus capacitance (pF)
              <input
                value={capacitanceInput}
                onChange={(event) => setCapacitanceInput(event.target.value)}
                list="i2c-capacitance-values"
                className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent"
              />
              <datalist id="i2c-capacitance-values">
                {commonCapacitances.map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
            </label>
            <label className="block space-y-2 text-sm font-semibold text-ink/80">
              Vcc (V)
              <input
                value={vccInput}
                onChange={(event) => setVccInput(event.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {i2cPullups.map((row) => (
              <div key={row.speed} className="rounded-2xl bg-canvas px-4 py-3 text-sm text-ink">
                <p className="font-semibold">{row.speed}</p>
                <p className="mt-1">{row.suggestion}</p>
                <p className="mt-1 text-xs text-ink/60">Spec rise time target: {row.riseTimeNs} ns</p>
              </div>
            ))}
          </div>

          {!pullupEstimate ? (
            <p className="mt-4 rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">Enter valid Vcc, bus capacitance, and frequency values.</p>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-ink/10 bg-white/85 px-4 py-3 text-sm text-ink">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Minimum resistor</p>
                <p className="mt-2 font-mono text-lg">{(pullupEstimate.minResistor / 1000).toFixed(2)} kOhm</p>
                <p className="mt-1 text-ink/70">Keeps sink current near or below 3 mA.</p>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-white/85 px-4 py-3 text-sm text-ink">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Maximum resistor</p>
                <p className="mt-2 font-mono text-lg">{(pullupEstimate.maxResistor / 1000).toFixed(2)} kOhm</p>
                <p className="mt-1 text-ink/70">Based on {pullupEstimate.speedLabel} rise-time limit and RC charging.</p>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-white/85 px-4 py-3 text-sm text-ink">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Suggested values</p>
                <p className="mt-2 font-mono text-lg">{pullupEstimate.recommended.length > 0 ? pullupEstimate.recommended.map((value) => `${value / 1000}k`).join(", ") : "None in common set"}</p>
                <p className="mt-1 text-ink/70">4.7k would sink about {pullupEstimate.sinkCurrentMaAt47k.toFixed(2)} mA at this supply.</p>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Bus debug checklist</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-canvas px-4 py-3 text-sm text-ink">
              <p className="font-semibold">I2C no-ack</p>
              <p className="mt-1 text-ink/75">Check 7-bit vs 8-bit address confusion first, then pull-ups, then whether the target is held in reset or busy with clock stretching.</p>
            </div>
            <div className="rounded-2xl bg-canvas px-4 py-3 text-sm text-ink">
              <p className="font-semibold">SPI all-zero or all-ones data</p>
              <p className="mt-1 text-ink/75">Look for wrong mode, wrong chip-select timing, missing common ground, or a target that requires a dummy byte before returning data.</p>
            </div>
            <div className="rounded-2xl bg-canvas px-4 py-3 text-sm text-ink">
              <p className="font-semibold">Scope sanity checks</p>
              <p className="mt-1 text-ink/75">I2C should idle high on both lines. SPI clock should idle at the level implied by CPOL and only toggle while CS is asserted.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
