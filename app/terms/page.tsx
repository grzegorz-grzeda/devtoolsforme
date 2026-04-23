import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata("Terms", "Basic terms for using devtoolsforme and understanding its no-warranty public utility nature.");

export default function TermsPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10 md:px-10">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-lake/80">Terms</p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight text-ink">Simple terms for a practical utility site.</h1>
      <div className="mt-8 space-y-8 text-base leading-8 text-ink/75">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Utility use only</h2>
          <p>devtoolsforme is a practical helper for developer workflows. It is designed to speed up small tasks in the browser, not to operate as a production-grade service or managed platform.</p>
          <p>You may use the site for personal or commercial work, but you may not abuse, interfere with, or attempt to compromise the service.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Outputs are provided as-is</h2>
          <p>devtoolsforme is provided on an as-is basis for general informational and utility use. While care is taken to make the tools useful and accurate, no warranty is made that any output will be error-free, complete, available, or fit for a particular purpose.</p>
          <p>You are responsible for reviewing and validating outputs before relying on them in production, security-sensitive, legal, financial, compliance, or business-critical contexts.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-ink">No warranty or liability assumptions</h2>
          <p>The site may change, break, or be unavailable at any time. devtoolsforme does not promise uninterrupted operation, long-term retention, or suitability for any deployment environment.</p>
          <p>If you need contractual guarantees, operational support, formal verification, or production assurances, you should use tooling and services intended for that purpose instead of relying on this site alone.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Updates</h2>
          <p>These terms may evolve as the product grows.</p>
        </section>
      </div>
    </main>
  );
}
