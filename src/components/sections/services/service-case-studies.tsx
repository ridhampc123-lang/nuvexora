"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Briefcase, ArrowRight, TrendingUp, CheckCircle2 } from "lucide-react";

interface CaseStudyItem {
  id: string;
  title: string;
  client: string;
  industry: string;
  summary: string;
  metrics: string[];
  before: string;
  after: string;
  technologies: string[];
  href: string;
}

const caseStudies: CaseStudyItem[] = [
  {
    id: "cs-1",
    title: "Global SaaS Platform Architecture & Edge Scaling",
    client: "Veloce Cloud Systems",
    industry: "Enterprise SaaS",
    summary: "Re-engineered a monolithic legacy analytics platform into a high-throughput Next.js 15 edge application handling 1M+ daily active sessions.",
    metrics: ["4.2x Faster Page Loading", "+240% User Signups", "99.99% Uptime SLA"],
    before: "Slow legacy web application suffering from 4.8s initial page load time and 35% user sign-up drop-off.",
    after: "Next.js App Router architecture deployed across Vercel Edge with sub-350ms TTFB and instantaneous rendering.",
    technologies: ["Next.js 15", "TypeScript", "Tailwind CSS", "PostgreSQL", "Vercel Edge"],
    href: "/case-studies"
  },
  {
    id: "cs-2",
    title: "Enterprise Knowledge Base AI RAG Assistant",
    client: "OmniGlobal Consulting",
    industry: "Management Consulting",
    summary: "Built a private vector search RAG pipeline ingesting 50,000+ proprietary PDF case studies to give consultants immediate cited answers.",
    metrics: ["90% Faster Document Search", "99.1% Verified Accuracy", "$450k Annual Cost Savings"],
    before: "Consultants spending 12+ hours weekly manually searching through unindexed internal PDF archives.",
    after: "Private Claude 3.5 RAG pipeline with pgvector semantic retrieval providing accurate page-level citations in under 2 seconds.",
    technologies: ["Python", "FastAPI", "pgvector", "Claude 3.5", "Next.js"],
    href: "/case-studies"
  },
  {
    id: "cs-3",
    title: "Headless E-Commerce Conversion Optimization",
    client: "Aura Luxury Apparel",
    industry: "Direct-to-Consumer Fashion",
    summary: "Decoupled monolithic storefront into a Next.js 15 headless architecture connected to Shopify Plus API and Algolia search.",
    metrics: ["+45% Mobile Revenue", "0.4s Product Page Load", "28% Reduction in Cart Abandonment"],
    before: "Monolithic Shopify theme taking 5.2s to render on mobile devices, resulting in severe cart abandonment.",
    after: "Sub-second Next.js headless storefront with 1-click Shop Pay and Algolia instant product search.",
    technologies: ["Next.js 15", "Shopify GraphQL API", "Algolia", "Tailwind CSS"],
    href: "/case-studies"
  }
];

export function ServiceCaseStudies() {
  return (
    <section className="py-16 sm:py-24 bg-background text-foreground relative border-t border-slate-200/60 dark:border-slate-800/60">
      <Container size="2xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Proven Client Impact
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Featured Enterprise Case Studies
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            Real performance benchmarks, tangible ROI metrics, and before-and-after transformations delivered for market leaders.
          </p>
        </div>

        {/* Case Studies Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {caseStudies.map((cs) => (
            <div
              key={cs.id}
              className="flex flex-col justify-between p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-6 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Header Tag & Client */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {cs.industry}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {cs.client}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {cs.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cs.summary}
                </p>

                {/* Metrics Badges */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {cs.metrics.map((m) => (
                    <div key={m} className="p-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-center">
                      <div className="text-xs font-extrabold text-blue-600 dark:text-blue-400 leading-tight">{m}</div>
                    </div>
                  ))}
                </div>

                {/* Before vs After */}
                <div className="space-y-2 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30">
                    <span className="font-bold text-rose-700 dark:text-rose-400">Before: </span>
                    <span className="text-slate-600 dark:text-slate-300">{cs.before}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">After: </span>
                    <span className="text-slate-600 dark:text-slate-300">{cs.after}</span>
                  </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cs.technologies.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Link CTA */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href={cs.href}
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all"
                >
                  <span>Read Full Case Study</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
