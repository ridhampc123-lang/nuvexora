"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { HelpCircle, ChevronDown, Search } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "process" | "security" | "tech" | "pricing";
}

const enterpriseFaqs: FAQItem[] = [
  {
    category: "general",
    question: "What core software & engineering services does Nuvexora Technologies offer?",
    answer: "Nuvexora Technologies provides full-spectrum digital product delivery: Web Development (Next.js/React), Mobile App Development (iOS/Android/React Native), Custom AI & Neural Systems, SaaS Product Engineering, Cloud Architecture & DevOps, Enterprise Software Modernization, UI/UX Design, E-Commerce, API Gateways, Workflow Automation, CRM, ERP, and 24/7 SLA Support."
  },
  {
    category: "process",
    question: "How do you ensure projects stay on schedule and within budget?",
    answer: "We employ a strict 7-phase delivery governance model with bi-weekly agile sprints. Scopes are bound by fixed-milestone acceptance tests, and clients receive full access to real-time Jira sprint velocity boards, direct Slack channels, and live staging preview environments."
  },
  {
    category: "tech",
    question: "Why do you specialize in Next.js 15, React 19, and TypeScript?",
    answer: "Next.js 15 and React 19 deliver server-side rendering, streaming edge components, and sub-second page loads that maximize Google SEO Core Web Vitals. TypeScript enforces strict type safety across the entire stack, eliminating runtime bugs and preventing long-term technical debt."
  },
  {
    category: "security",
    question: "What compliance standards and security safeguards do you enforce?",
    answer: "We adhere strictly to SOC2 Type II, ISO 27001, HIPAA (medical), and GDPR standards. All data at rest is encrypted with AES-256, network traffic uses TLS 1.3, and codebases undergo automated static vulnerability scans (Dependabot/Snyk) before production deployment."
  },
  {
    category: "pricing",
    question: "How does your pricing model work for enterprise engagements?",
    answer: "We offer two transparent pricing structures: Fixed-Scope Engagements (guaranteed milestone payments with zero budget overrun) and Dedicated Engineering Squads (flexible monthly sprint capacity for continuous roadmap execution). We never use hidden fees or synthetic price tags."
  },
  {
    category: "general",
    question: "Can Nuvexora take over an existing legacy codebase or half-finished product?",
    answer: "Yes! We specialize in legacy modernization and emergency project recovery. We perform a 50-point technical audit of your existing codebase, isolate critical bugs and technical debt, and refactor the platform into modern microservices with zero operational downtime."
  },
  {
    category: "tech",
    question: "How do your custom AI Solutions protect our company's proprietary data?",
    answer: "We build private RAG (Retrieval-Augmented Generation) knowledge engines and deploy open-weight LLMs (such as Llama 3 or DeepSeek) inside your private AWS/GCP cloud VPC. Your confidential data is never exposed to public third-party model training sets."
  },
  {
    category: "process",
    question: "Who will be working on our project, and where are they located?",
    answer: "You will be assigned a dedicated engineering pod consisting of a Senior Technical Lead, Senior Full-Stack Engineers, UI/UX Designer, and DevOps Architect. We operate with transparent communication protocols across North American and European time zones."
  },
  {
    category: "security",
    question: "Who retains ownership of the source code and intellectual property (IP)?",
    answer: "You do—100%. Upon milestone completion, all source code repositories, design tokens, vector assets, and infrastructure scripts belong exclusively to your organization under a full IP transfer agreement."
  },
  {
    category: "tech",
    question: "How do you guarantee 99.99% system availability and SLA uptime?",
    answer: "We architect multi-region cloud infrastructures on AWS/GCP with automated Kubernetes pod self-healing, database replication, Cloudflare edge caching, and 24/7/365 PagerDuty incident response routing."
  },
  {
    category: "pricing",
    question: "What is your typical project timeline from kickoff to production launch?",
    answer: "Standard web and mobile MVP projects typically launch in 6 to 12 weeks. Complex enterprise software migrations and multi-module ERP systems range from 12 to 24 weeks depending on functional scope."
  },
  {
    category: "process",
    question: "What happens after our product is deployed to production?",
    answer: "We provide comprehensive post-launch SLA maintenance retainers including 24/7 telemetry monitoring, automated security patch updates, database backups, and dedicated monthly development hours for continuous feature iterations."
  },
  {
    category: "general",
    question: "Do you offer staff augmentation or dedicated developer hiring?",
    answer: "Yes! Through our Dedicated Engineering Squad model, you can scale your internal engineering capacity instantly with senior Next.js, React, Node.js, Go, or Python developers who integrate seamlessly into your team."
  },
  {
    category: "tech",
    question: "How do you handle mobile app deployment to the Apple App Store and Google Play?",
    answer: "We take 100% ownership of the submission lifecycle including screenshot assets, privacy disclosure filings, Fastlane build scripts, and managing Apple/Google reviewer inquiries until full store approval."
  },
  {
    category: "general",
    question: "How do we get started with Nuvexora Technologies?",
    answer: "Simply click 'Book Free Strategy Call' to schedule a 45-minute discovery call with our principal engineering team. We will review your project requirements, outline an initial architecture, and provide a detailed proposal within 48 hours."
  }
];

export function ServicesFAQ() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = enterpriseFaqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-16 sm:py-24 bg-background text-foreground relative border-t border-slate-200/60 dark:border-slate-800/60">
      <Container size="2xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Answers & Clarity
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            Everything you need to know about our engineering standards, delivery timelines, security, and pricing.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search 15 enterprise FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {[
              { id: "all", label: "All Questions (15)" },
              { id: "general", label: "General & Capability" },
              { id: "tech", label: "Tech Stack & AI" },
              { id: "process", label: "Process & Governance" },
              { id: "security", label: "Security & IP" },
              { id: "pricing", label: "Pricing & Timelines" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id);
                  setOpenIndex(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                  activeCategory === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
              No matching questions found for "{searchQuery}". Try another keyword or browse all FAQs.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 sm:px-6 pb-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4 font-normal"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </Container>
    </section>
  );
}
