"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Zap,
  Clock,
  Code,
  Layers,
  ChevronDown,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { servicesData } from "@/data/services-data";

export function DetailedServicesOverview() {
  const featuredServices = servicesData.filter((s) => s.featured);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>(featuredServices[0]?.slug || "web-development");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const activeService = servicesData.find((s) => s.slug === selectedServiceSlug) || featuredServices[0];

  return (
    <section className="py-8 sm:py-12 bg-background text-foreground border-t border-slate-200/60 dark:border-slate-800/60">
      <Container size="2xl">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Deep Dive Breakdown
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Detailed Service Blueprint & Architecture
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            Select a service to review its business impact, technical capabilities, process, deliverables, and estimated timelines.
          </p>

          {/* Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {featuredServices.map((service) => (
              <button
                key={service.slug}
                onClick={() => {
                  setSelectedServiceSlug(service.slug);
                  setOpenFaqIndex(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  selectedServiceSlug === service.slug
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
                    : "bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80"
                }`}
              >
                {service.name}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Card View */}
        {activeService && (
          <motion.div
            key={activeService.slug}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-10"
          >
            {/* Header / Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start border-b border-slate-100 dark:border-slate-800/80 pb-8">
              <div className="lg:col-span-2 space-y-3">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {activeService.tagline}
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {activeService.name}
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {activeService.overview}
                </p>
              </div>

              {/* Stats Box */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Estimated Delivery
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <Clock className="w-3.5 h-3.5" />
                    {activeService.estimatedTimeline}
                  </span>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Key Performance Metrics
                  </span>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {activeService.stats?.slice(0, 4).map((st) => (
                      <div key={st.label} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-center">
                        <div className="text-base font-extrabold text-blue-600 dark:text-blue-400">{st.value}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">{st.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 2: Business Problems Solved & Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Business Challenges Solved */}
              <div className="space-y-4 p-6 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>Business Problems Solved</span>
                </div>
                <ul className="space-y-3">
                  {activeService.businessChallenges.map((ch) => (
                    <li key={ch.title} className="space-y-0.5">
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{ch.title}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">{ch.description}</div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Business Benefits */}
              <div className="space-y-4 p-6 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-lg">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Tangible Business Benefits</span>
                </div>
                <ul className="space-y-3">
                  {activeService.benefits.map((b) => (
                    <li key={b.title} className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{b.title}</span>
                        {b.metric && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                            {b.metric}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">{b.description}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Grid 3: Tech Stack & Key Deliverables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* Technology Stack */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
                  <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Technology Stack</span>
                </div>
                <div className="space-y-3">
                  {activeService.technologies.map((tGroup) => (
                    <div key={tGroup.category} className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {tGroup.category}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tGroup.items.map((item) => (
                          <span
                            key={item}
                            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Deliverables */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
                  <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Client Deliverables</span>
                </div>
                <ul className="space-y-2.5">
                  {activeService.deliverables.map((deliv) => (
                    <li key={deliv} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Service Process Timeline */}
            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800/80">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Development Process & Governance
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {activeService.developmentProcess.map((step) => (
                  <div
                    key={step.step}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 space-y-1"
                  >
                    <div className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      Step 0{step.step}
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{step.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{step.duration}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Service FAQ */}
            {activeService.faqs && activeService.faqs.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeService.name} FAQs
                </h4>
                <div className="space-y-2">
                  {activeService.faqs.map((faq, fIdx) => (
                    <div
                      key={faq.question}
                      className="rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === fIdx ? null : fIdx)}
                        className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openFaqIndex === fIdx ? "rotate-180" : ""}`} />
                      </button>
                      {openFaqIndex === fIdx && (
                        <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card CTA Footer */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xl font-bold">Ready to implement {activeService.name}?</h4>
                <p className="text-xs text-blue-100 font-normal">Schedule a strategy call to align requirements, timeline, and scope.</p>
              </div>
              <Link
                href={`/services/${activeService.slug}`}
                className="px-6 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm transition-all whitespace-nowrap inline-flex items-center gap-2 shadow-md"
              >
                <span>View Full {activeService.name} Page</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
