"use client";

import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { ShieldCheck, Cpu, Zap, Lock, RefreshCw, Eye, Award, CheckCircle2 } from "lucide-react";

export function WhyChooseNuvexora() {
  const pillars = [
    {
      title: "SOC2 & ISO 27001 Security",
      description: "Bank-grade data encryption, zero-trust network boundaries, and automated vulnerability patch management built into every project.",
      icon: Lock,
      metric: "100% Compliant"
    },
    {
      title: "99.99% Guaranteed SLA Uptime",
      description: "Multi-region cloud infrastructure, redundant database clusters, and 24/7/365 PagerDuty incident response coverage.",
      icon: ShieldCheck,
      metric: "99.99% Uptime"
    },
    {
      title: "Sub-Second Performance SLA",
      description: "Next.js edge server components, Redis caching layers, and code-splitting delivering sub-500ms initial page renders globally.",
      icon: Zap,
      metric: "<500ms TTFB"
    },
    {
      title: "100% Transparent Governance",
      description: "Direct Slack channel communication, real-time Jira sprint boards, bi-weekly video demos, and zero hidden licensing costs.",
      icon: Eye,
      metric: "100% Visibility"
    },
    {
      title: "Elastic Scalability",
      description: "Architectures designed to scale effortlessly from 1,000 to 1,000,000+ concurrent active users without code refactoring.",
      icon: RefreshCw,
      metric: "1M+ Users"
    },
    {
      title: "Battle-Tested Modern Tech Stack",
      description: "Next.js 15, React 19, TypeScript, Tailwind CSS, PostgreSQL, and Kubernetes—never proprietary legacy technical debt.",
      icon: Cpu,
      metric: "Modern Agility"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <Container size="2xl" className="relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider border border-blue-500/20">
            <Award className="w-3.5 h-3.5 text-blue-400" />
            The Nuvexora Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Why High-Growth Enterprises Partner With Us
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-normal">
            We combine elite engineering rigor with transparent agency partnership, delivering products that drive enterprise valuation.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-7 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500/50 shadow-lg space-y-4 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {pillar.metric}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">
                  {pillar.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
