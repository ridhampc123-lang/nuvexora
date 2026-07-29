"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";

export function CTA() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background text-foreground relative overflow-hidden">
      <Container size="2xl">
        <div className="relative rounded-[2.5rem] bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 p-8 sm:p-12 lg:p-16 text-white overflow-hidden shadow-2xl shadow-blue-950/20 border border-slate-800">
          {/* Ambient Glowing Background */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-600/30 blur-[130px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-[130px] pointer-events-none" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:3rem_3rem]" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-widest border border-blue-500/20 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Ready To Elevate Your Platform?
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              Let’s Engineer Your Next{" "}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                Market Breakthrough.
              </span>
            </h2>

            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Schedule a technical strategy consultation with our Principal Solutions Architect. Receive a full architectural proposal in 48 hours.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/book-consultation"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/45 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Book Technical Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-base shadow-sm transition-all duration-300 backdrop-blur-md transform hover:-translate-y-0.5"
              >
                <span>Contact Enterprise Sales</span>
              </Link>
            </div>

            {/* Guarantees */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs sm:text-sm text-slate-400 font-medium pt-6">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Strict NDA Signed Prior to Call
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Zero Obligation Architectural Assessment
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}