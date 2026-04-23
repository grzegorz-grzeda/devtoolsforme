"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { bytesToBase64, bytesToHex, formatPem, generateRsaKeyPair, generateSecretBytes } from "@/lib/tls-pki";

type KeyMode = "rsa" | "aes" | "hmac" | "random";

export function TLSKeyGeneratorTool() {
  const [mode, setMode] = useState<KeyMode>("rsa");
  const [rsaBits, setRsaBits] = useState("2048");
  const [secretBytes, setSecretBytes] = useState("32");
  const [result, setResult] = useState<{ primary: string; secondary?: string }>({ primary: "" });
  const [status, setStatus] = useState("Ready.");
  const [working, setWorking] = useState(false);

  const title = useMemo(() => {
    if (mode === "rsa") return "RSA private key";
    if (mode === "aes") return "AES key";
    if (mode === "hmac") return "HMAC key";
    return "Random secret";
  }, [mode]);

  async function handleGenerate() {
    setWorking(true);
    try {
      if (mode === "rsa") {
        const keys = await generateRsaKeyPair(Number(rsaBits));
        setResult({ primary: keys.privateKeyPem, secondary: keys.publicKeyPem });
        setStatus(`Generated RSA-${rsaBits} keypair.`);
      } else {
        const bytes = generateSecretBytes(Number(secretBytes));
        const label = mode === "aes" ? `AES-${Number(secretBytes) * 8} KEY` : mode === "hmac" ? `HMAC-${Number(secretBytes) * 8} KEY` : `RANDOM SECRET`;
        setResult({
          primary: formatPem(label, String.fromCharCode(...bytes)),
          secondary: `hex: ${bytesToHex(bytes)}\nbase64: ${bytesToBase64(bytes)}`,
        });
        setStatus(`Generated ${Number(secretBytes)} random bytes.`);
      }
    } catch (error) {
      setResult({ primary: "" });
      setStatus(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(["rsa", "aes", "hmac", "random"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${mode === value ? "bg-accent text-white" : "bg-sage text-lake hover:bg-sage/70"}`}
          >
            {value.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mode === "rsa" ? (
          <label className="block space-y-2 text-sm font-medium text-ink/80">
            RSA size
            <select value={rsaBits} onChange={(event) => setRsaBits(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent">
              <option value="2048">2048</option>
              <option value="3072">3072</option>
              <option value="4096">4096</option>
            </select>
          </label>
        ) : (
          <label className="block space-y-2 text-sm font-medium text-ink/80">
            Byte length
            <select value={secretBytes} onChange={(event) => setSecretBytes(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent">
              <option value="16">16 bytes</option>
              <option value="32">32 bytes</option>
              <option value="48">48 bytes</option>
              <option value="64">64 bytes</option>
            </select>
          </label>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={handleGenerate} disabled={working} className="rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accentDark disabled:opacity-60">
          {working ? "Generating..." : "Generate"}
        </button>
      </div>

      <p className="rounded-xl border border-ink/10 bg-card px-3 py-2 text-sm text-ink/75">{status}</p>

      <div className="space-y-4">
        <OutputCard title={title} value={result.primary} />
        {result.secondary ? <OutputCard title={mode === "rsa" ? "RSA public key" : "Alternate encodings"} value={result.secondary} /> : null}
      </div>
    </div>
  );
}

function OutputCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">{title}</p>
        <CopyButton value={value} />
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-6 text-ink">{value || "Generate material to see output here."}</pre>
    </div>
  );
}
