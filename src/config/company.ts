import { siteConfig } from "@/config/site";

export const companyConfig = {
  ...siteConfig,
  legalName: "Nuvexora Technologies Inc.",
  founded: 2026,
  timezone: "UTC",
} as const;