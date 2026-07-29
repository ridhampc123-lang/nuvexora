import { siteConfig } from "@/config/site"

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logos/logo.svg`,
  description: siteConfig.description,
  contactPoint: [
    {
      "@type": "ContactPoint",
      email: siteConfig.contactEmail,
      telephone: siteConfig.contactPhone,
      contactType: "customer support",
      areaServed: "Worldwide",
      availableLanguage: ["English"],
    },
  ],
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

function SeoSchema() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </>
  )
}

export { SeoSchema }
