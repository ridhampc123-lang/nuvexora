"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { TestimonialsCard } from "./testimonials-card";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const hasTestimonials = false; // Temporarily hardcoded to false until real DB integration

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-background text-foreground relative overflow-hidden">
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

        {hasTestimonials ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Real testimonials will be mapped here */}
          </div>
        ) : (
          <div className="w-full p-12 flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl text-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-2">New client testimonials are currently being curated.</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">We prioritize client confidentiality. Public endorsements will appear here soon.</p>
          </div>
        )}
      </Container>
    </section>
  );
}

export const Testimonials = TestimonialsSection;