"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { CTA } from "@/components/sections";
import { usePublicBlogBySlugQuery } from "@/hooks/use-api-queries";
import { ArrowLeft, Clock, Calendar, User, Share2, Sparkles, Tag, BookOpen, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const { data: blog, isLoading } = usePublicBlogBySlugQuery(slug);

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard!");
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <main className="py-12 sm:py-16 lg:py-20 bg-slate-950 text-white min-h-screen relative overflow-hidden">
        <Container size="medium" className="relative z-10 space-y-8 animate-pulse">
          <div className="h-6 w-32 bg-slate-900 rounded-lg" />
          <div className="h-10 w-3/4 bg-slate-900 rounded-2xl" />
          <div className="h-6 w-1/2 bg-slate-900/60 rounded-xl" />
          <div className="h-72 w-full bg-slate-900/70 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-slate-900/60 rounded" />
            <div className="h-4 w-5/6 bg-slate-900/60 rounded" />
            <div className="h-4 w-4/6 bg-slate-900/60 rounded" />
          </div>
        </Container>
      </main>
    );
  }

  // Authentic 404 - Not found in database
  if (!blog) {
    return (
      <main className="py-20 sm:py-28 bg-slate-950 text-white min-h-screen relative flex items-center justify-center">
        <Container size="small" className="text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Article Not Found</h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            The publication you are requesting does not exist or has not been approved for public release.
          </p>
          <div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/25"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to All Publications</span>
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  const authorName = typeof blog.author === "string" ? blog.author : blog.author?.name || "Nuvexora Engineering";
  const publishedDate = new Date(blog.publishedAt || blog.createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  // Render article content with proper structure
  const renderContent = (content: string) => {
    if (!content) return null;

    // Split content into lines/blocks
    const blocks = content.split("\n\n");
    return blocks.map((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Header 3
      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={index} className="text-xl sm:text-2xl font-extrabold text-white pt-6 pb-2 border-b border-slate-800/80">
            {trimmed.replace("### ", "")}
          </h3>
        );
      }

      // Header 2
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl sm:text-3xl font-extrabold text-white pt-8 pb-3 border-b border-slate-800">
            {trimmed.replace("## ", "")}
          </h2>
        );
      }

      // Code blocks
      if (trimmed.startsWith("```")) {
        const codeText = trimmed.replace(/^```[a-z]*\n?/, "").replace(/```$/, "");
        return (
          <div key={index} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-xs sm:text-sm text-blue-300 overflow-x-auto shadow-inner my-4">
            <pre className="whitespace-pre">{codeText}</pre>
          </div>
        );
      }

      // Unordered lists
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split("\n").filter((l) => l.trim().startsWith("- ") || l.trim().startsWith("* "));
        return (
          <ul key={index} className="space-y-2 list-disc list-inside text-slate-300 my-4 text-sm sm:text-base">
            {items.map((item, itemIdx) => (
              <li key={itemIdx} className="leading-relaxed">
                {item.replace(/^[-*]\s+/, "")}
              </li>
            ))}
          </ul>
        );
      }

      // Standard Paragraph
      return (
        <p key={index} className="text-slate-300 text-sm sm:text-base leading-relaxed my-4">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <main className="py-12 sm:py-16 lg:py-20 bg-slate-950 text-white min-h-screen relative overflow-hidden">
      {/* Dynamic Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[150px] pointer-events-none" />

      <Container size="medium" className="relative z-10">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-6 mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
              {blog.category || "Technical Publication"}
            </span>
            <span className="flex items-center text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {blog.readTime || "5 min read"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {blog.title}
          </h1>

          {blog.summary && (
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {blog.summary}
            </p>
          )}

          {/* Author & Share Bar */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">{authorName}</div>
                <div className="text-xs text-slate-400 font-mono">Published on {publishedDate}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Cover Image (Only rendered if actual image exists in DB) */}
        {blog.coverImage && (
          <div className="relative w-full h-[300px] sm:h-[450px] rounded-3xl overflow-hidden mb-12 border border-slate-800 shadow-2xl bg-slate-950">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
          </div>
        )}

        {/* Article Body Content */}
        <article className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
          {renderContent(blog.content)}
        </article>

        {/* Tags */}
        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Topic Categories</div>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300"
                >
                  <Tag className="w-3 h-3 text-blue-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Articles</span>
          </Link>
        </div>
      </Container>
    </main>
  );
}
