"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PortfolioCard } from "./portfolio-card";
import { ArrowRight } from "lucide-react";
import { usePublicPortfolioQuery } from "@/hooks/use-api-queries";

const defaultProjects = [
  {
    title: "Veloce Financial — AI Trading Infrastructure",
    category: "Fintech & AI",
    metric: "+340%",
    metricLabel: "Throughput Increase",
    description: "Built high-frequency order routing API and sub-15ms AI risk engine for Series B fintech platform handling $1.2B volume.",
    tags: ["Next.js", "Python FastAPI", "PyTorch", "AWS Lambda"],
    href: "/portfolio",
    imageColor: "from-blue-600 via-indigo-600 to-slate-900"
  },
  {
    title: "Apex Healthcare — HIPAA Cloud Platform",
    category: "MedTech & SaaS",
    metric: "99.999%",
    metricLabel: "Uptime SLA Achieved",
    description: "Engineered multi-region FHIR-compliant patient management system processing 4M monthly encrypted medical records.",
    tags: ["React", "Node.js", "MongoDB", "Docker", "Kubernetes"],
    href: "/portfolio",
    imageColor: "from-cyan-600 via-blue-600 to-indigo-800"
  },
  {
    title: "OmniLogistics — Predictive AI Route Engine",
    category: "Logistics & Supply Chain",
    metric: "$4.8M",
    metricLabel: "Annual Fuel Saved",
    description: "Automated route optimization using real-time traffic graph neural networks for 12,000 active delivery vehicles.",
    tags: ["TypeScript", "Python", "Vector DB", "GCP"],
    href: "/portfolio",
    imageColor: "from-indigo-600 via-sky-600 to-blue-900"
  }
];

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
              Proven Track Record
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Case Studies & Engineering Victories
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Explore how we helped startups raise Series B funding and enterprises modernize legacy infrastructure.
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

        {/* Portfolio Cards Grid */}
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
              imageColor={project.imageColor}
              index={idx}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}