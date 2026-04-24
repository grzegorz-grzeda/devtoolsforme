import type { Metadata } from "next";
import Link from "next/link";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata("About", "Learn what devtoolsforme is for, how it works, and why it stays browser-first.");

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10 md:px-10">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-lake/80">About</p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight text-ink">Built for the small tasks that slow down bigger work.</h1>
      <div className="mt-8 space-y-6 text-base leading-8 text-ink/75">
        <p>
          Hi, I&apos;m Grzegorz. I&apos;m an embedded engineer focused on firmware, connected devices, and practical developer tooling.
          devtoolsforme is where I publish the utilities I keep reaching for while building and debugging real systems.
        </p>
        <p>devtoolsforme is a browser-first collection of practical developer utilities. The goal is simple: help you move faster without needing a heavyweight app, browser extension, or backend service for every tiny task.</p>
        <p>Most tools here run entirely on your device. That keeps the site fast, private by default, and inexpensive to maintain while still being genuinely useful day to day.</p>
        <p>The product is shaped around everyday workflows: formatting JSON, inspecting tokens, working with URLs, comparing text, checking accessibility colors, and converting data into forms that are easier to use.</p>
        <p>
          Alongside the tools, I also help teams with embedded firmware work, IoT architecture, and internal engineering workflows that benefit from lightweight, purpose-built utilities.
        </p>
      </div>
      <div className="mt-10 rounded-[1.6rem] border border-white/60 bg-card p-6 shadow-soft backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-lake/80">Work with me</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink">Embedded engineering and tooling support</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/75">
          I can help with firmware development, embedded debugging workflows, IoT messaging and OTA flows, and the small utility tooling that makes engineering teams faster.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="https://github.com/grzegorz-grzeda" className="theme-secondary-button px-5 py-3 text-sm font-semibold">GitHub</Link>
          <Link href="https://www.linkedin.com/in/grzegorzgrzeda/" className="theme-secondary-button px-5 py-3 text-sm font-semibold">LinkedIn</Link>
          <Link href="/contact" className="theme-primary-button px-5 py-3 text-sm font-semibold">Start a conversation</Link>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="theme-primary-button px-5 py-3 text-sm font-semibold">Browse all tools</Link>
        <Link href="/contact" className="theme-secondary-button px-5 py-3 text-sm font-semibold">Send feedback</Link>
      </div>
    </main>
  );
}
