"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

const techCategories = [
  { id: "all", label: "All Tech Stack" },
  { id: "frontend", label: "Frontend & Mobile" },
  { id: "backend", label: "Backend & Databases" },
  { id: "ai", label: "AI & Data Science" },
  { id: "cloud", label: "Cloud & DevOps" },
];

const technologies = [
  { name: "Next.js 15", category: "frontend", desc: "React 19 App Router & SSR", badge: "Primary" },
  { name: "React 19", category: "frontend", desc: "Server Components & Suspense", badge: "Frontend" },
  { name: "TypeScript 5", category: "frontend", desc: "Strict Type Safety Engine", badge: "Language" },
  { name: "Tailwind CSS v4", category: "frontend", desc: "Modern CSS Design System", badge: "Styling" },
  { name: "Framer Motion", category: "frontend", desc: "High-Performance Animations", badge: "Motion" },
  { name: "React Native", category: "frontend", desc: "Cross-Platform iOS/Android", badge: "Mobile" },

  { name: "Node.js & Express", category: "backend", desc: "High-Throughput Microservices", badge: "Runtime" },
  { name: "Python & FastAPI", category: "backend", desc: "Async Microservice APIs", badge: "Backend" },
  { name: "MongoDB Enterprise", category: "backend", desc: "Document Database Cluster", badge: "NoSQL" },
  { name: "PostgreSQL & Prisma", category: "backend", desc: "Relational Data Management", badge: "SQL" },
  { name: "Redis", category: "backend", desc: "In-Memory Caching & Queues", badge: "Cache" },
  { name: "GraphQL & REST", category: "backend", desc: "Unified API Protocols", badge: "API" },

  { name: "PyTorch & TensorFlow", category: "ai", desc: "Neural Network Training", badge: "AI Framework" },
  { name: "LangChain & LlamaIndex", category: "ai", desc: "LLM Orchestration & Agents", badge: "Agents" },
  { name: "Pinecone & Qdrant", category: "ai", desc: "High-Scale Vector Databases", badge: "Vector DB" },
  { name: "OpenAI & Anthropic APIs", category: "ai", desc: "Enterprise Foundation LLMs", badge: "Foundation" },

  { name: "AWS Cloud", category: "cloud", desc: "ECS, Lambda, EKS, RDS, S3", badge: "Cloud Provider" },
  { name: "Docker & Kubernetes", category: "cloud", desc: "Container Multi-Region Infra", badge: "Containers" },
  { name: "Terraform IaC", category: "cloud", desc: "Infrastructure as Code", badge: "DevOps" },
  { name: "GitHub Actions", category: "cloud", desc: "Automated CI/CD Workflows", badge: "Automation" },
];

export function TechnologiesSection() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredTech = activeTab === "all"
    ? technologies
    : technologies.filter(t => t.category === activeTab);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background text-foreground relative overflow-hidden">
      <Container size="2xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            Battle-Tested Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our World-Class Technology Ecosystem
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            We build exclusively with modern, scalable, and type-safe technologies proven at global enterprise scale.
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {techCategories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredTech.map((tech, idx) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileHover={{ y: -4 }}
              className="bg-slate-50/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-2xl p-5 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/80">
                    {tech.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {tech.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                  {tech.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}