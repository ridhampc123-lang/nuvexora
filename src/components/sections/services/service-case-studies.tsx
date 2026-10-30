"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Briefcase, ArrowRight, ExternalLink } from "lucide-react";
import { usePublicCaseStudiesQuery } from "@/hooks/use-api-queries";

export function ServiceCaseStudies() {
  const { data: dbCaseStudies, isLoading } = usePublicCaseStudiesQuery();

  const caseStudies = Array.isArray(dbCaseStudies) ? dbCaseStudies : [];

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 bg-background text-foreground relative border-t border-slate-200/60 dark:border-slate-800/60">
        <Container size="2xl">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
              <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Proven Client Impact
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Enterprise Case Studies
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-7 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 animate-pulse space-y-4 h-96"
              >
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="grid grid-cols-3 gap-2 pt-4">
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (caseStudies.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 bg-background text-foreground relative border-t border-slate-200/60 dark:border-slate-800/60">
      <Container size="2xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Proven Client Impact
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Featured Enterprise Case Studies
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            Real performance benchmarks, tangible ROI metrics, and before-and-after transformations delivered for market leaders.
          </p>
        </div>

        {/* Case Studies Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {caseStudies.slice(0, 3).map((cs: any) => {
            const detailHref = `/case-studies/${cs.slug || cs._id}`;
            const metrics = Array.isArray(cs.metrics) ? cs.metrics : [];
            const technologies = Array.isArray(cs.technologies) ? cs.technologies : [];

            return (
              <div
                key={cs._id || cs.slug}
                className="flex flex-col justify-between p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-6 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  {/* Header Tag & Client */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {cs.industry}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {cs.client}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Link href={detailHref}>{cs.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {cs.summary}
                  </p>

                  {/* Metrics Badges */}
                  {metrics.length > 0 && (
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {metrics.slice(0, 3).map((m: string) => (
                        <div
                          key={m}
                          className="p-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-center"
                        >
                          <div className="text-xs font-extrabold text-blue-600 dark:text-blue-400 leading-tight">
                            {m}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Before vs After */}
                  {(cs.challenge || cs.solution) && (
                    <div className="space-y-2 pt-2 text-xs">
                      {cs.challenge && (
                        <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30">
                          <span className="font-bold text-rose-700 dark:text-rose-400">Before: </span>
                          <span className="text-slate-600 dark:text-slate-300 line-clamp-2">{cs.challenge}</span>
                        </div>
                      )}
                      {cs.solution && (
                        <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">After: </span>
                          <span className="text-slate-600 dark:text-slate-300 line-clamp-2">{cs.solution}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Technologies */}
                  {technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {technologies.slice(0, 5).map((t: string) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Link CTA */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    href={detailHref}
                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {cs.liveUrl && (
                    <a
                      href={cs.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Visit Live Client Project"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm transition-all"
          >
            <span>Explore All Enterprise Case Studies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
