"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { CTA } from "@/components/sections";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Share2,
  Calendar,
  Building2,
} from "lucide-react";
import { usePublicCaseStudyQuery } from "@/hooks/use-api-queries";
import { toast } from "sonner";

export default function CaseStudyDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const { data: caseStudy, isLoading, isError } = usePublicCaseStudyQuery(slug);

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Case study link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <main className="py-20 bg-background text-foreground min-h-screen">
        <Container size="medium" className="space-y-8 animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-32" />
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </Container>
      </main>
    );
  }

  if (isError || !caseStudy) {
    return (
      <main className="py-24 bg-background text-foreground min-h-screen flex items-center">
        <Container size="medium" className="text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <Briefcase className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Case Study Not Found</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
            The requested case study could not be located. It may have been archived or moved by the administrator.
          </p>
          <div>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Case Studies</span>
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  const metrics = Array.isArray(caseStudy.metrics) ? caseStudy.metrics : [];
  const technologies = Array.isArray(caseStudy.technologies) ? caseStudy.technologies : [];
  const deliverables = Array.isArray(caseStudy.deliverables) ? caseStudy.deliverables : [];

  return (
    <main className="py-12 sm:py-16 lg:py-20 bg-background text-foreground min-h-screen relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 dark:bg-blue-600/15 blur-[160px] pointer-events-none" />

      <Container size="medium" className="relative z-10 space-y-12">
        {/* Navigation & Share */}
        <div className="flex items-center justify-between">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Case Studies</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Story</span>
          </button>
        </div>

        {/* Case Study Header */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60 text-xs font-bold uppercase tracking-wider">
              {caseStudy.industry}
            </span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Client: <span className="text-slate-900 dark:text-white font-bold">{caseStudy.client}</span>
            </span>
            {caseStudy.timeline && (
              <span className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {caseStudy.timeline}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {caseStudy.title}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed">
            {caseStudy.summary}
          </p>

          {caseStudy.liveUrl && (
            <div className="pt-2">
              <a
                href={caseStudy.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all border border-slate-200/60 dark:border-slate-700"
              >
                <span>Visit Live Implementation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Cover Image if available */}
        {caseStudy.coverImage && (
          <div className="relative w-full h-[320px] sm:h-[460px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
            <img
              src={caseStudy.coverImage}
              alt={caseStudy.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Key Metrics Grid */}
        {metrics.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Verified Business & Technical Benchmarks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {metrics.map((m: string) => (
                <div
                  key={m}
                  className="p-6 rounded-3xl bg-gradient-to-br from-blue-50/80 via-white to-slate-50 dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-950 border border-blue-100 dark:border-blue-900/50 shadow-sm text-center space-y-1"
                >
                  <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                    {m}
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Documented Outcome
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenge & Solution Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          {caseStudy.challenge && (
            <div className="p-8 rounded-3xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider">
                The Challenge
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Legacy Bottlenecks & Operational Friction
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {caseStudy.challenge}
              </p>
            </div>
          )}

          {caseStudy.solution && (
            <div className="p-8 rounded-3xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                Engineering Solution
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Modern Architecture & Scalable Infrastructure
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {caseStudy.solution}
              </p>
            </div>
          )}
        </div>

        {/* Deliverables Section */}
        {deliverables.length > 0 && (
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Core Project Deliverables</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deliverables.map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technologies Stack */}
        {technologies.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Production Technology Stack Deployed
            </h3>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech: string) => (
                <div
                  key={tech}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA Block */}
        <div className="pt-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white shadow-xl space-y-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Architect Your Enterprise Success Story?
            </h2>
            <p className="text-blue-100 max-w-xl mx-auto text-sm sm:text-base">
              Schedule a technical strategy session with our systems architect to review scope, milestone timelines, and squad allocation.
            </p>
            <div className="pt-2">
              <Link
                href="/book-consultation"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-slate-900 font-extrabold text-sm hover:bg-blue-50 transition-all shadow-md"
              >
                <span>Book a Strategy Session</span>
                <Sparkles className="w-4 h-4 text-blue-600" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

