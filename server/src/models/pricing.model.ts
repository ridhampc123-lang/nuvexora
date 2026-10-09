import mongoose, { Schema, Document } from "mongoose";

export interface IPricingFeatureCategory {
  category: string;
  items: string[];
}

export interface IPricingPlan extends Document {
  name: string;
  slug: string;
  badge?: string;
  isPopular: boolean;
  isActive: boolean;
  order: number;
  description: string;
  monthlyPriceUSD: number;
  monthlyPriceINR: number;
  fixedPriceUSD: number;
  fixedPriceINR: number;
  annualDiscountPercent: number;
  deliveryTime: string;
  squadComposition: string;
  idealFor: string;
  highlightedFeatures: string[];
  features: IPricingFeatureCategory[];
  ctaText: string;
  ctaHref: string;
  customCurrencies?: Map<string, { monthlyPrice: number; fixedPrice: number }>;
  createdAt: Date;
  updatedAt: Date;
}

const PricingPlanSchema = new Schema<IPricingPlan>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    badge: { type: String, default: "" },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    description: { type: String, required: true },
    monthlyPriceUSD: { type: Number, required: true, default: 0 },
    monthlyPriceINR: { type: Number, required: true, default: 0 },
    fixedPriceUSD: { type: Number, required: true, default: 0 },
    fixedPriceINR: { type: Number, required: true, default: 0 },
    annualDiscountPercent: { type: Number, default: 15 },
    deliveryTime: { type: String, default: "4 to 6 Weeks" },
    squadComposition: { type: String, default: "Fullstack Lead + UI/UX" },
    idealFor: { type: String, default: "" },
    highlightedFeatures: [{ type: String }],
    features: [
      {
        category: { type: String, required: true },
        items: [{ type: String }],
      },
    ],
    ctaText: { type: String, default: "Get Started" },
    ctaHref: { type: String, default: "/book-consultation" },
    customCurrencies: {
      type: Map,
      of: new Schema({
        monthlyPrice: { type: Number, default: 0 },
        fixedPrice: { type: Number, default: 0 },
      }, { _id: false }),
      default: {},
    },
  },
  { timestamps: true }
);

export const PricingPlan = mongoose.model<IPricingPlan>("PricingPlan", PricingPlanSchema);
