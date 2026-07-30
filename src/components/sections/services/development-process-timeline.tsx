"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Search, Compass, Palette, Code, CheckCircle, Rocket, ShieldCheck, Clock } from "lucide-react";

interface ProcessStep {
  number: string;
  name: string;
  icon: React.ElementType;
  timeline: string;
  summary: string;
  deliverables: string[];
}

const processSteps: ProcessStep[] = [
  {
    number: "01",
    name: "Discovery & Alignment",
    icon: Search,
    timeline: "Week 1 - 2",
    summary: "Deep-dive technical audit, domain modeling, requirement scoping, and KPI definition.",
    deliverables: ["Product Specs Document", "Technical Risk Assessment", "Architecture Blueprint"]
  },
  {
    number: "02",
    name: "Strategic Planning",
    icon: Compass,
    timeline: "Week 2 - 3",
    summary: "Defining database schemas, microservice boundaries, sprint milestones, and team allocation.",
    deliverables: ["Database Entity Relationship Map", "API Endpoint Specs", "Sprint Roadmap"]
  },
  {
    number: "03",
    name: "UI/UX System Design",
    icon: Palette,
    timeline: "Week 3 - 5",
    summary: "Crafting atomic design systems, WCAG AA accessible components, and interactive prototypes.",
    deliverables: ["Figma Design System", "Interactive Clickable Prototype", "Design Tokens"]
  },
  {
    number: "04",
    name: "Agile Engineering",
    icon: Code,
    timeline: "Week 5 - 12",
    summary: "Bi-weekly sprint iterations building type-safe frontend components, backend APIs, and microservices.",
    deliverables: ["Production Code Repository", "Automated Unit/Integration Tests", "Staging Preview Link"]
  },
  {
    number: "05",
    name: "QA & Security Audit",
    icon: CheckCircle,
    timeline: "Week 11 - 13",
    summary: "End-to-end regression testing, SOC2 security audits, k6 load testing, and accessibility checks.",
    deliverables: ["Security Penetration Report", "Load Test Performance Results", "WCAG Audit"]
  },
  {
    number: "06",
    name: "Production Deployment",
    icon: Rocket,
    timeline: "Week 13 - 14",
    summary: "Zero-downtime DNS cutover, Terraform infrastructure activation, and real-time monitoring.",
    deliverables: ["Live Production Environment", "Terraform IaC Repo", "DNS Cutover Checklist"]
  },
  {
    number: "07",
    name: "SLA Support & Evolution",
    icon: ShieldCheck,
    timeline: "Ongoing",
    summary: "24/7 proactive telemetry monitoring, automated security patching, and ongoing feature enhancement.",
    deliverables: ["24/7 PagerDuty Channel", "Monthly Uptime Reports", "Continuous Feature Iterations"]
  }
];

export function DevelopmentProcessTimeline() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section className="py-8 sm:py-12 bg-background text-foreground relative overflow-hidden border-t border-slate-200/60 dark:border-slate-800/60">
      <Container size="2xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            7-Phase Delivery Governance
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our Enterprise Engineering Process
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            A transparent, sprint-based methodology that guarantees predictable delivery, bank-grade security, and zero downtime cutovers.
          </p>
        </div>

        {/* Process Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {processSteps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`p-3.5 rounded-2xl flex flex-col items-center text-center space-y-2 transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className={`p-2 rounded-xl ${isActive ? "bg-white/20 text-white" : "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-80">{step.number}</div>
                  <div className="text-xs font-bold leading-snug line-clamp-1">{step.name}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Details Card */}
        {processSteps[activeStep] && (
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center"
          >
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                  {processSteps[activeStep].number}
                </span>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {processSteps[activeStep].name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    Timeline: {processSteps[activeStep].timeline}
                  </span>
                </div>
              </div>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {processSteps[activeStep].summary}
              </p>
            </div>

            {/* Deliverables Column */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Phase Key Deliverables
              </h4>
              <ul className="space-y-2">
                {processSteps[activeStep].deliverables.map((deliv) => (
                  <li key={deliv} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
