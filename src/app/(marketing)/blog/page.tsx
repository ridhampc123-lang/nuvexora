"use client";

import React, { useState } from "react";
import { Section, SectionTitle, Container, CTA } from "@/components/sections";
import { usePublicBlogsQuery } from "@/hooks/use-api-queries";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, User, Search, Sparkles, Tag, BookOpen } from "lucide-react";

const fallbackArticles = [
  {
    _id: "art-1",
    slug: "micro-frontend-architecture-nextjs-15",
    title: "Building Micro-Frontend Architectures with Next.js 15 App Router",
    summary: "How to decompose massive enterprise React monoliths into isolated micro-frontends with sub-second page load times and zero dependency conflicts.",
    category: "Architecture",
    readTime: "7 min read",
    publishedAt: "2026-07-28",
    author: { name: "Nuvexora Architecture Team", role: "Principal Systems Engineer" },
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    _id: "art-2",
    slug: "vector-databases-rag-ai-pipelines",
    title: "Deploying Custom Vector Databases for Enterprise RAG AI Pipelines",
    summary: "A practical step-by-step guide to scaling Pinecone and Qdrant vector indexes with PyTorch embedding models for real-time document search.",
    category: "AI & Data",
    readTime: "9 min read",
    publishedAt: "2026-07-20",
    author: { name: "Dr. Aris Thorne", role: "Head of AI Research" },
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    _id: "art-3",
    slug: "zero-downtime-cloud-deployment-eks-terraform",
    title: "Zero-Downtime Multi-Region Cloud Deployment on AWS EKS & Terraform",
    summary: "How we configured automated failover across us-east-1 and eu-west-1 clusters maintaining 99.999% SLA uptime under high load.",
    category: "DevOps",
    readTime: "6 min read",
    publishedAt: "2026-07-14",
    author: { name: "Marcus Sterling", role: "Lead Cloud Architect" },
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
  },
  {
    _id: "art-4",
    slug: "zero-trust-cybersecurity-saas-compliance",
    title: "Implementing Zero-Trust Security for Enterprise SaaS Applications",
    summary: "Strict SOC2 and ISO27001 compliance patterns: OAuth2, mTLS, biometric JWT claims, and immutable audit logging.",
    category: "Security",
    readTime: "8 min read",
    publishedAt: "2026-07-08",
    author: { name: "Elena Rostova", role: "VP of Cybersecurity" },
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop",
  },
  {
    _id: "art-5",
    slug: "scaling-typescript-codebases-1m-loc",
    title: "Scaling TypeScript Codebases Beyond 1 Million Lines of Code",
    summary: "Monorepo strategies, strict type safety bounds, automated lint pipelines, and compiler performance tuning.",
    category: "Software Engineering",
    readTime: "10 min read",
    publishedAt: "2026-07-02",
    author: { name: "Alex Vance", role: "Staff Engineer" },
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1516116211223-425856877086?q=80&w=1000&auto=format&fit=crop",
  },
  {
    _id: "art-6",
    slug: "saas-valuation-multiples-technical-due-diligence",
    title: "Technical Due Diligence: What Investors Look For in Modern SaaS Tech",
    summary: "Architectural audits, code quality debt analysis, infrastructure cost optimization, and IP security evaluations.",
    category: "Strategy",
    readTime: "7 min read",
    publishedAt: "2026-06-25",
    author: { name: "Nuvexora Advisory", role: "Partner Desk" },
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
  },
];

const categories = ["All", "Architecture", "AI & Data", "DevOps", "Security", "Software Engineering", "Strategy"];

export default function BlogPage() {
  const { data: dbBlogs, isLoading } = usePublicBlogsQuery();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const articlesList = (dbBlogs && dbBlogs.length > 0) ? dbBlogs : fallbackArticles;

  const filteredArticles = articlesList.filter((blog: any) => {
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.summary && blog.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articlesList.find((a: any) => a.featured) || articlesList[0];

  return (
    <>
      <Section className="py-12 sm:py-16 lg:py-20 bg-slate-950 text-white relative overflow-hidden">
        {/* Dynamic Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-indigo-600/10 blur-[130px] pointer-events-none" />

        <Container size="2xl" className="relative z-10">
          {/* Section Title */}
          <SectionTitle 
            eyebrow="Nuvexora Tech Insights" 
            title="Insights on strategy, engineering, and scale." 
            description="Thoughtful content for product leaders, technical founders, and enterprise software teams." 
            titleClassName="text-white font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl"
            descriptionClassName="text-slate-400 text-base sm:text-lg max-w-3xl"
          />

          {/* Search & Filter Bar */}
          <div className="mt-8 mb-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl backdrop-blur-xl shadow-xl">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                      : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles & topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Featured Article Hero (When no search filter applied) */}
          {selectedCategory === "All" && searchQuery === "" && featuredArticle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-16 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 hover:border-blue-500/40 transition-all overflow-hidden shadow-2xl group grid grid-cols-1 lg:grid-cols-12 gap-0"
            >
              {featuredArticle.coverImage && (
                <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-[420px] overflow-hidden bg-slate-950">
                  <img
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/90 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
                    <Sparkles className="w-3 h-3 text-cyan-300" />
                    <span>Featured Deep Dive</span>
                  </div>
                </div>
              )}

              <div className={`p-8 sm:p-10 lg:p-12 flex flex-col justify-between ${featuredArticle.coverImage ? "lg:col-span-6" : "lg:col-span-12"}`}>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
                      {featuredArticle.category}
                    </span>
                    <span className="flex items-center text-xs text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-snug group-hover:text-blue-300 transition-colors">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                    {featuredArticle.summary}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center text-xs text-slate-300 font-medium gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {typeof featuredArticle.author === "string" ? featuredArticle.author : featuredArticle.author?.name || "Nuvexora Engineering"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(featuredArticle.publishedAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredArticle.slug || featuredArticle._id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all group-hover:translate-x-1"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-slate-900/50 rounded-3xl h-96 border border-slate-800" />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
              <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No articles found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                No matching published insights found for "{searchQuery}". Try selecting a different category or refining your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((blog: any, idx: number) => (
                <motion.div
                  key={blog._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="group flex flex-col h-full bg-slate-900/60 hover:bg-slate-900/90 rounded-3xl border border-slate-800/90 hover:border-blue-500/40 transition-all duration-300 overflow-hidden shadow-xl relative"
                >
                  {blog.coverImage && (
                    <div className="relative w-full h-48 overflow-hidden bg-slate-950 shrink-0">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                    </div>
                  )}

                  <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between z-10 relative">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                          {blog.category || "General"}
                        </span>
                        <span className="flex items-center text-xs text-slate-400 font-mono">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                          {blog.readTime || "5 min read"}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors leading-snug line-clamp-2">
                        {blog.title}
                      </h3>

                      <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {blog.summary || blog.excerpt || "Technical analysis and engineering breakdown by Nuvexora."}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-slate-800/80 flex items-center justify-between mt-auto">
                      <div className="flex items-center text-xs text-slate-400 font-medium gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>
                          {new Date(blog.publishedAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      <Link 
                        href={`/blog/${blog.slug || blog._id}`} 
                        className="text-xs font-bold text-white hover:text-blue-300 flex items-center gap-1 transition-all group-hover:translate-x-1"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-4 h-4 text-blue-400" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </Section>
      <CTA />
    </>
  );
}