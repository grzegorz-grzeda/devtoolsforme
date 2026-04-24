import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata(
    "Contact",
    "Get in touch about embedded consulting, IoT work, developer tooling, and practical engineering collaboration."
);

const collaborationAreas = [
    "Firmware work for ESP32, STM32, and connected embedded products",
    "IoT architecture with MQTT, OTA delivery, and browser-based internal tools",
    "Developer tooling and workflow cleanup for embedded teams",
];

const contactNotes = [
    "Use the form if you want to discuss a project, ask for a tool, or send general feedback.",
    "If the request is project-related, include your stack, delivery timeline, and the main constraint you are trying to solve.",
    "The form submits directly to HeroTofu with a plain POST flow, so there is no custom backend here.",
];

const faqItems = [
    {
        question: "What kind of projects are a strong fit?",
        answer:
            "The strongest fit is practical engineering work: firmware delivery, connected-device architecture, developer tooling for embedded teams, and problem-focused internal utilities.",
    },
    {
        question: "Can I use this form for tool ideas, not just consulting?",
        answer:
            "Yes. Tool requests and workflow pain points are useful input, especially if you can describe the recurring task, the data format involved, and what makes the current flow slow.",
    },
    {
        question: "What should I include in the first message?",
        answer:
            "Share the hardware or software context, the main constraint, your delivery timeline, and whether you need implementation help, architecture guidance, or a lightweight utility/tooling layer.",
    },
    {
        question: "Do you have a custom backend for this contact flow?",
        answer:
            "No. The form posts directly to HeroTofu, which keeps the site simple while still giving you a proper contact path.",
    },
];

export default function ContactPage() {
    return (
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 md:px-8">
            <section className="theme-panel px-6 py-6 md:px-7 md:py-7">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-lake/80">Contact</p>
                <div className="mt-4 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
                            Contact me about embedded engineering, connected systems, or dev tooling that actually ships.
                        </h1>
                        <p className="mt-4 max-w-3xl text-base leading-8 text-ink/75">
                            devtoolsforme started as a utility site, but it also serves as the front door to my consulting
                            and engineering work. If you need help with firmware, connected devices, or practical tools that
                            remove friction from engineering workflows, this is the right place to start.
                        </p>
                        <p className="mt-4 max-w-3xl text-base leading-8 text-ink/72">
                            The best first message is specific. Tell me what you are building, where the bottleneck is,
                            and what kind of help would move the project forward fastest.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href="https://github.com/grzegorz-grzeda" className="theme-secondary-button px-5 py-3 text-sm font-semibold">
                                GitHub
                            </Link>
                            <Link href="https://www.linkedin.com/in/grzegorzgrzeda/" className="theme-secondary-button px-5 py-3 text-sm font-semibold">
                                LinkedIn
                            </Link>
                            <Link href="/" className="theme-primary-button px-5 py-3 text-sm font-semibold">
                                Browse tools
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake/80">Good fit</p>
                        <ul className="mt-4 space-y-3 text-sm leading-7 text-ink/75">
                            {collaborationAreas.map((item) => (
                                <li key={item} className="flex gap-3">
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section className="mt-6 grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
                <div className="theme-panel px-6 py-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lake/80">Before you send</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink">What helps me respond quickly</h2>
                    <ul className="mt-4 space-y-4 text-sm leading-7 text-ink/75">
                        {contactNotes.map((item) => (
                            <li key={item} className="flex gap-3">
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <ContactForm
                    className="mt-0"
                    title="Send project details, tool ideas, or a direct note."
                    description="Use the form for consulting inquiries, embedded collaboration, workflow/tool requests, or general feedback about the site."
                />
            </section>

            <section className="mt-6 theme-panel px-6 py-6 md:px-7 md:py-7">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lake/80">FAQ</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink">Common questions before reaching out</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {faqItems.map((item) => (
                        <article key={item.question} className="rounded-[1.4rem] border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur">
                            <h3 className="text-lg font-bold tracking-tight text-ink">{item.question}</h3>
                            <p className="mt-3 text-sm leading-7 text-ink/74">{item.answer}</p>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}