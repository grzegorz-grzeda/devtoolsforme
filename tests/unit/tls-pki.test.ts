import forge from "node-forge";
import { describe, expect, it } from "vitest";
import {
  bytesToBase64,
  bytesToHex,
  formatPem,
  generateCsr,
  generateRsaKeyPair,
  generateSecretBytes,
  inspectCertificatePem,
} from "../../lib/tls-pki";

describe("tls-pki helpers", () => {
  it("formats PEM blocks and raw byte encodings", () => {
    expect(formatPem("TEST DATA", "abcd")).toBe([
      "-----BEGIN TEST DATA-----",
      "YWJjZA==",
      "-----END TEST DATA-----",
    ].join("\n"));
    expect(bytesToHex(new Uint8Array([0x00, 0x10, 0xab, 0xff]))).toBe("0010abff");
    expect(bytesToBase64(new Uint8Array([0x48, 0x69, 0x21]))).toBe("SGkh");
  });

  it("generates random secrets at the requested length", () => {
    const bytes = generateSecretBytes(24);

    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes).toHaveLength(24);
  });

  it("generates PEM-encoded RSA key pairs", async () => {
    const keyPair = await generateRsaKeyPair(512);

    expect(keyPair.privateKeyPem).toContain("BEGIN RSA PRIVATE KEY");
    expect(keyPair.publicKeyPem).toContain("BEGIN PUBLIC KEY");
  });

  it("builds a CSR with subject attributes and SAN entries", async () => {
    const generated = await generateCsr({
      bits: 512,
      commonName: "example.com",
      organization: "Acme Corp",
      organizationalUnit: "Platform",
      country: "US",
      state: "Illinois",
      locality: "Chicago",
      sans: ["example.com", "127.0.0.1", " api.example.com "],
    });

    const csr = forge.pki.certificationRequestFromPem(generated.csrPem);
    const subject = Object.fromEntries(csr.subject.attributes.map((attribute) => [attribute.name ?? attribute.shortName ?? "", attribute.value]));
    const extensionRequest = csr.getAttribute({ name: "extensionRequest" }) as { extensions?: Array<{ name?: string; altNames?: Array<{ type: number; value?: string; ip?: string }> }> } | null;
    const sanExtension = extensionRequest?.extensions?.find((extension) => extension.name === "subjectAltName");

    expect(generated.privateKeyPem).toContain("BEGIN RSA PRIVATE KEY");
    expect(generated.publicKeyPem).toContain("BEGIN PUBLIC KEY");
    expect(csr.verify()).toBe(true);
    expect(subject).toMatchObject({
      commonName: "example.com",
      organizationName: "Acme Corp",
      organizationalUnitName: "Platform",
      countryName: "US",
      ST: "Illinois",
      localityName: "Chicago",
    });
    expect(sanExtension?.altNames).toEqual([
      { type: 2, value: "example.com" },
      { type: 7, ip: "127.0.0.1" },
      { type: 2, value: "api.example.com" },
    ]);
  });

  it("inspects parsed certificate details", () => {
    const keys = forge.pki.rsa.generateKeyPair(512);
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = "01";
    cert.validity.notBefore = new Date("2024-01-01T00:00:00.000Z");
    cert.validity.notAfter = new Date("2025-01-01T00:00:00.000Z");

    const subject = [
      { name: "commonName", value: "example.com" },
      { name: "organizationName", value: "Acme Corp" },
    ];
    cert.setSubject(subject);
    cert.setIssuer(subject);
    cert.setExtensions([
      { name: "basicConstraints", cA: true },
      {
        name: "keyUsage",
        digitalSignature: true,
        keyEncipherment: true,
        keyCertSign: true,
      },
      {
        name: "subjectAltName",
        altNames: [
          { type: 2, value: "example.com" },
          { type: 7, ip: "127.0.0.1" },
        ],
      },
    ]);
    cert.sign(keys.privateKey, forge.md.sha256.create());

    const inspected = inspectCertificatePem(forge.pki.certificateToPem(cert));

    expect(inspected.subject).toBe("CN: example.com, O: Acme Corp");
    expect(inspected.issuer).toBe("CN: example.com, O: Acme Corp");
    expect(inspected.serialNumber).toBe("01");
    expect(inspected.validFrom).toBe("2024-01-01T00:00:00.000Z");
    expect(inspected.validTo).toBe("2025-01-01T00:00:00.000Z");
    expect(inspected.altNames).toEqual(["example.com", "127.0.0.1"]);
    expect(inspected.isCa).toBe(true);
    expect(inspected.keyUsage).toEqual(["digitalSignature", "keyEncipherment", "keyCertSign"]);
    expect(inspected.sigAlg).toBe(forge.pki.oids.sha256WithRSAEncryption);
    expect(inspected.sha256Fingerprint).toMatch(/^[0-9a-f]{64}$/);
  });
});
