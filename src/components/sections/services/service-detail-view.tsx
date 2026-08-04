"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Clock,
  Code,
  Layers,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Building2,
  HelpCircle,
  Briefcase,
  Globe,
  Bot,
  Smartphone,
  Cloud,
  Palette,
  TrendingUp,
  Search,
  Users,
  Boxes,
  ShoppingBag,
  Cpu,
  Lock,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import type { Service } from "@/types/service";
import { servicesData } from "@/data/services-data";
import { TestimonialsSection } from "@/components/sections/testimonials";

const iconMap: Record<string, React.ElementType> = {
  Code2: Code,
  Smartphone,
  BrainCircuit: Bot,
  Layers,
  Building2,
  Cloud,
  Palette,
  TrendingUp,
  Sparkles,
  Search,
  Bot,
  Users,
  Boxes,
  ShoppingBag,
  ShieldCheck,
  Cpu,
  Lock,
  Zap,
  Globe,
};

export function ServiceDetailView({ service }: { service: Service }) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const IconComponent = iconMap[service.iconName] || Code;

  // Retrieve related service objects
  const relatedServices = servicesData.filter((s) =>
    service.relatedSlugs.includes(s.slug) || (s.slug !== service.slug && service.relatedSlugs.includes(s.id))
  ).slice(0, 3);

  return (
    <article className="min-h-screen bg-background text-foreground">
      {/* 1. Hero Section */}
      <section className="relative py-10 sm:py-14 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <Container size="2xl" className="relative z-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li><ChevronRight className="w-3.5 h-3.5 text-slate-600" /></li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              </li>
              <li><ChevronRight className="w-3.5 h-3.5 text-slate-600" /></li>
              <li className="text-blue-400 font-semibold truncate max-w-[200px] sm:max-w-none">{service.name}</li>
            </ol>
          </nav>

          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <IconComponent className="w-4 h-4 text-blue-400" />
              <span>{service.name}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              {service.tagline}
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
              {service.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/book-consultation"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Book Free Consultation</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#overview"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-base transition-all"
              >
                <span>Explore Technical Specs</span>
              </a>
            </div>

            {/* Hero Stats */}
            {service.stats && service.stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80">
                {service.stats.map((st) => (
                  <div key={st.label} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center space-y-1">
                    <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">{st.value}</div>
                    <div className="text-xs text-slate-400 font-medium">{st.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* 2. Overview & Detailed Pitch */}
      <section id="overview" className="py-16 sm:py-24 bg-background text-foreground border-b border-slate-200/60 dark:border-slate-800/60">
        <Container size="2xl">
          <div className="max-w-4xl space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Capability Overview
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Engineering Market-Leading {service.name} Solutions
              </h2>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>{service.overview}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Business Challenges & Solutions Grid */}
      <section className="py-16 sm:py-24 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60">
        <Container size="2xl">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Business Challenges We Solve
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Transforming operational bottlenecks into competitive market advantages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Challenges */}
            <div className="p-8 rounded-3xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-6">
              <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300 font-extrabold text-xl">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <span>Common Industry Pain Points</span>
              </div>
              <div className="space-y-4">
                {service.businessChallenges.map((ch) => (
                  <div key={ch.title} className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-amber-200/40 dark:border-amber-900/30 space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{ch.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{ch.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Solution */}
            <div className="p-8 rounded-3xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-6">
              <div className="flex items-center gap-2.5 text-blue-800 dark:text-blue-300 font-extrabold text-xl">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Nuvexora Strategic Solution</span>
              </div>
              <div className="space-y-4">
                {service.ourSolution.map((sol) => (
                  <div key={sol.title} className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-blue-200/40 dark:border-blue-900/30 space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{sol.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{sol.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Core Features */}
      <section className="py-16 sm:py-24 bg-background text-foreground border-b border-slate-200/60 dark:border-slate-800/60">
        <Container size="2xl">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Feature Architecture & Engineering Specifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((feat) => {
              const FeatureIcon = (feat.iconName && iconMap[feat.iconName]) || Sparkles;
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <FeatureIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. Technology Stack */}
      <section className="py-16 sm:py-24 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60">
        <Container size="2xl">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Technology Stack & Frameworks
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              We leverage production-proven tools engineered for scale, reliability, and security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {service.technologies.map((tGroup) => (
              <div key={tGroup.category} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {tGroup.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tGroup.items.map((item) => (
                    <span key={item} className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. Development Process */}
      <section className="py-16 sm:py-24 bg-background text-foreground border-b border-slate-200/60 dark:border-slate-800/60">
        <Container size="2xl">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Development Process & Sprint Governance
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Step-by-step milestone execution ensuring predictable delivery timelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {service.developmentProcess.map((step) => (
              <div key={step.step} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  Step 0{step.step}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">{step.description}</p>
                {step.duration && (
                  <span className="inline-block text-[11px] font-semibold text-slate-500 dark:text-slate-400 pt-1">
                    {step.duration}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 7. Deliverables, Timeline & Benefits */}
      <section className="py-16 sm:py-24 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60">
        <Container size="2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Deliverables & Timeline */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Client Deliverables</h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  Est: {service.estimatedTimeline}
                </span>
              </div>
              <ul className="space-y-3">
                {service.deliverables.map((deliv) => (
                  <li key={deliv} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tangible Benefits */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tangible Business ROI</h3>
              <div className="space-y-4">
                {service.benefits.map((b) => (
                  <div key={b.title} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{b.title}</span>
                      {b.metric && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-600 text-white">
                          {b.metric}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{b.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Target Industries */}
      <section className="py-12 bg-background border-b border-slate-200/60 dark:border-slate-800/60">
        <Container size="2xl">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h3 className="text-base font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Primary Industries Served by {service.name}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {service.targetIndustries.map((ind) => (
                <span key={ind} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 9. Portfolio & Case Studies */}
      {service.caseStudies && service.caseStudies.length > 0 && (
        <section className="py-16 sm:py-24 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60">
          <Container size="2xl">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Featured Case Study
              </h2>
            </div>
            <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              {service.caseStudies.map((cs) => (
                <div key={cs.title} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {cs.industry}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{cs.client}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{cs.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-xs">
                      <span className="font-bold text-rose-700 dark:text-rose-400">Before: </span>
                      <span className="text-slate-600 dark:text-slate-300">{cs.before}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-xs">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">After: </span>
                      <span className="text-slate-600 dark:text-slate-300">{cs.after}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 10. FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-8 sm:py-12 bg-background text-foreground border-b border-slate-200/60 dark:border-slate-800/60">
          <Container size="2xl">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {service.name} Frequently Asked Questions
              </h2>
            </div>
            <div className="max-w-4xl mx-auto space-y-3">
              {service.faqs.map((faq, fIdx) => (
                <div key={faq.question} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === fIdx ? null : fIdx)}
                    className="w-full p-5 text-left flex items-center justify-between text-base font-bold text-slate-900 dark:text-white"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaqIndex === fIdx ? "rotate-180 text-blue-600" : ""}`} />
                  </button>
                  {openFaqIndex === fIdx && (
                    <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4 font-normal">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 11. Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60">
          <Container size="2xl">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Related Complementary Services
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedServices.map((rel) => (
                <div key={rel.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{rel.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{rel.description}</p>
                  </div>
                  <Link href={`/services/${rel.slug}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span>Explore {rel.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 12. Testimonials */}
      <TestimonialsSection />

      {/* 13. Contact CTA */}
      <section className="py-20 sm:py-24 bg-slate-950 text-white relative overflow-hidden border-t border-slate-900">
        {/* Ambient Glowing Background */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-600/20 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/15 blur-[130px] pointer-events-none" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:3rem_3rem]" />

        <Container size="2xl" className="text-center space-y-6 relative z-10 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
            Let's Build Your Next{" "}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              {service.name} Platform
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Schedule a free technical strategy call with our principal architects to align roadmap, budget, and delivery milestones.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/book-consultation"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/45 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-slate-800/85 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-base shadow-sm transition-all duration-300 backdrop-blur-md transform hover:-translate-y-0.5"
            >
              <span>Request Enterprise Quote</span>
            </Link>
          </div>
        </Container>
      </section>
    </article>
  );
}
