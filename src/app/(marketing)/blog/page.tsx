"use client";

import { Section, SectionTitle, Container, CTA } from "@/components/sections";
import { usePublicBlogsQuery } from "@/hooks/use-api-queries";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";

export default function BlogPage() {
  const { data: blogs, isLoading } = usePublicBlogsQuery();

  return (
    <>
      <Section className="pb-12 bg-slate-950">
        <SectionTitle 
          eyebrow="Blog" 
          title="Insights on strategy, engineering, and scale." 
          description="Thoughtful content for product leaders and technical teams." 
        />
        <Container>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-slate-900/50 rounded-2xl h-80 border border-slate-800" />
              ))}
            </div>
          ) : blogs?.length === 0 ? (
            <div className="text-center py-24 bg-slate-900/20 rounded-3xl border border-slate-800/50 mt-12">
              <h3 className="text-xl font-medium text-slate-300">No articles published yet</h3>
              <p className="text-slate-500 mt-2">Check back soon for insights and updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {blogs?.map((blog: any, idx: number) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group flex flex-col h-full bg-slate-900/40 hover:bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all overflow-hidden relative"
                >
                  <div className="p-6 sm:p-8 flex flex-col h-full z-10 relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                        {blog.category || "General"}
                      </span>
                      <span className="flex items-center text-xs text-slate-500 font-mono">
                        <Clock className="w-3 h-3 mr-1" />
                        {blog.readTime || 5} min read
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                      {blog.summary || "No summary available."}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-800/50 flex items-center justify-between">
                      <div className="flex items-center text-xs text-slate-500">
                        <User className="w-4 h-4 mr-1.5" />
                        <span>{blog.author?.name || "Admin"}</span>
                      </div>
                      <Link 
                        href={`/blog/${blog.slug}`} 
                        className="text-sm font-semibold text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all"
                      >
                        Read <ArrowRight className="w-4 h-4 text-blue-400" />
                      </Link>
                    </div>
                  </div>
                  
                  {/* Hover effect gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
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