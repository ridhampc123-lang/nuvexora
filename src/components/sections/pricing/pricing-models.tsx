"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Users, Compass, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ENGAGEMENT_MODELS } from "@/data/pricing-data";

export function PricingModels() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Target":
        return Target;
      case "Users":
        return Users;
      case "Compass":
        return Compass;
      default:
        return Users;
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50/60 dark:bg-slate-950/40 border-t border-border/80 relative" id="models">
      <Container size="2xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Contractual Flexibility
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Three Agile Engagement Models
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Tailor your commercial agreement to match your procurement rules, roadmap certainty, and governance style.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {ENGAGEMENT_MODELS.map((model, idx) => {
            const Icon = getIcon(model.icon);

            return (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="rounded-3xl bg-card border border-border p-7 sm:p-9 shadow-card flex flex-col justify-between hover:shadow-floating transition-all duration-300"
              >
                <div className="space-y-6">
                  {/* Icon & Eyebrow */}
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {model.eyebrow}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                        {model.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {model.description}
                  </p>

                  {/* Metadata Specs */}
                  <div className="space-y-3 pt-4 border-t border-border/60 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                        Billing Terms:
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {model.billingCadence}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                        Roadmap Flexibility:
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {model.flexibility}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                        Intellectual Property:
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {model.ipTransfer}
                      </span>
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className="space-y-2.5 pt-4 border-t border-border/60">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Core Advantages:
                    </p>
                    <ul className="space-y-2">
                      {model.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href={`/book-consultation?model=${model.id}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 group"
                  >
                    <span>Discuss This Model</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
