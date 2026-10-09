"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Users, Clock, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CurrencyOption, BillingCycle } from "./pricing-hero";

export interface DynamicPlan {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  badge?: string;
  isPopular?: boolean;
  isActive?: boolean;
  description: string;
  monthlyPriceUSD: number;
  monthlyPriceINR: number;
  fixedPriceUSD: number;
  fixedPriceINR: number;
  annualDiscountPercent?: number;
  deliveryTime: string;
  squadComposition: string;
  idealFor?: string;
  highlightedFeatures: string[];
  ctaText: string;
  ctaHref: string;
}

interface PricingCardsProps {
  plans: DynamicPlan[];
  currency: CurrencyOption;
  billingCycle: BillingCycle;
}

export function PricingCards({ plans, currency, billingCycle }: PricingCardsProps) {
  const formatPrice = (plan: DynamicPlan) => {
    let amountUSD = plan.monthlyPriceUSD;
    let period = "/ month";

    const discount = plan.annualDiscountPercent || 15;

    if (billingCycle === "fixed") {
      amountUSD = plan.fixedPriceUSD;
      period = " fixed milestone";
    } else if (billingCycle === "annual") {
      amountUSD = Math.round(plan.monthlyPriceUSD * (1 - discount / 100));
      period = "/ month (annual)";
    } else {
      amountUSD = plan.monthlyPriceUSD;
      period = "/ month";
    }

    // Currency calculation
    let finalAmount = Math.round(amountUSD * currency.exchangeRate);

    // If currency is INR and explicit INR rate is provided in plan
    if (currency.code === "INR") {
      if (billingCycle === "fixed") {
        finalAmount = plan.fixedPriceINR;
      } else if (billingCycle === "annual") {
        finalAmount = Math.round(plan.monthlyPriceINR * (1 - discount / 100));
      } else {
        finalAmount = plan.monthlyPriceINR;
      }
    }

    const locale = currency.code === "INR" ? "en-IN" : "en-US";
    return {
      formatted: `${currency.symbol}${finalAmount.toLocaleString(locale)}`,
      period,
    };
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background relative overflow-hidden" id="pricing-plans">
      <Container size="2xl">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-3">
            Targeted Investment Tiers
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Engineered For Every Stage of Growth
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
            Transparent agreements designed with zero vendor lock-in. Scale engineering capacity up or down as your product requirements evolve.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const priceInfo = formatPrice(plan);
            const isPopular = !!plan.isPopular;
            const planKey = plan._id || plan.id || plan.slug || `plan-${index}`;

            return (
              <motion.div
                key={planKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative rounded-3xl flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? "bg-gradient-to-b from-blue-900/10 via-card to-card border-2 border-blue-500/80 shadow-[0_15px_40px_-10px_rgba(59,130,246,0.3)] dark:shadow-[0_20px_50px_-15px_rgba(37,99,235,0.4)] lg:-translate-y-2 z-10"
                    : "bg-card border border-border/80 shadow-card hover:shadow-floating hover:-translate-y-1"
                }`}
              >
                {/* Popular Glow Ribbon */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "5s" }} />
                    <span>Most Popular • High Velocity</span>
                  </div>
                )}

                <div className="p-7 sm:p-9 space-y-6 flex-1">
                  {/* Card Header */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {plan.badge || "Tier"}
                      </span>
                      {isPopular && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-current" />
                          Recommended
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed min-h-[42px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="pt-4 border-t border-border/60">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        {priceInfo.formatted}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {priceInfo.period}
                      </span>
                    </div>

                    {billingCycle === "annual" && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                        15% annual savings applied
                      </p>
                    )}
                  </div>

                  {/* Delivery & Squad Snapshot */}
                  <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-border/60 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="font-semibold">Cadence:</span>
                      <span className="truncate">{plan.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="font-semibold">Team:</span>
                      <span className="truncate">{plan.squadComposition}</span>
                    </div>
                  </div>

                  {/* Key Features Included */}
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      What&apos;s Included:
                    </p>
                    <ul className="space-y-2.5">
                      {plan.highlightedFeatures.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          <div className="mt-0.5 p-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA Footer */}
                <div className="p-7 sm:p-9 pt-0">
                  <Link
                    href={plan.ctaHref || "/book-consultation"}
                    className={`w-full group inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 shadow-sm ${
                      isPopular
                        ? "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                        : "bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border border-slate-800 dark:border-slate-700 hover:-translate-y-0.5"
                    }`}
                  >
                    <span>{plan.ctaText || "Get Started"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-3">
                    Includes 14-day trial & NDA protection
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Quote Notice */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Have bespoke requirements or need a hybrid model?{" "}
            <Link
              href="/book-consultation"
              className="font-semibold text-blue-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-500"
            >
              Book a custom architectural consultation
            </Link>{" "}
            or use our interactive estimator below.
          </p>
        </div>
      </Container>
    </section>
  );
}
