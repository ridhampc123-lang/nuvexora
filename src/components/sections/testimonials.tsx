"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { TestimonialsCard } from "./testimonials-card";
import { Star } from "lucide-react";

const testimonialsData = [
  {
    quote: "Nuvexora delivered our entire AI trading system 3 weeks ahead of schedule. Their senior engineers wrote clean, SOC2-compliant code that handled $1B+ in transactions on day one without a single hiccup.",
    author: "Marcus Vance",
    title: "Chief Technology Officer",
    company: "Veloce Financial",
    avatarText: "MV"
  },
  {
    quote: "Finding an engineering agency that understands both cutting-edge Next.js architecture and enterprise HIPAA security was impossible until we partnered with Nuvexora. Truly a 10/10 experience.",
    author: "Dr. Elena Rostova",
    title: "VP of Engineering",
    company: "Apex Healthcare",
    avatarText: "ER"
  },
  {
    quote: "Their team built our custom predictive logistics engine from scratch. We reduced fuel consumption by 35% across 12,000 active vehicles within the first quarter of deployment.",
    author: "David Chen",
    title: "Head of Infrastructure",
    company: "OmniLogistics",
    avatarText: "DC"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background text-foreground relative overflow-hidden">
      <Container size="2xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            Client Endorsements
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Trusted By Engineering VPs & Founders
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            See why leading technology companies rely on Nuvexora for high-stakes software development.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonialsData.map((item, idx) => (
            <TestimonialsCard
              key={item.author}
              quote={item.quote}
              author={item.author}
              title={item.title}
              company={item.company}
              avatarText={item.avatarText}
              index={idx}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

export const Testimonials = TestimonialsSection;