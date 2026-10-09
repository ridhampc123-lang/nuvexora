"use client";

import React from "react";
import { ShieldCheck, RefreshCw, FileText, Lock, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";

export function PricingGuarantees() {
  const guarantees = [
    {
      title: "100% Day-One IP Transfer",
      icon: ShieldCheck,
      description:
        "Every single line of code, Figma artboard, documentation asset, and deployment key belongs exclusively to your company under strict legal assignment.",
      tag: "Complete Ownership",
    },
    {
      title: "14-Day Risk-Free Trial",
      icon: RefreshCw,
      description:
        "Test our engineering velocity in real time. If during the first two weeks you aren't completely satisfied with code quality or sprint communication, cancel with a 100% refund.",
      tag: "Zero Risk",
    },
    {
      title: "Zero Hidden Surcharges",
      icon: FileText,
      description:
        "No synthetic pricing, surprise hosting markups, or vague billing increments. All agreements feature guaranteed price caps and itemized deliverables.",
      tag: "Transparent Terms",
    },
    {
      title: "Mutual NDA & Enterprise Security",
      icon: Lock,
      description:
        "We sign mutual non-disclosure agreements prior to technical discovery. All developer machines and private repositories adhere to SOC2 and OWASP Top 10 standards.",
      tag: "Confidentiality",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/60 dark:bg-slate-950/40 border-y border-border/80 relative" id="guarantees">
      <Container size="2xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Enterprise Guarantees</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Our Commitments to Every Client
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            We de-risk software engineering by holding ourselves accountable to contractually guaranteed benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.title}
                className="p-7 rounded-3xl bg-card border border-border shadow-card flex flex-col justify-between hover:shadow-floating hover:-translate-y-1 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-800/50 px-2 py-0.5 rounded-full">
                      {g.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {g.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {g.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
