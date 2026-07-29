"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export interface TestimonialCardProps {
  quote: string;
  author: string;
  title: string;
  company: string;
  rating?: number;
  avatarText: string;
  index?: number;
}

export function TestimonialsCard({
  quote,
  author,
  title,
  company,
  rating = 5,
  avatarText,
  index = 0,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Star Rating & Quote Icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <Quote className="w-8 h-8 text-blue-100 dark:text-slate-800" />
        </div>

        {/* Quote Text */}
        <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-normal italic mb-8">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      {/* Author Footer */}
      <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md">
          {avatarText}
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">{author}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {title} &bull; <span className="text-blue-600 dark:text-blue-400 font-semibold">{company}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}