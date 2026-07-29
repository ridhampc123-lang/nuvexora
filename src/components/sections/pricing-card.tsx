"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

export interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  href: string;
  index?: number;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  isPopular = false,
  ctaText,
  href,
  index = 0,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
        isPopular
          ? "bg-slate-900 text-white shadow-2xl shadow-blue-950/40 border-2 border-blue-500 scale-[1.02]"
          : "bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-900/5"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
          Most Popular Plan
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{name}</h3>
        </div>

        <p className={`text-xs sm:text-sm mb-6 ${isPopular ? "text-slate-300" : "text-slate-600 dark:text-slate-300"}`}>
          {description}
        </p>

        <div className="mb-8">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-sans">{price}</span>
          <span className={`text-xs font-semibold ml-1.5 ${isPopular ? "text-slate-400" : "text-slate-500 dark:text-slate-400"}`}>
            {period}
          </span>
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((feat) => (
            <li key={feat} className="flex items-center gap-3 text-xs sm:text-sm font-medium">
              <div className={`p-1 rounded-full ${isPopular ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400"}`}>
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className={isPopular ? "text-slate-200" : "text-slate-700 dark:text-slate-200"}>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={href}
        className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
          isPopular
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30"
            : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
        }`}
      >
        <span>{ctaText}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}