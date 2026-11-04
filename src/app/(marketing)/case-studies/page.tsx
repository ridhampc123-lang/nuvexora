"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { CTA } from "@/components/sections";
import {
  Briefcase,
  ArrowRight,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Clock,
  Building2,
  Filter,
} from "lucide-react";
import { usePublicCaseStudiesQuery } from "@/hooks/use-api-queries";

export default function CaseStudiesPage() {
  const { data: dbCaseStudies, isLoading } = usePublicCaseStudiesQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");

  const caseStudies = useMemo(() => {
    return Array.isArray(dbCaseStudies) ? dbCaseStudies : [];
  }, [dbCaseStudies]);

  // Extract unique industries for filter tabs
  const industries = useMemo(() => {
    const list = new Set<string>();
    caseStudies.forEach((cs: any) => {
      if (cs.industry) list.add(cs.industry);
    });
    return ["All", ...Array.from(list)];
  }, [caseStudies]);

  // Filter case studies by industry & search query
  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter((cs: any) => {
      const matchesIndustry =
        selectedIndustry === "All" || cs.industry?.toLowerCase() === selectedIndustry.toLowerCase();

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        cs.title?.toLowerCase().includes(q) ||
        cs.client?.toLowerCase().includes(q) ||
        cs.summary?.toLowerCase().includes(q) ||
        cs.industry?.toLowerCase().includes(q) ||
        (Array.isArray(cs.technologies) &&
          cs.technologies.some((t: string) => t.toLowerCase().includes(q)));

      return matchesIndustry && matchesSearch;
    });
  }, [caseStudies, selectedIndustry, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 sm:pt-28 sm:pb-16 overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-slate-50/80 via-background to-background dark:from-slate-950/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.12),transparent)]" />
        <Container size="2xl" className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Client Transformations & Proven Impact
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Engineering Outcomes,{" "}
            <span className="text-gradient-animated">Not Just Lines of Code.</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto">
            Explore documented architectures, legacy modernizations, and measurable business ROI delivered for venture-backed startups and Fortune 500 enterprises.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by client, technology, or industry domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Industry Filter Pills */}
          {industries.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedIndustry === ind
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-400"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Main Content Grid */}
      <section className="py-12 sm:py-16">
        <Container size="2xl">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 animate-pulse space-y-4 h-96"
                >
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          ) : filteredCaseStudies.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
              {filteredCaseStudies.map((cs: any, idx: number) => {
                const detailHref = `/case-studies/${cs.slug || cs._id}`;
                const metrics = Array.isArray(cs.metrics) ? cs.metrics : [];
                const technologies = Array.isArray(cs.technologies) ? cs.technologies : [];

                return (
                  <motion.div
                    key={cs._id || cs.slug || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:border-blue-500/50 hover:shadow-floating transition-all duration-300 group"
                  >
                    <div className="space-y-6">
                      {/* Top Header: Industry, Client, Timeline */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
                            {cs.industry}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {cs.client}
                          </span>
                        </div>

                        {cs.timeline && (
                          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{cs.timeline}</span>
                          </div>
                        )}
                      </div>

                      {/* Title & Summary */}
                      <div className="space-y-3">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <Link href={detailHref}>{cs.title}</Link>
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {cs.summary}
                        </p>
                      </div>

                      {/* ROI Metrics Grid */}
                      {metrics.length > 0 && (
                        <div className="grid grid-cols-3 gap-2.5 pt-1">
                          {metrics.slice(0, 3).map((metric: string) => (
                            <div
                              key={metric}
                              className="p-3 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/40 dark:from-blue-950/40 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/60 text-center"
                            >
                              <div className="text-sm sm:text-base font-black text-blue-600 dark:text-blue-400 tracking-tight leading-tight">
                                {metric}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Challenge (Before) vs Solution (After) */}
                      {(cs.challenge || cs.solution) && (
                        <div className="space-y-2.5 pt-2 text-xs">
                          {cs.challenge && (
                            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/40 space-y-1">
                              <span className="font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider text-[10px]">
                                The Challenge / Before:
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {cs.challenge}
                              </p>
                            </div>
                          )}

                          {cs.solution && (
                            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 space-y-1">
                              <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
                                Engineering Solution / After:
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {cs.solution}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tech Stack Pills */}
                      {technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {technologies.map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Footer Actions */}
                    <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <Link
                        href={detailHref}
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all"
                      >
                        <span>View Detailed Case Study</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      {cs.liveUrl && (
                        <a
                          href={cs.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                        >
                          <span>Live Site</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 px-6 max-w-lg mx-auto bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enterprise Case Studies Coming Soon</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {searchQuery
                  ? "No case studies matched your search query. Try broadening your criteria."
                  : "Our engineering and solutions teams are currently documenting verified client transformations and technical architecture blueprints."}
              </p>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              ) : (
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/book-consultation"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-all"
                  >
                    <span>Book Strategy Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    <span>Contact Sales</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* Global CTA */}
      <CTA />
    </div>
  );
}
