export function buildCanonicalUrl(pathname = "/") {
  return pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
}

export function getStructuredData(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    description,
    url,
  };
}