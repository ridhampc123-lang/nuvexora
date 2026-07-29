"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Briefcase, 
  Building2, 
  Globe2, 
  Award,
  CheckCircle2
} from "lucide-react";
import { HeroStatCard } from "./hero-stat-card";

export function HeroLeft() {
  const stats = [
    { numberTarget: 100, suffix: "+", label: "Projects Delivered", icon: Briefcase },
    { numberTarget: 50, suffix: "+", label: "Global Clients", icon: Building2 },
    { numberTarget: 10, suffix: "+", label: "Industries Served", icon: Globe2 },
    { numberTarget: 99, suffix: "%", label: "Client Satisfaction", icon: Award },
  ];

  return (
    <div className="flex flex-col justify-center space-y-8 lg:space-y-10 max-w-2xl lg:max-w-none">
      {/* Small Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50/90 dark:bg-blue-950/80 border border-blue-200/70 dark:border-blue-800/80 backdrop-blur-md shadow-[0_2px_10px_-2px_rgba(37,99,235,0.1)] text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          Trusted Technology Partner
        </div>
      </motion.div>

      {/* Large Headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-3"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
          Architecting{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Enterprise Platforms.
          </span>
          <br />
          Engineering Digital Excellence.
        </h1>
      </motion.div>

      {/* Supporting Copy */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl"
      >
        Nuvexora Technologies engineers high-performance software, cloud architectures, and bespoke artificial intelligence solutions for high-growth enterprises and ambitious leaders.
      </motion.p>

      {/* Primary & Secondary CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap items-center gap-4 pt-1"
      >
        <Link
          href="/book-consultation"
          aria-label="Start Your Project with Nuvexora"
          className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-semibold text-sm sm:text-base shadow-[0_10px_25px_-5px_rgba(37,99,235,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.45)] transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <span>Start Your Project</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>

        <Link
          href="/services"
          aria-label="Explore Nuvexora Services"
          className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-sm sm:text-base shadow-sm hover:shadow transition-all duration-300 backdrop-blur-md transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
          <span>Explore Our Services</span>
        </Link>
      </motion.div>

      {/* Trust Highlights Pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium pt-2"
      >
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          SOC2 & ISO Compliant
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          99.99% Guaranteed SLA
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          Dedicated AI Architecture Team
        </span>
      </motion.div>

      {/* Statistics Row */}
      <div className="pt-4 sm:pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, idx) => (
            <HeroStatCard
              key={stat.label}
              numberTarget={stat.numberTarget}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
              delay={0.1 * idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
