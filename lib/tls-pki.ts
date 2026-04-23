import forge from "node-forge";

export function formatPem(label: string, binary: string) {
  const base64 = forge.util.encode64(binary);
  const lines = base64.match(/.{1,64}/g)?.join("\n") ?? base64;
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`;
}

export function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

export function bytesToBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
}

export async function generateRsaKeyPair(bits: number) {
  return new Promise<{ privateKeyPem: string; publicKeyPem: string }>((resolve, reject) => {
    forge.pki.rsa.generateKeyPair({ bits, workers: -1 }, (error, keyPair) => {
      if (error || !keyPair) {
        reject(error ?? new Error("RSA generation failed."));
        return;
      }

      resolve({
        privateKeyPem: forge.pki.privateKeyToPem(keyPair.privateKey),
        publicKeyPem: forge.pki.publicKeyToPem(keyPair.publicKey),
      });
    });
  });
}

export function generateSecretBytes(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

export async function generateCsr(options: {
  bits: number;
  commonName: string;
  organization?: string;
  organizationalUnit?: string;
  country?: string;
  state?: string;
  locality?: string;
  sans: string[];
}) {
  const keys = await new Promise<forge.pki.rsa.KeyPair>((resolve, reject) => {
    forge.pki.rsa.generateKeyPair({ bits: options.bits, workers: -1 }, (error, keyPair) => {
      if (error || !keyPair) {
        reject(error ?? new Error("Key generation failed."));
        return;
      }
      resolve(keyPair);
    });
  });

  const csr = forge.pki.createCertificationRequest();
  csr.publicKey = keys.publicKey;

  const attributes: forge.pki.CertificateField[] = [
    { name: "commonName", value: options.commonName },
  ];

  if (options.organization) attributes.push({ name: "organizationName", value: options.organization });
  if (options.organizationalUnit) attributes.push({ name: "organizationalUnitName", value: options.organizationalUnit });
  if (options.country) attributes.push({ name: "countryName", value: options.country });
  if (options.state) attributes.push({ shortName: "ST", value: options.state });
  if (options.locality) attributes.push({ name: "localityName", value: options.locality });

  csr.setSubject(attributes);

  const altNames = options.sans
    .filter(Boolean)
    .map((entry) => {
      const trimmed = entry.trim();
      if (/^\d+\.\d+\.\d+\.\d+$/.test(trimmed)) {
        return { type: 7, ip: trimmed };
      }
      return { type: 2, value: trimmed };
    });

  if (altNames.length > 0) {
    csr.setAttributes([
      {
        name: "extensionRequest",
        extensions: [
          {
            name: "subjectAltName",
            altNames,
          },
        ],
      },
    ]);
  }

  csr.sign(keys.privateKey, forge.md.sha256.create());

  return {
    privateKeyPem: forge.pki.privateKeyToPem(keys.privateKey),
    publicKeyPem: forge.pki.publicKeyToPem(keys.publicKey),
    csrPem: forge.pki.certificationRequestToPem(csr),
  };
}

export function inspectCertificatePem(pem: string) {
  const cert = forge.pki.certificateFromPem(pem);
  const sanExtension = cert.extensions.find((extension) => extension.name === "subjectAltName");
  const altNames = sanExtension && "altNames" in sanExtension && Array.isArray(sanExtension.altNames)
    ? sanExtension.altNames.map((entry: { value?: string; ip?: string }) => entry.ip ?? entry.value ?? "").filter(Boolean)
    : [];

  return {
    subject: cert.subject.attributes.map((attribute) => `${attribute.shortName ?? attribute.name}: ${attribute.value}`).join(", "),
    issuer: cert.issuer.attributes.map((attribute) => `${attribute.shortName ?? attribute.name}: ${attribute.value}`).join(", "),
    serialNumber: cert.serialNumber,
    validFrom: cert.validity.notBefore.toISOString(),
    validTo: cert.validity.notAfter.toISOString(),
    sigAlg: cert.siginfo.algorithmOid,
    altNames,
    isCa: cert.extensions.some((extension) => extension.name === "basicConstraints" && Boolean(extension.cA)),
    keyUsage: cert.extensions
      .filter((extension) => extension.name === "keyUsage")
      .flatMap((extension) => {
        const typedExtension = extension as Record<string, unknown>;
        const labels = [
          ["digitalSignature", "digitalSignature"],
          ["keyEncipherment", "keyEncipherment"],
          ["dataEncipherment", "dataEncipherment"],
          ["keyCertSign", "keyCertSign"],
          ["cRLSign", "cRLSign"],
        ] as const;
        return labels.filter(([property]) => Boolean(typedExtension[property])).map(([, label]) => label);
      }),
    sha256Fingerprint: forge.md.sha256.create().update(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes()).digest().toHex(),
  };
}
