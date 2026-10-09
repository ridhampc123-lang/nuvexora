"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Check, X, Minus, Sparkles, Building2, UserX } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ROI_METRICS } from "@/data/pricing-data";

export function PricingRoiBanner() {
  const comparisonRows = [
    {
      metric: "Time to Ramp-Up & Kickoff",
      nuvexora: "5 – 7 Business Days",
      inHouse: "60 – 90 Days (Hiring Lag)",
      freelancers: "15 – 30 Days (Vetting)",
    },
    {
      metric: "Annual Cost & Overhead",
      nuvexora: "Predictable, All-Inclusive Rate",
      inHouse: "$320k+ (Salaries, Benefits, Taxes, Recruiters)",
      freelancers: "Unpredictable Hourly / Hidden Rework",
    },
    {
      metric: "Architecture & Code Quality",
      nuvexora: "Senior Leads + Strict TypeScript & CI/CD",
      inHouse: "Dependent on Individual Hires",
      freelancers: "Fragmented, Often Inconsistent",
    },
    {
      metric: "Management & Governance",
      nuvexora: "Autonomous Delivery Lead + Jira/Linear",
      inHouse: "Heavy In-House Management Required",
      freelancers: "Constant Micro-Management",
    },
    {
      metric: "Developer Churn & Continuity",
      nuvexora: "Zero Interruption Guarantee (Immediate Swap)",
      inHouse: "High Resignation & Retention Risk",
      freelancers: "Frequent Project Abandonment",
    },
    {
      metric: "IP Ownership & Strict NDA",
      nuvexora: "100% Day-One IP Assignment",
      inHouse: "Standard Employment",
      freelancers: "Contractual Risks & Dispersed IP",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background relative overflow-hidden" id="roi-analysis">
      <Container size="2xl">
        {/* Metric Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {ROI_METRICS.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-900/60 border border-border shadow-card flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                  {item.metric}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                  {item.label}
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Economic Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            The Nuvexora Squad Advantage
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            See how partnering with a dedicated cross-functional pod compares against recruiting an in-house team or managing dispersed freelancers.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-slate-50/80 dark:bg-slate-900/80">
                  <th className="p-5 sm:p-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-2/5">
                    Evaluation Criteria
                  </th>
                  <th className="p-5 sm:p-6 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 w-2/5">
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      Nuvexora Squad
                    </span>
                  </th>
                  <th className="p-5 sm:p-6 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 w-1/5">
                    In-House Team
                  </th>
                  <th className="p-5 sm:p-6 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 w-1/5">
                    Freelance Portals
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                {comparisonRows.map((row) => (
                  <tr key={row.metric} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="p-5 sm:p-6 font-semibold text-slate-900 dark:text-white">
                      {row.metric}
                    </td>
                    <td className="p-5 sm:p-6 font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-950/20">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{row.nuvexora}</span>
                      </div>
                    </td>
                    <td className="p-5 sm:p-6 text-slate-600 dark:text-slate-400">
                      {row.inHouse}
                    </td>
                    <td className="p-5 sm:p-6 text-slate-500 dark:text-slate-400">
                      {row.freelancers}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </section>
  );
}
