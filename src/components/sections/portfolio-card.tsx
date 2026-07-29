"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export interface PortfolioCardProps {
  title: string;
  category: string;
  metric: string;
  metricLabel: string;
  description: string;
  tags: string[];
  href: string;
  imageColor?: string;
  index?: number;
}

export function PortfolioCard({
  title,
  category,
  metric,
  metricLabel,
  description,
  tags,
  href,
  imageColor = "from-blue-600 to-indigo-700",
  index = 0,
}: PortfolioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between transform-gpu"
    >
      {/* Top Banner Visual Representation */}
      <div className={`h-48 sm:h-56 bg-gradient-to-tr ${imageColor} p-6 flex flex-col justify-between relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="flex items-center justify-between relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/30">
            {category}
          </span>
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Metric Badge */}
        <div className="relative z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 max-w-fit shadow-md border border-white/50 dark:border-slate-800">
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-sans flex items-center gap-1.5">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{metric}</span>
          </div>
          <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            {metricLabel}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Link
            href={href}
            className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Read Full Case Study</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}