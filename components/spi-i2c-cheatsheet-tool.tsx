"use client";

const i2cPullups = [
  { bus: "100 kHz", suggestion: "4.7k - 10k typical" },
  { bus: "400 kHz", suggestion: "2.2k - 4.7k typical" },
  { bus: "1 MHz", suggestion: "1k - 2.2k depending on bus capacitance" },
];

const spiModes = [
  { mode: "Mode 0", cpol: 0, cpha: 0 },
  { mode: "Mode 1", cpol: 0, cpha: 1 },
  { mode: "Mode 2", cpol: 1, cpha: 0 },
  { mode: "Mode 3", cpol: 1, cpha: 1 },
];

export function SPII2CCheatsheetTool() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">SPI modes</p><div className="mt-3 space-y-3">{spiModes.map((row) => <div key={row.mode} className="rounded-2xl bg-canvas px-4 py-3 text-sm text-ink"><p className="font-semibold">{row.mode}</p><p className="font-mono">CPOL={row.cpol} CPHA={row.cpha}</p></div>)}</div></div>
      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">I2C pull-up guidance</p><div className="mt-3 space-y-3">{i2cPullups.map((row) => <div key={row.bus} className="rounded-2xl bg-canvas px-4 py-3 text-sm text-ink"><p className="font-semibold">{row.bus}</p><p>{row.suggestion}</p></div>)}</div></div>
    </div>
  );
}
