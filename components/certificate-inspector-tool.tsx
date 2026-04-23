"use client";

import { useMemo, useState } from "react";
import { inspectCertificatePem } from "@/lib/tls-pki";

const sample = `-----BEGIN CERTIFICATE-----
MIID0TCCArmgAwIBAgIUUyav1a3MmA6Nb2sQq1MYJgaa8L0wDQYJKoZIhvcNAQEL
BQAweDEcMBoGA1UEAwwTZGV2dG9vbHNmb3JtZS5sb2NhbDEWMBQGA1UECgwNZGV2
dG9vbHNmb3JtZTEMMAoGA1UECwwDUEtJMQswCQYDVQQGEwJQTDEUMBIGA1UECAwL
TWF6b3dpZWNraWUxDzANBgNVBAcMBldhcnNhdzAeFw0yNjA0MjMyMjAzNTRaFw0y
NzA0MjMyMjAzNTRaMHgxHDAaBgNVBAMME2RldnRvb2xzZm9ybWUubG9jYWwxFjAU
BgNVBAoMDWRldnRvb2xzZm9ybWUxDDAKBgNVBAsMA1BLSTELMAkGA1UEBhMCUEwx
FDASBgNVBAgMC01hem93aWVja2llMQ8wDQYDVQQHDAZXYXJzYXcwggEiMA0GCSqG
SIb3DQEBAQUAA4IBDwAwggEKAoIBAQCrktDbqvTvLD+YJHM0sBykqlTrfkTE8CIc
D5Ql1SztPWM1aW5TfazU/HzoznKwxWXsZFFkPlaf4qp2Z4MR8UouKKOjTQ5jJglV
oVWN+E0by4LHZTuDgkIQSZ420d1aP4imixpQMmrtxLNByEq0AmErNHx+KaZK7sKR
eBpI0k0CJLQgQz7HvTfbKd/IwsOwK3ENJWNrP2q9KFSQR3yoY7Ewpw+6/CYVX04v
rJAfW7KzlzD8dlJiNxy9coNvrqDNmsRe9+uNyRUfOilcmvUZD+2HrrVPrM4fovfx
QAylsWySE6WnavTchtfkM8rmdxsWRolZw1azswfqtE3wQ9P5gWVxAgMBAAGjUzBR
MB0GA1UdDgQWBBQsyV/Gch36hq1pxKZBjwV4ypgdbjAfBgNVHSMEGDAWgBQsyV/G
ch36hq1pxKZBjwV4ypgdbjAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUA
A4IBAQB0uj81XvMn+NmNoGVDNKsYnb8Y6w3P4arPzc5iNC8jyB+0crG4ZZ2ndDIF
AIFQfoh7Pc0SrE/OXBB8xpN0wEoNpFLqmduyHjIAWBc+8iHuNl9A2ysew4/NyqDV
owswJXouZ80bXPVh6xTsOaLfVDK76R4IWvbLX+75TgD5efzxM6zzujDEyCHixUBn
BufM3PkE01yP/z6Uf5hPYbikpokYazUm/zFQR/cJZjiuXbtFJWj6VSGIag9iXiCt
m0Wn/W8FRAKgM/hSriG5Wo0pbPH9/hqafdtYk3e9jXUeFO4p4V32WqfUVj1p9CpS
XbeTgFCg5vUj84Ahj8L8Ccdb1ndb
-----END CERTIFICATE-----`;

export function CertificateInspectorTool() {
  const [input, setInput] = useState(sample);
  const result = useMemo(() => {
    try {
      return { data: inspectCertificatePem(input), error: "" };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : "Invalid certificate." };
    }
  }, [input]);

  return (
    <div className="space-y-5">
      <label className="block space-y-2 text-sm font-medium text-ink/80">
        PEM certificate
        <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={12} className="min-h-[260px] w-full rounded-[1.4rem] border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" />
      </label>

      {result.error ? (
        <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">{result.error}</p>
      ) : result.data ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InfoCard label="Subject" value={result.data.subject} />
          <InfoCard label="Issuer" value={result.data.issuer} />
          <InfoCard label="Serial number" value={result.data.serialNumber} mono />
          <InfoCard label="Valid from" value={result.data.validFrom} mono />
          <InfoCard label="Valid to" value={result.data.validTo} mono />
          <InfoCard label="CA certificate" value={result.data.isCa ? "Yes" : "No"} />
          <InfoCard label="Key usage" value={result.data.keyUsage.join(", ") || "-"} />
          <InfoCard label="Subject alt names" value={result.data.altNames.join(", ") || "-"} />
          <InfoCard label="SHA-256 fingerprint" value={result.data.sha256Fingerprint} mono />
        </div>
      ) : null}
    </div>
  );
}

function InfoCard({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">{label}</p>
      <p className={`mt-2 break-words text-sm text-ink ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
