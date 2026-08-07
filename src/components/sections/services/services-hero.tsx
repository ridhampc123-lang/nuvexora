"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Cpu, Code2, Award } from "lucide-react";
import { Container } from "@/components/ui/container";

export function ServicesHero() {
  const stats = [
    { value: "100+", label: "Projects Delivered", icon: Code2 },
    { value: "99.99%", label: "Guaranteed SLA Uptime", icon: ShieldCheck },
    { value: "50+", label: "Global Enterprise Clients", icon: Cpu },
    { value: "16+", label: "Specialized Core Capabilities", icon: Award },
  ];

  return (
    <section className="relative py-16 sm:py-24 lg:py-28 bg-background text-foreground overflow-hidden border-b border-slate-200/60 dark:border-slate-800/80">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <Container size="2xl" className="relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50/90 dark:bg-blue-950/80 border border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" style={{ animationDuration: "6s" }} />
            Enterprise Services Ecosystem
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]"
          >
            Innovate. Build. Elevate.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Architecting Digital Dominance.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Full-spectrum software engineering, bespoke AI solutions, cloud DevOps, and strategic design for high-growth enterprises and ambitious market leaders.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/book-consultation"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-semibold text-base shadow-[0_10px_25px_-5px_rgba(37,99,235,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.45)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Book Free Strategy Call</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#service-categories"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-base shadow-sm transition-all duration-300 backdrop-blur-md"
            >
              <span>Browse 16 Services</span>
            </a>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-slate-200/60 dark:border-slate-800/60"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 backdrop-blur-sm shadow-sm flex flex-col items-center justify-center text-center space-y-1.5 min-w-0 overflow-hidden"
                >
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-1" />
                  <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words max-w-full leading-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-normal break-words max-w-full">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
