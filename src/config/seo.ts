import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const seoConfig = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  canonical: siteConfig.url,
  openGraphImage: "/images/og-default.png",
  twitterCard: "summary_large_image" as const,
} as const;

export function createMetadata(overrides: Metadata = {}): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: seoConfig.title,
    description: seoConfig.description,
    alternates: { canonical: siteConfig.url },
    openGraph: {
      type: "website",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: seoConfig.title.default,
      description: seoConfig.description,
      images: [seoConfig.openGraphImage],
    },
    twitter: {
      card: seoConfig.twitterCard,
      title: seoConfig.title.default,
      description: seoConfig.description,
      images: [seoConfig.openGraphImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    ...overrides,
  };
}