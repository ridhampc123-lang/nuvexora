"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { ArrowRight, Clock, Calendar } from "lucide-react";

const articles = [
  {
    title: "Building Micro-Frontend Architectures with Next.js 15 App Router",
    category: "Architecture",
    readTime: "6 min read",
    date: "July 18, 2026",
    excerpt: "Learn how to decompose massive enterprise React applications into high-speed micro-frontends with sub-second page loads.",
    href: "/blog/micro-frontend-architecture-nextjs-15",
  },
  {
    title: "Deploying Custom Vector Databases for Enterprise RAG AI Pipelines",
    category: "AI & Data",
    readTime: "8 min read",
    date: "July 12, 2026",
    excerpt: "A comprehensive guide to scaling Pinecone and Qdrant vector indexes with PyTorch embedding models for real-time document search.",
    href: "/blog/deploying-vector-databases-rag-ai",
  },
  {
    title: "Zero-Downtime Multi-Region Cloud Deployment on AWS EKS & Terraform",
    category: "DevOps",
    readTime: "5 min read",
    date: "July 04, 2026",
    excerpt: "How we configured automated failover across us-east-1 and eu-west-1 clusters maintaining 99.999% SLA uptime.",
    href: "/blog/zero-downtime-aws-eks-terraform",
  },
];

export function BlogPreviewSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-50/60 dark:bg-slate-950/60 border-y border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
      <Container size="2xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
              Technical Insights & Thoughts
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Latest From Our Engineering Lab
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Deep dives into AI engineering, React server components, cloud scalability, and modern software design.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 text-slate-900 dark:text-slate-100 font-bold text-sm shadow-sm hover:shadow transition-all group shrink-0"
          >
            <span>Explore All Articles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article, idx) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {article.date}
                </span>
                <Link
                  href={article.href}
                  className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
