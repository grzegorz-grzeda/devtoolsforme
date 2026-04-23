import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata("Terms", "Basic terms for using devtoolsforme and understanding its no-warranty public utility nature.");

export default function TermsPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10 md:px-10">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-lake/80">Terms</p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight text-ink">Simple terms for a practical utility site.</h1>
      <div className="mt-8 space-y-6 text-base leading-8 text-ink/75">
        <p>devtoolsforme is provided on an as-is basis for general informational and utility use. While care is taken to make the tools useful and accurate, no warranty is made that every output will be error-free or fit for a particular purpose.</p>
        <p>You are responsible for reviewing and validating outputs before relying on them in production, security-sensitive, legal, or business-critical contexts.</p>
        <p>You may use the site for personal or commercial work, but you may not abuse, interfere with, or attempt to compromise the service.</p>
        <p>These terms may evolve as the product grows.</p>
      </div>
    </main>
  );
}
