"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Globe,
  Smartphone,
  Layers,
  Brain,
  RefreshCw,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import {
  ESTIMATOR_CATEGORIES,
  ESTIMATOR_SCALES,
  ESTIMATOR_ADDONS,
} from "@/data/pricing-data";
import { CurrencyOption } from "./pricing-hero";

interface PricingEstimatorProps {
  currency: CurrencyOption;
}

export function PricingEstimator({ currency }: PricingEstimatorProps) {
  const [selectedCategory, setSelectedCategory] = useState(ESTIMATOR_CATEGORIES[0].id);
  const [selectedScale, setSelectedScale] = useState(ESTIMATOR_SCALES[1].id);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    "design-system",
  ]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Globe":
        return Globe;
      case "Smartphone":
        return Smartphone;
      case "Layers":
        return Layers;
      case "Brain":
        return Brain;
      case "RefreshCw":
        return RefreshCw;
      default:
        return Globe;
    }
  };

  const calculation = useMemo(() => {
    const category = ESTIMATOR_CATEGORIES.find((c) => c.id === selectedCategory) || ESTIMATOR_CATEGORIES[0];
    const scale = ESTIMATOR_SCALES.find((s) => s.id === selectedScale) || ESTIMATOR_SCALES[0];

    const basePriceUSD = category.basePriceUSD * scale.multiplier;
    const baseWeeks = category.baseWeeks + scale.weeksAdd;

    const addonsCostUSD = selectedAddons.reduce((acc, addonId) => {
      const addon = ESTIMATOR_ADDONS.find((a) => a.id === addonId);
      return acc + (addon ? addon.priceUSD : 0);
    }, 0);

    const addonsWeeks = selectedAddons.reduce((acc, addonId) => {
      const addon = ESTIMATOR_ADDONS.find((a) => a.id === addonId);
      return acc + (addon ? addon.weeksAdd : 0);
    }, 0);

    const totalUSD = Math.round(basePriceUSD + addonsCostUSD);
    const totalWeeks = baseWeeks + addonsWeeks;

    // Convert with dynamic currency exchange rate
    const convertedTotal = Math.round(totalUSD * currency.exchangeRate);
    const minVal = Math.round(convertedTotal * 0.9);
    const maxVal = Math.round(convertedTotal * 1.1);

    // Squad composition estimate based on scale
    let squadDesc = "1 Fullstack Lead + 1 Designer";
    if (scale.id === "growth") {
      squadDesc = "1 Tech Lead + 2 Fullstack Devs + 1 Designer + QA";
    } else if (scale.id === "enterprise") {
      squadDesc = "1 Solutions Architect + 3 Fullstack Devs + 1 DevOps + 1 QA";
    }

    return {
      category,
      scale,
      totalUSD,
      convertedTotal,
      minVal,
      maxVal,
      totalWeeks,
      squadDesc,
    };
  }, [selectedCategory, selectedScale, selectedAddons, currency]);

  const displayCost = useMemo(() => {
    const locale = currency.code === "INR" ? "en-IN" : "en-US";
    return `${currency.symbol}${calculation.minVal.toLocaleString(locale)} – ${currency.symbol}${calculation.maxVal.toLocaleString(locale)}`;
  }, [currency, calculation]);

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-950/70 border-y border-border/80 relative overflow-hidden" id="estimator">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[30rem] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <Container size="2xl" className="relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <Calculator className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Interactive Cost & Timeline Scoping</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Estimate Your Custom Project in 30 Seconds
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Select your technology stack, project maturity, and specialized requirements to receive an instant, reliable budgetary estimate.
          </p>
        </div>

        {/* Estimator Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
          {/* Controls Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-8 bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-card">
            {/* Step 1: Category */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block">
                1. Select Platform Architecture
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ESTIMATOR_CATEGORIES.map((cat) => {
                  const Icon = getCategoryIcon(cat.icon);
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-xs"
                          : "border-border bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-sm font-bold leading-snug">
                          {cat.name}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                          Base ~{cat.baseWeeks} Weeks
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Scale */}
            <div className="space-y-3 pt-4 border-t border-border/60">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block">
                2. Project Scope & Maturity
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ESTIMATOR_SCALES.map((scale) => {
                  const isSelected = selectedScale === scale.id;

                  return (
                    <button
                      key={scale.id}
                      type="button"
                      onClick={() => setSelectedScale(scale.id)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-xs"
                          : "border-border bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <span className="block text-sm font-bold">{scale.label}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block leading-relaxed">
                          {scale.desc}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Add-ons */}
            <div className="space-y-3 pt-4 border-t border-border/60">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block">
                3. Optional Specializations & Enterprise Add-ons
              </label>
              <div className="space-y-2.5">
                {ESTIMATOR_ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  const priceLabel = `+${currency.symbol}${Math.round(addon.priceUSD * currency.exchangeRate).toLocaleString()}`;

                  return (
                    <label
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        isChecked
                          ? "border-blue-500/80 bg-blue-50/40 dark:bg-blue-950/30"
                          : "border-border bg-slate-50/30 dark:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-slate-300 dark:border-slate-700 bg-background"
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                          {addon.label}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {priceLabel}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result Output Column (5 Cols) */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-950 to-blue-950 text-white p-7 sm:p-9 border border-slate-800 shadow-2xl relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-20 -right-20 w-52 h-52 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Live Scoping Summary</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {currency.code} ({currency.symbol}) Pricing
                  </span>
                </div>

                {/* Investment Range */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Estimated Budget Range
                  </p>
                  <motion.div
                    key={displayCost}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
                  >
                    {displayCost}
                  </motion.div>
                  <p className="text-xs text-slate-400">
                    Milestone-guaranteed or monthly sprint allocation.
                  </p>
                </div>

                {/* Delivery Time & Squad Blueprint */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>Delivery Time</span>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-white">
                      ~{calculation.totalWeeks} Weeks
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span>Sprint Velocity</span>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-white">
                      Agile Cadence
                    </p>
                  </div>
                </div>

                {/* Squad Composition */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-slate-800 space-y-1 text-xs">
                  <span className="font-semibold text-slate-300 block">
                    Recommended Engineering Squad:
                  </span>
                  <span className="text-slate-400 block leading-relaxed">
                    {calculation.squadDesc}
                  </span>
                </div>

                {/* CTAs */}
                <div className="pt-2 space-y-3">
                  <Link
                    href={`/book-consultation?category=${selectedCategory}&scale=${selectedScale}&budget=${calculation.minVal}&currency=${currency.code}`}
                    className="w-full group inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <span>Claim Estimate & Book Discovery</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      100% Free Scoping Call
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      Zero Obligation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
