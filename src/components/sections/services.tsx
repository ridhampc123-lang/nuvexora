"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { ServiceCard } from "./service-card";
import { 
  Code2, 
  BrainCircuit, 
  Smartphone, 
  Cloud, 
  Building2, 
  Palette, 
  Sparkles,
  Database,
  Lock,
  Search
} from "lucide-react";

const servicesData = [
  {
    category: "ai",
    title: "AI Solutions & Neural Engineering",
    description: "Custom Large Language Models, Predictive Analytics Engines, RAG Systems, and Neural Networks tailored for enterprise workflows.",
    icon: BrainCircuit,
    badge: "High Demand",
    features: ["Custom LLM & Agentic AI", "Vector Database & RAG Pipelines", "Computer Vision & Predictive Models", "SOC2 Enterprise Security"],
    href: "/services/ai-solutions"
  },
  {
    category: "web",
    title: "Web & SaaS Development",
    description: "High-throughput Next.js & React web applications designed for sub-second page loads, global scale, and maximum conversion.",
    icon: Code2,
    badge: "Core Expertise",
    features: ["Next.js App Router Architecture", "Micro-frontend Systems", "Serverless & Edge Compute", "High-Conversion UI Systems"],
    href: "/services/web-development"
  },
  {
    category: "mobile",
    title: "Mobile App Development",
    description: "Native iOS & Android apps plus cross-platform React Native solutions featuring 60fps animations and offline synchronization.",
    icon: Smartphone,
    features: ["iOS Swift & Android Kotlin", "React Native & Flutter", "Biometric Auth & Offline Sync", "App Store Optimization"],
    href: "/services/mobile-development"
  },
  {
    category: "cloud",
    title: "Cloud & DevOps Infrastructure",
    description: "AWS, GCP, and Azure cloud architecture with automated Terraform IaC, Kubernetes clusters, and zero-downtime CI/CD pipelines.",
    icon: Cloud,
    badge: "99.999% SLA",
    features: ["Multi-Region Cloud Infra", "Kubernetes & Docker Containerization", "Automated CI/CD Pipelines", "24/7 Monitoring & Incident Defense"],
    href: "/services/cloud-devops"
  },
  {
    category: "enterprise",
    title: "Enterprise ERP & CRM Systems",
    description: "Custom enterprise software solutions, ERP modules, and automated CRM systems built to replace legacy technical debt.",
    icon: Building2,
    features: ["Legacy Modernization", "Custom ERP & CRM Engines", "API Gateway Integration", "Real-Time BI Dashboards"],
    href: "/services/enterprise-software"
  },
  {
    category: "design",
    title: "UI/UX & Brand Identity",
    description: "Billion-dollar visual design systems, interactive web animations, design tokens, and user research engineered for conversion.",
    icon: Palette,
    badge: "Award Winning",
    features: ["Design Systems & Component Specs", "Interactive Micro-Animations", "User Research & Usability Audits", "Brand Identity Guidelines"],
    href: "/services/ui-ux-design"
  }
];

export function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredServices = activeCategory === "all" 
    ? servicesData 
    : servicesData.filter(s => s.category === activeCategory);

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-background text-foreground relative overflow-hidden">
      <Container size="2xl">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Capabilities & Expertise
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Full-Spectrum Digital Engineering For Market Leaders
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            From bespoke AI models to cloud infrastructure and scalable web platforms, we engineer end-to-end software designed for market domination.
          </p>

          {/* Interactive Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {[
              { id: "all", label: "All Capabilities" },
              { id: "ai", label: "AI Solutions" },
              { id: "web", label: "Web & SaaS" },
              { id: "mobile", label: "Mobile" },
              { id: "cloud", label: "Cloud & DevOps" },
              { id: "enterprise", label: "Enterprise" },
              { id: "design", label: "UI/UX" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  activeCategory === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service, idx) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              icon={service.icon}
              badge={service.badge}
              features={service.features}
              href={service.href}
              index={idx}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}