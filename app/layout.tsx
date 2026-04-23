import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "devtoolsforme",
  description: "A practical set of browser-based developer utilities built with Next.js.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
