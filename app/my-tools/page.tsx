import type { Metadata } from "next";
import Link from "next/link";
import { PersonalToolLists } from "@/components/personal-tool-lists";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "My Tools | devtoolsforme",
  description: "View favorites, recent tools, and popular tools saved in this browser.",
  alternates: {
    canonical: "/my-tools",
  },
  openGraph: {
    title: "My Tools | devtoolsforme",
    description: "View favorites, recent tools, and popular tools saved in this browser.",
    url: "https://devtoolsforme.com/my-tools",
    siteName: "devtoolsforme",
    type: "website",
    images: [
      {
        url: "/og/site-home.svg",
        width: 1200,
        height: 630,
        alt: "My tools preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Tools | devtoolsforme",
    description: "View favorites, recent tools, and popular tools saved in this browser.",
    images: ["/og/site-home.svg"],
  },
};

export default function MyToolsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-6 md:px-8 md:py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-lake/80">My tools</p>
      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">Your tool lists.</h1>
          <p className="mt-4 text-base leading-8 text-ink/75">
            Favorites, recent opens, and your most-used tools stay in this browser so you can jump back in quickly.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/" className="theme-primary-button px-5 py-3 text-sm font-semibold">
            Browse all tools
          </Link>
          <Link href="mailto:hello@devtoolsforme.com?subject=devtoolsforme%20feedback" className="theme-secondary-button px-5 py-3 text-sm font-semibold">
            Send feedback
          </Link>
        </div>
      </div>

      <PersonalToolLists tools={tools} />
    </main>
  );
}
