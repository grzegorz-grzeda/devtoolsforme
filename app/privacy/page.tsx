import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata("Privacy", "Read how devtoolsforme handles analytics, client-side storage, and browser-only tools.");

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10 md:px-10">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-lake/80">Privacy</p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight text-ink">Privacy-first by design.</h1>
      <div className="mt-8 space-y-6 text-base leading-8 text-ink/75">
        <p>Most devtoolsforme utilities run directly in your browser. Inputs you enter into tools are generally processed locally and are not sent to a server controlled by devtoolsforme.</p>
        <p>The site stores a small amount of browser data locally to support features like favorites, recently used tools, local popularity rankings, theme preference, and analytics consent choices.</p>
        <p>If you accept analytics, Google Analytics may collect usage data such as page views and device/browser information under Google’s policies. If you decline, analytics stays disabled.</p>
        <p>If you contact devtoolsforme by email, your message and email address will be used only to respond to you and improve the product.</p>
      </div>
    </main>
  );
}
