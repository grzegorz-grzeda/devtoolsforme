import type { Metadata } from "next";
import { ConsentBanner } from "@/components/consent-banner";
import { GoogleAnalytics } from "@/components/google-analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeController } from "@/components/theme-controller";
import { getThemeBootstrapScript } from "@/lib/theme";
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
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <script dangerouslySetInnerHTML={{ __html: getThemeBootstrapScript() }} />
        <ThemeController>
          <GoogleAnalytics />
          <SiteHeader />
          {children}
          <SiteFooter />
          <ConsentBanner />
        </ThemeController>
      </body>
    </html>
  );
}
