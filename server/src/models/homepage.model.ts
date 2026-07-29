import mongoose, { Schema, Document } from "mongoose";

export interface IHomepageContent extends Document {
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  statsProjects: string;
  statsClients: string;
  statsIndustries: string;
  statsSatisfaction: string;
  updatedAt: Date;
}

const HomepageContentSchema = new Schema<IHomepageContent>(
  {
    heroBadge: { type: String, default: "Trusted Technology Partner" },
    heroHeadline: { type: String, default: "Architecting Enterprise Platforms. Engineering Digital Excellence." },
    heroSubheadline: { type: String, default: "High-performance software, cloud architectures, and bespoke AI." },
    statsProjects: { type: String, default: "100+" },
    statsClients: { type: String, default: "50+" },
    statsIndustries: { type: String, default: "10+" },
    statsSatisfaction: { type: String, default: "99%" },
  },
  { timestamps: true }
);

export const HomepageContent = mongoose.model<IHomepageContent>("HomepageContent", HomepageContentSchema);
