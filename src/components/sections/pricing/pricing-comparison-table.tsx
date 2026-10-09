"use client";

import React, { useState } from "react";
import { Check, Minus, HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { COMPARISON_CATEGORIES } from "@/data/pricing-data";

export function PricingComparisonTable() {
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const renderValue = (value: string | boolean, isGrowth = false) => {
    if (value === true) {
      return (
        <div className="flex items-center justify-center">
          <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        </div>
      );
    }
    if (value === false) {
      return (
        <div className="flex items-center justify-center text-slate-300 dark:text-slate-600">
          <Minus className="w-4 h-4" />
        </div>
      );
    }
    return (
      <span
        className={`text-xs font-semibold text-center block ${
          isGrowth
            ? "text-blue-600 dark:text-blue-400"
            : "text-slate-700 dark:text-slate-300"
        }`}
      >
        {value}
      </span>
    );
  };

  return (
    <section className="py-16 sm:py-24 bg-background relative" id="feature-matrix">
      <Container size="2xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Detailed Comparison
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Full Enterprise Capability Matrix
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Transparent breakdown of technical capabilities, infrastructure tiers, sprint velocity, and SLA guarantees.
          </p>
        </div>

        {/* Table Container */}
        <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              {/* Sticky Table Header */}
              <thead>
                <tr className="border-b border-border bg-slate-50/90 dark:bg-slate-900/90 sticky top-20 z-20 backdrop-blur-md">
                  <th className="p-5 sm:p-6 text-sm font-extrabold text-slate-900 dark:text-white w-2/5">
                    Tier Capabilities
                  </th>
                  <th className="p-5 sm:p-6 text-center text-sm font-bold text-slate-900 dark:text-white w-1/5">
                    Starter Sprint
                    <span className="block text-[11px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                      MVP & Micro-Apps
                    </span>
                  </th>
                  <th className="p-5 sm:p-6 text-center text-sm font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 border-x border-blue-500/20 w-1/5 relative">
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Growth Squad
                    </span>
                    <span className="block text-[11px] font-semibold text-blue-600/80 dark:text-blue-400/80 mt-0.5">
                      Most Popular
                    </span>
                  </th>
                  <th className="p-5 sm:p-6 text-center text-sm font-bold text-slate-900 dark:text-white w-1/5">
                    Enterprise Scale
                    <span className="block text-[11px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                      Mission-Critical
                    </span>
                  </th>
                </tr>
              </thead>

              {/* Table Body with Categories */}
              <tbody className="divide-y divide-border/60">
                {COMPARISON_CATEGORIES.map((categoryGroup) => {
                  const isCollapsed = collapsedCategories.includes(categoryGroup.category);

                  return (
                    <React.Fragment key={categoryGroup.category}>
                      {/* Category Header Row */}
                      <tr
                        onClick={() => toggleCategory(categoryGroup.category)}
                        className="bg-slate-100/70 dark:bg-slate-900/70 cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                      >
                        <td
                          colSpan={4}
                          className="p-4 sm:px-6 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between"
                        >
                          <span>{categoryGroup.category}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                              isCollapsed ? "-rotate-90" : "rotate-0"
                            }`}
                          />
                        </td>
                      </tr>

                      {/* Category Feature Rows */}
                      {!isCollapsed &&
                        categoryGroup.features.map((feature, featureIdx) => (
                          <tr
                            key={feature.name}
                            className={`hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors ${
                              featureIdx % 2 === 0 ? "bg-background" : "bg-slate-50/30 dark:bg-slate-950/20"
                            }`}
                          >
                            <td className="p-4 sm:p-5 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                              <div className="flex items-center gap-1.5">
                                <span>{feature.name}</span>
                                {feature.tooltip && (
                                  <span
                                    title={feature.tooltip}
                                    className="cursor-help text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                  >
                                    <HelpCircle className="w-3.5 h-3.5" />
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 sm:p-5 text-center">
                              {renderValue(feature.starter)}
                            </td>
                            <td className="p-4 sm:p-5 text-center bg-blue-50/30 dark:bg-blue-950/20 border-x border-blue-500/20">
                              {renderValue(feature.growth, true)}
                            </td>
                            <td className="p-4 sm:p-5 text-center">
                              {renderValue(feature.enterprise)}
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </section>
  );
}
