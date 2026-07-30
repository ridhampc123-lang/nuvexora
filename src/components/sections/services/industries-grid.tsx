"use client";

import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import {
  HeartPulse,
  GraduationCap,
  Building,
  Landmark,
  ShoppingBag,
  Factory,
  Plane,
  Truck,
  Building2,
  Rocket,
  Globe2,
} from "lucide-react";

interface IndustryItem {
  name: string;
  icon: React.ElementType;
  description: string;
  solutions: string[];
}

const industries: IndustryItem[] = [
  {
    name: "Healthcare & Telehealth",
    icon: HeartPulse,
    description: "HIPAA-compliant telemedicine platforms, EHR integration, and medical AI diagnostic tools.",
    solutions: ["HIPAA-Compliant Patient Portals", "Medical Image AI Diagnostics", "EHR/EMR Interoperability APIs"]
  },
  {
    name: "FinTech & Financial Services",
    icon: Landmark,
    description: "SOC2-secure digital banking apps, payment gateways, and high-frequency trading ledgers.",
    solutions: ["Biometric Mobile Banking Apps", "Stripe & Plaid Payment APIs", "Double-Entry Ledger Systems"]
  },
  {
    name: "Real Estate & PropTech",
    icon: Building,
    description: "Custom property management platforms, automated tenant portals, and 3D virtual tour engines.",
    solutions: ["MLS & RETS Data Pipelines", "Tenant Billing & Lease CRM", "3D Interactive Property Viewers"]
  },
  {
    name: "EdTech & E-Learning",
    icon: GraduationCap,
    description: "Scalable Learning Management Systems (LMS), live video classrooms, and student analytics.",
    solutions: ["LTI-Compliant LMS Platforms", "Real-Time Video Classroom WebSockets", "AI Automated Grading Engines"]
  },
  {
    name: "Retail & E-Commerce",
    icon: ShoppingBag,
    description: "Headless Next.js storefronts, multi-currency checkouts, and AI product recommendation engines.",
    solutions: ["Next.js 15 Headless Storefronts", "1-Click Shop Pay / Apple Pay", "Algolia Instant Search Integration"]
  },
  {
    name: "Manufacturing & Industry 4.0",
    icon: Factory,
    description: "Custom ERP modules, IoT assembly line telemetry, and automated Bill of Materials (BOM).",
    solutions: ["Real-Time IoT Sensor Dashboards", "Barcode Scanner Mobile Apps", "Automated Supplier PO Triggers"]
  },
  {
    name: "Logistics & Supply Chain",
    icon: Truck,
    description: "GPS fleet tracking software, warehouse inventory management, and route optimization algorithms.",
    solutions: ["Real-Time GPS Fleet Telemetry", "Warehouse Inventory Barcode Sync", "AI Logistics Route Optimization"]
  },
  {
    name: "Travel & Hospitality",
    icon: Plane,
    description: "High-volume booking engines, GDS distribution APIs, and guest loyalty portals.",
    solutions: ["Amadeus & Sabre Flight APIs", "Hotel Property Booking Engines", "Dynamic Pricing Algorithms"]
  },
  {
    name: "Government & Public Sector",
    icon: Building2,
    description: "Accessible, zero-trust web portals meeting strict compliance and FedRAMP security standards.",
    solutions: ["WCAG 2.1 AAA Accessibility", "Zero-Trust SAML/Okta Auth", "FedRAMP Security Architecture"]
  },
  {
    name: "High-Growth Startups",
    icon: Rocket,
    description: "Rapid 60-day MVP development, investor pitch prototypes, and scalable SaaS infrastructure.",
    solutions: ["60-Day Turnkey MVP Delivery", "Investor Demo Prototypes", "Next.js & Supabase Stack"]
  }
];

export function IndustriesGrid() {
  return (
    <section className="py-8 sm:py-12 bg-slate-50/50 dark:bg-slate-900/40 relative">
      <Container size="2xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <Globe2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Domain Expertise
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Industries We Transform
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            Deep domain knowledge paired with specialized compliance frameworks tailored to your sector's requirements.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-6">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {ind.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {ind.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                  {ind.solutions.slice(0, 2).map((sol) => (
                    <div key={sol} className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                      <span className="w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                      <span className="truncate">{sol}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
