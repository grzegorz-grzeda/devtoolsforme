"use client";

import { useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { generateCsr } from "@/lib/tls-pki";

export function CSRGeneratorTool() {
  const [bits, setBits] = useState("2048");
  const [commonName, setCommonName] = useState("devtoolsforme.local");
  const [organization, setOrganization] = useState("devtoolsforme");
  const [organizationalUnit, setOrganizationalUnit] = useState("Engineering");
  const [country, setCountry] = useState("PL");
  const [state, setState] = useState("Mazowieckie");
  const [locality, setLocality] = useState("Warsaw");
  const [sanInput, setSanInput] = useState("devtoolsforme.local,127.0.0.1");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [privateKeyPem, setPrivateKeyPem] = useState("");
  const [csrPem, setCsrPem] = useState("");

  async function handleGenerate() {
    setWorking(true);
    setError("");
    try {
      const result = await generateCsr({
        bits: Number(bits),
        commonName,
        organization,
        organizationalUnit,
        country,
        state,
        locality,
        sans: sanInput.split(",").map((entry) => entry.trim()).filter(Boolean),
      });
      setPrivateKeyPem(result.privateKeyPem);
      setCsrPem(result.csrPem);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "CSR generation failed.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Common name" value={commonName} onChange={setCommonName} />
        <Field label="Organization" value={organization} onChange={setOrganization} />
        <Field label="Org unit" value={organizationalUnit} onChange={setOrganizationalUnit} />
        <Field label="Country" value={country} onChange={setCountry} />
        <Field label="State" value={state} onChange={setState} />
        <Field label="Locality" value={locality} onChange={setLocality} />
        <label className="block space-y-2 text-sm font-medium text-ink/80">
          RSA size
          <select value={bits} onChange={(event) => setBits(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent">
            <option value="2048">2048</option>
            <option value="3072">3072</option>
            <option value="4096">4096</option>
          </select>
        </label>
        <Field label="Subject alt names" value={sanInput} onChange={setSanInput} placeholder="comma-separated DNS/IP entries" className="xl:col-span-2" />
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={handleGenerate} disabled={working} className="rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accentDark disabled:opacity-60">
          {working ? "Generating..." : "Generate CSR"}
        </button>
      </div>

      {error ? <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">{error}</p> : null}

      <OutputCard title="Private key" value={privateKeyPem} />
      <OutputCard title="Certificate signing request" value={csrPem} />
    </div>
  );
}

function Field({ label, value, onChange, placeholder, className = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; className?: string }) {
  return (
    <label className={`block space-y-2 text-sm font-medium text-ink/80 ${className}`}>
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent" />
    </label>
  );
}

function OutputCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">{title}</p>
        <CopyButton value={value} />
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-6 text-ink">{value || "Generate a CSR to see output here."}</pre>
    </div>
  );
}
