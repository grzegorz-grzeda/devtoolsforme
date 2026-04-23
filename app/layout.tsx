import type { Metadata } from "next";
import { ConsentBanner } from "@/components/consent-banner";
import { GoogleAnalytics } from "@/components/google-analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createToolMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = {
  ...createToolMetadata(
    "Developer Tools for Everyday Work",
    "Browser-first utilities for encoding, formatting, conversion, inspection, and quick reference work.",
    undefined
  ),
  metadataBase: new URL("https://devtoolsforme.com"),
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <GoogleAnalytics />
        <SiteHeader />
        {children}
        <SiteFooter />
        <ConsentBanner />
      </body>
    </html>
  );
}
