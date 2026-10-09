"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, Clock, Award, Globe, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
}

export type BillingCycle = "monthly" | "fixed" | "annual";

interface PricingHeroProps {
  currencies: CurrencyOption[];
  selectedCurrency: string;
  setSelectedCurrency: (c: string) => void;
  billingCycle: BillingCycle;
  setBillingCycle: (b: BillingCycle) => void;
}

export function PricingHero({
  currencies,
  selectedCurrency,
  setSelectedCurrency,
  billingCycle,
  setBillingCycle,
}: PricingHeroProps) {
  const trustSignals = [
    { label: "100% IP Ownership on Day 1", icon: ShieldCheck },
    { label: "14-Day Risk-Free Trial", icon: Zap },
    { label: "Guaranteed Milestone Delivery", icon: Clock },
    { label: "Strict NDA & Security Protection", icon: Award },
  ];

  const currentCurrencyObj = currencies.find((c) => c.code === selectedCurrency) || currencies[0] || {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    exchangeRate: 1.0,
  };

  return (
    <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 bg-background text-foreground overflow-hidden border-b border-border/70">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <Container size="2xl" className="relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50/90 dark:bg-blue-950/80 border border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Value-Driven Enterprise Investment</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]"
          >
            Predictable, High-Impact Pricing for{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent">
              Ambitious Software.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Choose between agile dedicated engineering squads or guaranteed fixed-price milestones. Zero surprise invoices, senior developers only, and complete IP ownership.
          </motion.p>

          {/* Controls: Currency & Billing Selectors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            {/* Dynamic Multi-Currency Dropdown / Selector */}
            <div className="relative inline-flex items-center gap-2 p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xs backdrop-blur-md">
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500">
                <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline">Currency:</span>
              </div>
              <div className="relative">
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="appearance-none bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs outline-none cursor-pointer hover:border-blue-400 transition-colors"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code} className="bg-card text-foreground">
                      {c.code} ({c.symbol}) — {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Billing Mode Tabs */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xs backdrop-blur-md">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  billingCycle === "monthly"
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Monthly Squads
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("fixed")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  billingCycle === "fixed"
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Fixed Milestone
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  billingCycle === "annual"
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>Annual SLA</span>
                <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Save 15%
                </span>
              </button>
            </div>
          </motion.div>

          {/* Trust Highlights Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-6 border-t border-border/60 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto"
          >
            {trustSignals.map((sig) => {
              const Icon = sig.icon;
              return (
                <div
                  key={sig.label}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-card/60 border border-border/80 backdrop-blur-xs text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 shadow-2xs"
                >
                  <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="truncate">{sig.label}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
