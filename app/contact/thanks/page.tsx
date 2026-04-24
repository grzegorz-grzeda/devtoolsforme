import type { Metadata } from "next";
import Link from "next/link";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata(
    "Contact Sent",
    "Confirmation page for contact requests sent through devtoolsforme."
);

const nextSteps = [
    "If your message is project-related, the clearest next reply usually includes stack, timeline, and the main blocker.",
    "If you asked for a tool or workflow improvement, examples of real inputs and outputs help a lot.",
    "If you came here from the utilities, you can go back to the tools list while waiting for a reply.",
];

export default function ContactThanksPage() {
    return (
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10 md:px-10">
            <section className="theme-panel px-6 py-6 md:px-7 md:py-7">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-lake/80">Message sent</p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink md:text-5xl">
                    Thanks. Your message is on its way.
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-ink/75">
                    The contact form was submitted successfully. If you configured HeroTofu success redirects,
                    this page is a clean place to land after submission.
                </p>

                <div className="mt-8 rounded-[1.5rem] border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake/80">Useful next steps</p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-ink/75">
                        {nextSteps.map((item) => (
                            <li key={item} className="flex gap-3">
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/contact" className="theme-secondary-button px-5 py-3 text-sm font-semibold">
                        Back to contact
                    </Link>
                    <Link href="/" className="theme-primary-button px-5 py-3 text-sm font-semibold">
                        Browse tools
                    </Link>
                </div>
            </section>
        </main>
    );
}