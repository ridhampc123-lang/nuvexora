import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSettings extends Document {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  seoTitle: string;
  seoDescription: string;
  maintenanceMode: boolean;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, default: "Nuvexora Technologies" },
    tagline: { type: String, default: "Innovate. Build. Elevate." },
    contactEmail: { type: String, default: "contact@nuvexora.com" },
    contactPhone: { type: String, default: "+1 (800) 555-0199" },
    address: { type: String, default: "San Francisco, CA & London, UK" },
    socialLinks: {
      linkedin: { type: String, default: "https://linkedin.com/company/nuvexora" },
      github: { type: String, default: "https://github.com/nuvexora" },
      twitter: { type: String, default: "https://twitter.com/nuvexora" },
    },
    seoTitle: { type: String, default: "Nuvexora Technologies — Enterprise Digital Engineering" },
    seoDescription: { type: String, default: "Deliver world-class software, AI, cloud, and digital solutions." },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
