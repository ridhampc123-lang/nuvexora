"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { CTA } from "@/components/sections";
import { ArrowLeft, Clock, Calendar, User, Share2, Sparkles, CheckCircle2, Bookmark, Eye } from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  return (
    <main className="py-12 sm:py-16 lg:py-20 bg-slate-950 text-white min-h-screen relative overflow-hidden">
      {/* Dynamic Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[150px] pointer-events-none" />

      <Container size="medium" className="relative z-10">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
              Technical Insights
            </span>
            <span className="flex items-center text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              7 min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Building Micro-Frontend Architectures with Next.js 15 App Router
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            How to decompose massive enterprise React monoliths into isolated micro-frontends with sub-second page load times and zero dependency conflicts.
          </p>

          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Nuvexora Architecture Desk</div>
                <div className="text-xs text-slate-400 font-mono">Published on July 28, 2026</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Article link copied to clipboard!");
                  }
                }}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className="relative w-full h-[300px] sm:h-[450px] rounded-3xl overflow-hidden mb-12 border border-slate-800 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"
            alt="Micro-Frontend Architecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
        </div>

        {/* Article Body Content */}
        <article className="prose prose-invert max-w-none space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Executive Summary & Takeaways
            </h3>
            <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Micro-frontend isolation reduces regression blast radius across distributed engineering squads.</li>
              <li>Next.js App Router Module Federation allows asynchronous component streaming over CDN nodes.</li>
              <li>Shared dependency singletons decrease bundle size overhead by up to 64%.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white pt-4 border-b border-slate-800 pb-2">
            1. The Monolith Bottleneck in Modern Enterprise Teams
          </h2>
          <p>
            As software organizations grow past 50+ engineers, single-repo React applications become bottlenecks. Deployment pipelines slow down, continuous integration tests take 45+ minutes, and a bug introduced in one feature can bring down the entire customer portal.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4 border-b border-slate-800 pb-2">
            2. Implementing Module Federation with Next.js 15
          </h2>
          <p>
            Module Federation allows JavaScript applications to dynamically load code from another build at runtime. By decoupling core shell routes from individual domain modules (such as Billing, CRM, and Analytics), teams can build, test, and deploy independently.
          </p>

          <div className="p-4 rounded-xl bg-slate-900 border font-mono text-xs text-blue-300 overflow-x-auto">
            <code>
              {`// next.config.js - Micro-Frontend Remote Module Configuration
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'billing_portal',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './InvoiceList': './src/components/InvoiceList.tsx',
        },
      })
    );
    return config;
  },
};`}
            </code>
          </div>

          <h2 className="text-2xl font-bold text-white pt-4 border-b border-slate-800 pb-2">
            3. Key Architecture Benefits
          </h2>
          <p>
            By adopting modular micro-frontends, Nuvexora partners achieve 3x faster release velocity, zero cross-team deployment blocks, and 99.99% uptime guarantees across mission-critical SaaS products.
          </p>
        </article>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Blog Directory</span>
          </Link>
        </div>
      </Container>
    </main>
  );
}
