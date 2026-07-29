"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { PricingCard } from "./pricing-card";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState<boolean>(true);

  const plans = [
    {
      name: "Startup Sprint",
      price: isAnnual ? "$4,900" : "$5,800",
      period: isAnnual ? "/ milestone" : "/ milestone",
      description: "Ideal for early-stage startups needing rapid MVP development or core platform build.",
      features: [
        "Dedicated Tech Lead & 2 Senior Engineers",
        "Next.js 15 & React 19 Frontend",
        "REST API & Database Setup",
        "4-Week Rapid Sprint Delivery",
        "Standard SLA & 30-Day QA Guarantee"
      ],
      ctaText: "Start MVP Sprint",
      href: "/book-consultation?plan=startup"
    },
    {
      name: "Scaleup Core",
      price: isAnnual ? "$12,500" : "$14,500",
      period: "/ month",
      description: "Dedicated full-stack team for scaling platforms with custom AI models and cloud infra.",
      isPopular: true,
      features: [
        "Dedicated Team (5 Senior Engineers + UI Lead)",
        "Custom AI Model Fine-Tuning & Vector DB",
        "AWS / GCP Multi-Region Cloud Infra",
        "2-Week Agile Delivery Cycles",
        "SOC2 & ISO Compliance Support",
        "99.99% Guaranteed SLA & 24/7 Monitoring"
      ],
      ctaText: "Hire Scaleup Team",
      href: "/book-consultation?plan=scaleup"
    },
    {
      name: "Enterprise Custom",
      price: "Custom",
      period: "/ engagement",
      description: "Tailored software architecture for Fortune 500 enterprises with legacy modernization.",
      features: [
        "Unlimited Senior Engineers & Solutions Architect",
        "Legacy Codebase Modernization",
        "Bespoke Neural AI & RAG Engine",
        "Dedicated On-Premise / Hybrid Cloud",
        "99.999% SLA with 15-Minute Incident Response",
        "Executive Strategy & CTO Consultation"
      ],
      ctaText: "Contact Enterprise Sales",
      href: "/contact?type=enterprise"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-50/60 dark:bg-slate-950/60 border-y border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
      <Container size="2xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            Transparent Investment
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Predictable Pricing. Zero Surprises.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Flexible milestone pricing and dedicated monthly engineering retainers tailored for your scale.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`text-xs sm:text-sm font-semibold ${!isAnnual ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
              Monthly Retainer
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-800 p-1 transition-colors duration-300 focus:outline-none"
            >
              <div
                className={`w-6 h-6 rounded-full bg-blue-600 shadow-md transition-transform duration-300 ${
                  isAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs sm:text-sm font-semibold ${isAnnual ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
              Annual Engagement <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800/80">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              description={plan.description}
              features={plan.features}
              isPopular={plan.isPopular}
              ctaText={plan.ctaText}
              href={plan.href}
              index={idx}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}