"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PortfolioCard } from "./portfolio-card";
import { ArrowRight } from "lucide-react";
import { usePublicPortfolioQuery } from "@/hooks/use-api-queries";

const defaultProjects: any[] = [];

export function PortfolioSection() {
  const { data: dbProjects } = usePublicPortfolioQuery();

  const projectsToDisplay = dbProjects && dbProjects.length > 0
    ? dbProjects.map((p: any) => ({
        title: p.title,
        category: p.category,
        metric: p.metric,
        metricLabel: p.metricLabel,
        description: p.summary || `Custom enterprise engineering solution developed for ${p.clientName}.`,
        tags: p.techStack?.length > 0 ? p.techStack : ["React", "Node.js", "MongoDB"],
        href: `/portfolio`,
        coverImage: p.coverImage || "",
        imageColor: "from-blue-600 via-indigo-600 to-slate-900"
      }))
    : defaultProjects;

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-slate-50/60 dark:bg-slate-950/60 border-y border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
      <Container size="2xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
              Case Studies
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Enterprise Solutions
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Explore how we architect scalable systems and modernize legacy infrastructure for our clients.
            </p>
          </div>

          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 text-slate-900 dark:text-slate-100 font-bold text-sm shadow-sm hover:shadow transition-all group shrink-0"
          >
            <span>View All Case Studies</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Portfolio Cards Grid or Empty State */}
        {projectsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projectsToDisplay.map((project: any, idx: number) => (
              <PortfolioCard
                key={project.title + idx}
                title={project.title}
                category={project.category}
                metric={project.metric}
                metricLabel={project.metricLabel}
                description={project.description}
                tags={project.tags}
                href={project.href}
                coverImage={project.coverImage}
                imageColor={project.imageColor}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <div className="w-full p-12 flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl text-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-2">New case studies are currently being documented.</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Check back soon to see our latest implementations.</p>
          </div>
        )}
      </Container>
    </section>
  );
}