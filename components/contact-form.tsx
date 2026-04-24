const formAction = process.env.NEXT_PUBLIC_HEROTOFU_FORM_ACTION ?? process.env.HEROTOFU_FORM_ACTION;

const topics = [
    "Embedded consulting",
    "Embedded cheatsheets",
    "Tool request",
    "General feedback",
];

export function ContactForm({
    sectionId = "contact",
    className = "mt-6",
    title = "Start a conversation without leaving the page.",
    description = "Use this form for consulting, the embedded cheatsheet pack, tool requests, or general feedback. It posts directly to HeroTofu with a plain HTML POST flow.",
}: {
    sectionId?: string;
    className?: string;
    title?: string;
    description?: string;
}) {
    const isConfigured = Boolean(formAction);

    return (
        <section id={sectionId} className={`theme-panel ${className} overflow-hidden px-5 py-5 md:px-6 md:py-6`.trim()}>
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lake/80">Contact</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink md:text-3xl">{title}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/75">{description}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-lake/85">
                        {topics.map((topic) => (
                            <span key={topic} className="theme-chip px-3 py-1.5">
                                {topic}
                            </span>
                        ))}
                    </div>
                </div>

                <form
                    action={formAction || undefined}
                    method="POST"
                    className="space-y-4 rounded-[1.4rem] border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur"
                >
                    <input type="hidden" name="_subject" value="New contact from devtoolsforme" />

                    <label className="block space-y-2 text-sm font-semibold text-ink/80">
                        I&apos;m reaching out about
                        <select name="topic" defaultValue={topics[0]} disabled={!isConfigured} className="theme-input px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60">
                            {topics.map((topic) => (
                                <option key={topic} value={topic}>
                                    {topic}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="block space-y-2 text-sm font-semibold text-ink/80">
                            Name
                            <input name="name" type="text" autoComplete="name" required={isConfigured} disabled={!isConfigured} className="theme-input px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60" />
                        </label>
                        <label className="block space-y-2 text-sm font-semibold text-ink/80">
                            Email
                            <input name="email" type="email" autoComplete="email" required={isConfigured} disabled={!isConfigured} className="theme-input px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60" />
                        </label>
                    </div>

                    <label className="block space-y-2 text-sm font-semibold text-ink/80">
                        Company or project
                        <input name="company" type="text" autoComplete="organization" disabled={!isConfigured} className="theme-input px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60" />
                    </label>

                    <label className="block space-y-2 text-sm font-semibold text-ink/80">
                        Message
                        <textarea
                            name="message"
                            required={isConfigured}
                            rows={6}
                            disabled={!isConfigured}
                            className="theme-input min-h-36 px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60"
                            placeholder="What are you working on, or what would you like to get from me?"
                        />
                    </label>

                    <div className="hidden" aria-hidden="true">
                        <label>
                            Leave this blank
                            <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
                        </label>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs leading-6 text-ink/60">
                            {isConfigured
                                ? "You will submit directly through HeroTofu. No client-side tracker is attached to this form."
                                : "Sending is disabled until the HeroTofu form action is configured in the environment."}
                        </p>
                        <button type="submit" disabled={!isConfigured} className="theme-primary-button px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60">
                            Send message
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
