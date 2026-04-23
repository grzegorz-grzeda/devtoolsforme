import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/60 bg-white/40">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 md:grid-cols-[minmax(0,1fr)_auto] md:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-lake/80">devtoolsforme</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-ink/70">
            A growing set of practical developer tools built to stay fast, browser-first, and easy to trust.
          </p>
          <Link href="mailto:hello@devtoolsforme.com?subject=devtoolsforme%20feedback" className="mt-4 inline-flex text-sm font-semibold text-accent transition hover:text-accentDark">
            Send feedback -&gt;
          </Link>
        </div>
        <div className="grid gap-3 text-sm text-ink/70 md:items-end">
          <Link href="/" className="transition hover:text-accent">Browse all tools</Link>
          <Link href="/about" className="transition hover:text-accent">About</Link>
          <Link href="/privacy" className="transition hover:text-accent">Privacy</Link>
          <Link href="/terms" className="transition hover:text-accent">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
