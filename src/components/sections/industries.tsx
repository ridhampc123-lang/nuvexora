"use client";

import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { 
  Landmark, 
  Stethoscope, 
  ShoppingBag, 
  Truck, 
  Cpu, 
  Globe2,
  ArrowUpRight
} from "lucide-react";

const industries = [
  {
    title: "Fintech & Banking",
    description: "PCI-DSS compliant payment gateways, algorithmic trading platforms, and automated fraud detection systems.",
    icon: Landmark,
    metric: "$4.2B+ Processed",
    color: "from-blue-500/10 via-indigo-500/5 to-transparent",
  },
  {
    title: "Healthcare & MedTech",
    description: "HIPAA compliant telehealth systems, electronic health records, and AI diagnostic imaging pipelines.",
    icon: Stethoscope,
    metric: "HIPAA & GDPR Ready",
    color: "from-cyan-500/10 via-blue-500/5 to-transparent",
  },
  {
    title: "SaaS & Scaleups",
    description: "Multi-tenant cloud platforms, automated recurring billing, and scalable microservice architectures.",
    icon: Globe2,
    metric: "10M+ Active Users",
    color: "from-indigo-500/10 via-sky-500/5 to-transparent",
  },
  {
    title: "E-Commerce & Retail",
    description: "Headless commerce, real-time inventory synchronization, and personalized AI product recommendations.",
    icon: ShoppingBag,
    metric: "Sub-second Checkout",
    color: "from-sky-500/10 via-blue-500/5 to-transparent",
  },
  {
    title: "Logistics & Supply Chain",
    description: "Real-time IoT fleet tracking, predictive route optimization, and automated warehouse management.",
    icon: Truck,
    metric: "35% Cost Reduction",
    color: "from-blue-600/10 via-indigo-500/5 to-transparent",
  },
  {
    title: "AI & Deep Technology",
    description: "Vector database integration, fine-tuned neural models, and high-throughput inference API clusters.",
    icon: Cpu,
    metric: "15ms Inference",
    color: "from-cyan-600/10 via-blue-500/5 to-transparent",
  },
];

export function IndustriesSection() {
  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-slate-50/70 dark:bg-slate-950/60 border-y border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
      <Container size="2xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            Industry Solutions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tailored Engineering For High-Stakes Verticals
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            We understand the strict regulatory requirements, security standards, and architectural demands of modern industry leaders.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={ind.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${ind.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full bg-blue-50/80 dark:bg-blue-950/80 border border-blue-200/50 dark:border-blue-800/50">
                      {ind.metric}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {ind.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                    {ind.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pt-2">
                  <span>Explore Industry Architecture</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
