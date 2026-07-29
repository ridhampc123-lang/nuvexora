"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { DollarSign, ShieldAlert, CheckCircle2, FileText, Users, ArrowRight } from "lucide-react";

export function PricingPhilosophy() {
  const models = [
    {
      title: "Fixed-Scope Engagement",
      icon: FileText,
      description: "Ideal for well-defined MVPs, specific refactoring projects, or standalone modules with clear functional specifications.",
      features: [
        "Guaranteed price cap with zero scope bleed",
        "Clear milestone-based deliverable timeline",
        "Comprehensive QA & acceptance testing sign-off"
      ]
    },
    {
      title: "Dedicated Engineering Squad",
      icon: Users,
      description: "Ideal for ongoing enterprise product evolution, scaling microservices, and dedicated multi-sprint roadmap execution.",
      features: [
        "Dedicated full-stack developers, UI designers & DevOps",
        "Flexible bi-weekly sprint backlog prioritization",
        "Direct integration into your internal Slack & Jira"
      ]
    }
  ];

  const steps = [
    { step: "01", title: "Technical Scope Audit", desc: "We review your functional specs, wireframes, and database requirements in a free 45-minute discovery call." },
    { step: "02", title: "Transparent Cost Breakdown", desc: "We provide an itemized proposal mapping developer hours, milestones, infrastructure costs, and SLAs." },
    { step: "03", title: "Fixed Cap & Milestone Billing", desc: "Payments are tied strictly to verifiable project milestones and client sign-off, protecting your capital." }
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200/60 dark:border-slate-800/60">
      <Container size="2xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <DollarSign className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Transparent Financial Governance
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our Pricing & Estimation Philosophy
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            No gimmick price tags or hidden fees. We provide honest, itemized enterprise estimates backed by guaranteed scope bounds.
          </p>
        </div>

        {/* Why No Fake Prices Alert Box */}
        <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3 mb-12">
          <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400 font-bold text-base">
            <ShieldAlert className="w-5 h-5" />
            <span>Why We Don't Display Synthetic "Starting at $X,YYY" Prices</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Enterprise software, custom AI models, and cloud architectures cannot be accurately priced with generic rate cards. Every business has unique security requirements, integration complexity, traffic concurrency, and compliance standards. Placing fake price tags leads to bait-and-switch surprises. Instead, we scope your project thoroughly and issue a legally guaranteed fixed proposal.
          </p>
        </div>

        {/* Engagement Models */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {models.map((model) => {
            const Icon = model.icon;
            return (
              <div
                key={model.title}
                className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {model.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {model.description}
                  </p>
                  <ul className="space-y-2 pt-2">
                    {model.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Step Estimation Process */}
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-blue-600 text-white space-y-6 shadow-xl">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold">How Our Estimation Process Works</h3>
            <p className="text-xs text-blue-100 font-normal">From initial discovery call to itemized proposal in 48 hours.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {steps.map((st) => (
              <div key={st.step} className="p-4 rounded-xl bg-white/10 backdrop-blur-sm space-y-2">
                <span className="text-2xl font-black text-blue-200">{st.step}</span>
                <h4 className="text-sm font-bold">{st.title}</h4>
                <p className="text-xs text-blue-100 font-normal leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-xs sm:text-sm hover:bg-blue-50 transition-all shadow-md"
            >
              <span>Explore Detailed Pricing Guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
