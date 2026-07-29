"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, LucideIcon } from "lucide-react";

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  href: string;
  badge?: string;
  index?: number;
}

export function ServiceCard({
  title,
  description,
  icon: Icon,
  features,
  href,
  badge,
  index = 0,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)] transition-all duration-300 flex flex-col justify-between transform-gpu"
    >
      <div>
        {/* Top Header & Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <Icon className="w-6 h-6" />
          </div>
          {badge && (
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
              {badge}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
          {description}
        </p>

        {/* Feature List */}
        <ul className="space-y-2.5 mb-8">
          {features.map((feat) => (
            <li key={feat} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Card Action Link */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Link
          href={href}
          aria-label={`Learn more about ${title}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
        >
          <span>Explore Service</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}