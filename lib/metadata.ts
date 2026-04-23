import type { Metadata } from "next";

const siteName = "devtoolsforme";
const siteUrl = "https://devtoolsforme.com";

export function createToolMetadata(title: string, description: string, slug?: string): Metadata {
  const fullTitle = `${title} | ${siteName}`;
  const pathname = slug ? `/tools/${slug}` : "/";
  const ogImage = slug ? `/og/${slug}.svg` : "/og/site-home.svg";

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `${siteUrl}${pathname}`,
      siteName,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
