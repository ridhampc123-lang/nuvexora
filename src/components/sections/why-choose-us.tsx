"use client";

import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { 
  Zap, 
  ShieldCheck, 
  Users, 
  Clock, 
  Award, 
  Lock,
  CheckCircle2
} from "lucide-react";

const valueProps = [
  {
    title: "100% Senior Engineering Talent",
    description: "No junior developer hand-offs. Your product is engineered exclusively by staff-level software architects and AI specialists.",
    icon: Users,
  },
  {
    title: "Predictable Transparent Pricing",
    description: "Clear fixed-scope milestones and transparent monthly retainers with zero hidden charges or scope creep surprises.",
    icon: ShieldCheck,
    description2: "Fixed Milestone Guarantees"
  },
  {
    title: "3x Velocity Development Sprints",
    description: "Modular architecture components and automated CI/CD pipelines allow us to ship production features in days, not months.",
    icon: Zap,
  },
  {
    title: "Enterprise Security & SOC2 Compliance",
    description: "Built-in end-to-end data encryption, automated vulnerability scanners, and strict ISO/SOC2 security protocols from day one.",
    icon: Lock,
  },
  {
    title: "99.999% SLA & 24/7 Dedicated Support",
    description: "Continuous health monitoring, automated cloud auto-scaling, and dedicated incident resolution teams on call 24/7.",
    icon: Clock,
  },
  {
    title: "Clean Modular Codebase Guarantee",
    description: "Strict TypeScript type safety, automated unit test suites, and exhaustive architectural documentation that scale gracefully.",
    icon: Award,
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] pointer-events-none" />

      <Container size="2xl" className="relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider border border-blue-500/20">
            The Nuvexora Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Why Market Leaders Choose Nuvexora
          </h2>
          <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed">
            We bridge the gap between boutique design agency elegance and enterprise software engineering rigor.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {valueProps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-slate-800/50 border border-slate-700/60 hover:border-blue-500/50 rounded-3xl p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:bg-slate-800/80 group"
              >
                <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 w-fit mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
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
