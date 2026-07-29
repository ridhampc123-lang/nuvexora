"use client";

import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { 
  Search, 
  Compass, 
  Code2, 
  BrainCircuit, 
  ShieldCheck, 
  Rocket 
} from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Discovery & Architecture",
    description: "Deep dive into your business objectives, compliance requirements, user flows, and high-level system topology.",
    icon: Search,
  },
  {
    step: "02",
    title: "Design System & Prototyping",
    description: "Creating interactive, high-fidelity UI design systems, micro-interactions, and user test prototypes.",
    icon: Compass,
  },
  {
    step: "03",
    title: "Agile Engineering Sprints",
    description: "Iterative production coding using Next.js 15, strict TypeScript, microservices, and continuous integration.",
    icon: Code2,
  },
  {
    step: "04",
    title: "AI Integration & Data Pipelines",
    description: "Deploying custom neural models, vector search indexes, and automated data pipelines.",
    icon: BrainCircuit,
  },
  {
    step: "05",
    title: "Security & Load Audits",
    description: "Exhaustive penetration testing, SOC2 compliance checks, automated unit testing, and load stress testing.",
    icon: ShieldCheck,
  },
  {
    step: "06",
    title: "Deployment & 24/7 SLA Support",
    description: "Zero-downtime multi-region cloud deployment backed by continuous monitoring and dedicated SLA teams.",
    icon: Rocket,
  },
];

export function ProcessSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background text-foreground relative overflow-hidden">
      <Container size="2xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            Proven Delivery Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How We Execute Enterprise Software
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Our disciplined 6-stage engineering process ensures total transparency, predictable delivery velocity, and uncompromised quality.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="relative bg-slate-50/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-3xl p-6 sm:p-8 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-extrabold text-blue-600/30 dark:text-blue-500/40 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-mono">
                    {item.step}
                  </span>
                  <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}