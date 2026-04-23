import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/google-analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "devtoolsforme",
  description: "A practical set of browser-based developer utilities built with Next.js.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
