import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const routes = [
  "/",
  "/about",
  "/services",
  "/technologies",
  "/industries",
  "/portfolio",
  "/case-studies",
  "/careers",
  "/blog",
  "/contact",
  "/book-consultation",
  "/privacy-policy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
  }));
}