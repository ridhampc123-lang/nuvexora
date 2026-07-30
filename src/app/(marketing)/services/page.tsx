import type { Metadata } from "next";
import { ServicesHero } from "@/components/sections/services/services-hero";
import { ServicesCategories } from "@/components/sections/services/services-categories";
import { DetailedServicesOverview } from "@/components/sections/services/detailed-services-overview";
import { TechStackShowcase } from "@/components/sections/services/tech-stack-showcase";
import { DevelopmentProcessTimeline } from "@/components/sections/services/development-process-timeline";
import { WhyChooseNuvexora } from "@/components/sections/services/why-choose-nuvexora";
import { IndustriesGrid } from "@/components/sections/services/industries-grid";
import { ServiceCaseStudies } from "@/components/sections/services/service-case-studies";
import { ServicesFAQ } from "@/components/sections/services/services-faq";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { CTA } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Enterprise Services & Engineering Capabilities | Nuvexora Technologies",
  description:
    "Explore Nuvexora Technologies' full spectrum of enterprise capabilities: Next.js Web Development, Mobile Apps, Custom AI & RAG Solutions, SaaS Platforms, Cloud DevOps, UI/UX Design, and 24/7 SLA Maintenance.",
  keywords: [
    "Enterprise Web Development",
    "Next.js Development Agency",
    "Custom AI Solutions",
    "Mobile App Development",
    "Cloud DevOps Engineering",
    "SaaS Development",
    "UI UX Design Systems",
    "Enterprise Software",
    "Nuvexora Technologies Services"
  ],
  alternates: {
    canonical: "https://nuvexora.com/services"
  },
  openGraph: {
    title: "Enterprise Digital Product Services | Nuvexora Technologies",
    description: "Architecting high-performance web platforms, bespoke AI neural engines, cloud infrastructure, and mobile applications for global enterprises.",
    url: "https://nuvexora.com/services",
    siteName: "Nuvexora Technologies",
    type: "website"
  }
};

export default function ServicesPage() {
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Nuvexora Technologies Enterprise Services",
    "description": "Full-spectrum digital product delivery including Web, Mobile, AI, Cloud, SaaS, UI/UX, and Enterprise Systems.",
    "url": "https://nuvexora.com/services",
    "itemListElement": [
      { "@type": "SiteNavigationElement", "position": 1, "name": "Web Development", "url": "https://nuvexora.com/services/web-development" },
      { "@type": "SiteNavigationElement", "position": 2, "name": "Mobile App Development", "url": "https://nuvexora.com/services/mobile-development" },
      { "@type": "SiteNavigationElement", "position": 3, "name": "AI Solutions & Neural Engineering", "url": "https://nuvexora.com/services/ai-solutions" },
      { "@type": "SiteNavigationElement", "position": 4, "name": "SaaS Product Development", "url": "https://nuvexora.com/services/saas-development" },
      { "@type": "SiteNavigationElement", "position": 5, "name": "Enterprise Software Modernization", "url": "https://nuvexora.com/services/enterprise-software" },
      { "@type": "SiteNavigationElement", "position": 6, "name": "Cloud Architecture & DevOps", "url": "https://nuvexora.com/services/cloud-devops" },
      { "@type": "SiteNavigationElement", "position": 7, "name": "UI/UX Design & Design Systems", "url": "https://nuvexora.com/services/ui-ux" },
      { "@type": "SiteNavigationElement", "position": 8, "name": "Digital Marketing & Growth", "url": "https://nuvexora.com/services/digital-marketing" }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      {/* 1. Hero */}
      <ServicesHero />

      {/* 2. Service Categories */}
      <ServicesCategories />

      {/* 3. Detailed Services Overview */}
      <DetailedServicesOverview />

      {/* 4. Technology Stack */}
      <TechStackShowcase />

      {/* 5. Development Process */}
      <DevelopmentProcessTimeline />

      {/* 6. Why Choose Nuvexora */}
      <WhyChooseNuvexora />

      {/* 7. Industries We Serve */}
      <IndustriesGrid />

      {/* 8. Case Studies */}
      <ServiceCaseStudies />

      {/* 9. Frequently Asked Questions */}
      <ServicesFAQ />

      {/* 11. Testimonials */}
      <TestimonialsSection />

      {/* 12. Final CTA */}
      <CTA />
    </>
  );
}