"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Cpu, Code2, Database, Cloud, ShieldCheck, BrainCircuit, Smartphone, Server } from "lucide-react";

interface TechCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  technologies: {
    name: string;
    description: string;
    badge?: string;
  }[];
}

const techCategories: TechCategory[] = [
  {
    id: "frontend",
    name: "Frontend",
    icon: Code2,
    description: "Modern, type-safe web frameworks engineered for sub-second page loads and 60fps animations.",
    technologies: [
      { name: "Next.js 15", description: "App Router, Server Components, Streaming SSR", badge: "Primary" },
      { name: "React 19", description: "Concurrent rendering, Server Actions, Hooks", badge: "Primary" },
      { name: "TypeScript", description: "Strict static typing and zero runtime type errors", badge: "Standard" },
      { name: "Tailwind CSS v4", description: "Utility-first design tokens and high-performance styles" },
      { name: "shadcn/ui", description: "Accessible headless primitive component architectures" },
      { name: "Framer Motion & GSAP", description: "Fluid micro-animations and smooth scroll interactions" },
      { name: "TanStack Query", description: "Optimistic asynchronous state management & caching" }
    ]
  },
  {
    id: "backend",
    name: "Backend",
    icon: Server,
    description: "High-throughput server runtimes, microservices gateways, and resilient REST/gRPC APIs.",
    technologies: [
      { name: "Node.js & Express", description: "High-concurrency event loop backend microservices", badge: "Core" },
      { name: "Go (Golang)", description: "Sub-10ms latency APIs and concurrent data pipelines", badge: "High Speed" },
      { name: "Java & Spring Boot", description: "Enterprise-grade transactional microservices" },
      { name: "Python & FastAPI", description: "AI inference backend endpoints and data processing" },
      { name: "GraphQL & Apollo", description: "Typed API schema queries eliminating over-fetching" },
      { name: "Kafka & RabbitMQ", description: "Asynchronous event streaming and message queues" }
    ]
  },
  {
    id: "database",
    name: "Database",
    icon: Database,
    description: "Acid-compliant relational ledgers, high-speed vector stores, and in-memory caches.",
    technologies: [
      { name: "PostgreSQL", description: "Relational database with RLS tenant isolation", badge: "Default" },
      { name: "Prisma & Drizzle", description: "Type-safe ORMs for instantaneous database queries" },
      { name: "Redis", description: "In-memory caching and high-speed session management" },
      { name: "pgvector & Pinecone", description: "High-accuracy vector databases for AI RAG pipelines", badge: "AI Core" },
      { name: "MongoDB", description: "Document database for unstructured content models" },
      { name: "Supabase & Firebase", description: "Serverless real-time data sync and webhooks" }
    ]
  },
  {
    id: "cloud",
    name: "Cloud",
    icon: Cloud,
    description: "Multi-region cloud infrastructure guarantees with auto-scaling and 99.99% SLAs.",
    technologies: [
      { name: "AWS Enterprise", description: "EC2, EKS, Lambda, S3, RDS, CloudFront", badge: "Primary Cloud" },
      { name: "Google Cloud (GCP)", description: "BigQuery ML, Vertex AI, GKE Kubernetes" },
      { name: "Microsoft Azure", description: "Azure DevOps, Enterprise Active Directory, AKS" },
      { name: "Vercel Enterprise", description: "Global edge deployment network for Next.js applications" },
      { name: "Cloudflare", description: "Edge DNS, Workers, DDoS mitigation, and SSL" }
    ]
  },
  {
    id: "devops",
    name: "DevOps",
    icon: ShieldCheck,
    description: "Automated Infrastructure as Code (IaC), container orchestration, and CI/CD delivery.",
    technologies: [
      { name: "Terraform & Pulumi", description: "Version-controlled Infrastructure as Code (IaC)", badge: "IaC Standard" },
      { name: "Kubernetes (EKS/GKE)", description: "Automated container cluster scaling and self-healing" },
      { name: "Docker", description: "Immutable container packaging for consistent environments" },
      { name: "GitHub Actions", description: "Zero-downtime CI/CD build & deployment pipelines" },
      { name: "Datadog & Grafana", description: "Real-time telemetry monitoring and 24/7 alert routing" }
    ]
  },
  {
    id: "ai",
    name: "AI & Neural",
    icon: BrainCircuit,
    description: "State-of-the-art machine learning models, RAG vector pipelines, and autonomous agents.",
    technologies: [
      { name: "PyTorch & TensorFlow", description: "Deep learning neural network training frameworks", badge: "ML Core" },
      { name: "LangChain & LlamaIndex", description: "Multi-agent orchestration and private RAG pipelines" },
      { name: "OpenAI GPT-4o & Claude 3.5", description: "Enterprise LLM APIs for reasoning and text generation" },
      { name: "Llama 3 & DeepSeek", description: "Open-weight private cloud LLMs for 100% data privacy" },
      { name: "vLLM & Ollama", description: "High-speed local LLM inference engines" }
    ]
  },
  {
    id: "mobile",
    name: "Mobile",
    icon: Smartphone,
    description: "Native iOS Swift, Android Kotlin, and cross-platform React Native apps.",
    technologies: [
      { name: "React Native", description: "Unified cross-platform apps with native performance", badge: "60 FPS" },
      { name: "Swift (iOS)", description: "Pure native iOS development for Apple ecosystems" },
      { name: "Kotlin (Android)", description: "Modern Android development with Jetpack Compose" },
      { name: "WatermelonDB & SQLite", description: "Offline-first local database persistence and sync" },
      { name: "Fastlane", description: "Automated App Store and Google Play deployment build scripts" }
    ]
  }
];

export function TechStackShowcase() {
  const [activeTab, setActiveTab] = useState<string>("frontend");
  const selectedCategory = techCategories.find((c) => c.id === activeTab) || techCategories[0];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/60 dark:bg-slate-900/40 relative">
      <Container size="2xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Modern Engineering Stack
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Battle-Tested Technology Ecosystem
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            We leverage open standards, type-safe frameworks, and enterprise cloud tools engineered to never become technical debt.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {techCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                    activeTab === cat.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6"
          >
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span>{selectedCategory.name} Engineering Capabilities</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-normal">
                {selectedCategory.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {selectedCategory.technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between space-y-2 hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      {tech.name}
                    </span>
                    {tech.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {tech.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-normal">
                    {tech.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
