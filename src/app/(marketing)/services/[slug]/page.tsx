import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, getAllServiceSlugs } from "@/data/services-data";
import { ServiceDetailView } from "@/components/sections/services/service-detail-view";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | Nuvexora Technologies",
      description: "The requested enterprise service could not be found."
    };
  }

  return {
    title: `${service.name} | Nuvexora Technologies`,
    description: service.description,
    keywords: [
      service.name,
      service.tagline,
      service.category,
      ...service.targetIndustries,
      "Nuvexora Technologies"
    ],
    alternates: {
      canonical: `https://nuvexora.com/services/${service.slug}`
    },
    openGraph: {
      title: `${service.name} — ${service.tagline}`,
      description: service.description,
      url: `https://nuvexora.com/services/${service.slug}`,
      siteName: "Nuvexora Technologies",
      type: "article"
    }
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // Generate Service Schema JSON-LD
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "serviceType": service.category,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "Nuvexora Technologies",
      "url": "https://nuvexora.com"
    },
    "areaServed": "Global",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${service.name} Deliverables`,
      "itemListElement": service.deliverables.map((d, idx) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": d
        },
        "position": idx + 1
      }))
    }
  };

  // Generate FAQ Schema JSON-LD
  const faqSchema = service.faqs && service.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": service.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // Generate Breadcrumb Schema JSON-LD
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nuvexora.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://nuvexora.com/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": service.name,
        "item": `https://nuvexora.com/services/${service.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ServiceDetailView service={service} />
    </>
  );
}
