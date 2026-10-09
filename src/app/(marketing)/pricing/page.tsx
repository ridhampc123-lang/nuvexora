import type { Metadata } from "next";
import { PricingInteractiveView } from "@/components/sections/pricing";

export const metadata: Metadata = {
  title: "Predictable Pricing & Enterprise Squad Plans | Nuvexora Technologies",
  description:
    "Explore transparent, value-driven pricing for dedicated software engineering squads and guaranteed fixed-scope milestones. Zero surprise fees, 14-day trial, and 100% Day-One IP ownership.",
  keywords: [
    "Software Development Pricing",
    "Dedicated Engineering Squad Cost",
    "Next.js Development Agency Rates",
    "Enterprise AI Development Cost",
    "Mobile App Development Pricing",
    "SaaS MVP Pricing",
    "Fixed Price Software Development",
    "Nuvexora Technologies Pricing",
  ],
  alternates: {
    canonical: "https://nuvexora.com/pricing",
  },
  openGraph: {
    title: "Predictable Pricing & Engineering Squads | Nuvexora Technologies",
    description:
      "Full transparency in software engineering investment. Compare Starter MVP, Growth Squad, and Enterprise Scale with guaranteed deliverables and enterprise SLAs.",
    url: "https://nuvexora.com/pricing",
    siteName: "Nuvexora Technologies",
    type: "website",
  },
};

export default function PricingPage() {
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Nuvexora Technologies Engineering Services",
    "description":
      "Dedicated software engineering squads, bespoke AI solutions, and fixed-scope digital product delivery.",
    "brand": {
      "@type": "Brand",
      "name": "Nuvexora Technologies",
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Starter Sprint / MVP",
        "price": "4900.00",
        "priceCurrency": "USD",
        "description": "Ideal for early-stage startups and rapid MVP delivery.",
        "url": "https://nuvexora.com/pricing#pricing-plans",
      },
      {
        "@type": "Offer",
        "name": "Growth Squad",
        "price": "9800.00",
        "priceCurrency": "USD",
        "description": "Dedicated cross-functional engineering pod for scaling SaaS and AI products.",
        "url": "https://nuvexora.com/pricing#pricing-plans",
      },
      {
        "@type": "Offer",
        "name": "Enterprise Scale",
        "price": "19500.00",
        "priceCurrency": "USD",
        "description": "Mission-critical architecture, compliance hardening, and 24/7 SLAs.",
        "url": "https://nuvexora.com/pricing#pricing-plans",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <PricingInteractiveView />
    </>
  );
}
