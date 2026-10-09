"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PRICING_FAQS, PricingFAQItem } from "@/data/pricing-data";

export function PricingFAQ() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<string | null>(PRICING_FAQS[0].id);

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "billing", label: "Billing & Milestones" },
    { id: "contracts", label: "Contracts & IP" },
    { id: "squads", label: "Squads & Velocity" },
    { id: "delivery", label: "Delivery & Warranties" },
  ];

  const filteredFaqs =
    activeCategory === "all"
      ? PRICING_FAQS
      : PRICING_FAQS.filter((faq) => faq.category === activeCategory);

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-16 sm:py-24 bg-background relative" id="pricing-faq">
      <Container size="2xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Commercial Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Everything you need to know about our billing terms, milestone sign-offs, intellectual property, and team onboarding.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaq === faq.id;

            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-border bg-card shadow-xs transition-all duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`size-8 rounded-full border border-border flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400" : "text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-border/40 mt-1 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-14 max-w-xl mx-auto p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-border text-center space-y-3">
          <div className="flex items-center justify-center">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Have a custom procurement or RFP question?
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Our solutions team is happy to review custom MSAs, security questionnaires, and formal procurement workflows.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 underline underline-offset-4"
            >
              Contact Commercial Team
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
