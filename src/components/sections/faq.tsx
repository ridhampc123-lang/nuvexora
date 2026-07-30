"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { ChevronDown, Search, HelpCircle } from "lucide-react";

const faqCategories = [
  { id: "all", label: "All Questions" },
  { id: "engagement", label: "Engagement & Process" },
  { id: "tech", label: "Technology & AI" },
  { id: "security", label: "Security & IP" },
  { id: "pricing", label: "Pricing & Contracts" },
];

const faqs = [
  {
    category: "engagement",
    question: "How fast can Nuvexora deploy a dedicated engineering team for our project?",
    answer: "We typically onboard and deploy a fully staffed senior engineering team within 5 to 7 business days following technical discovery and milestone alignment."
  },
  {
    category: "tech",
    question: "What tech stack do you recommend for enterprise web and AI applications?",
    answer: "We specialize in Next.js 15, React 19, TypeScript, Tailwind CSS, Node.js/Python FastAPI microservices, and vector databases (Pinecone/Qdrant) deployed on AWS or GCP multi-region infrastructure."
  },
  {
    category: "security",
    question: "Who owns the Intellectual Property (IP) and source code created during the project?",
    answer: "You retain 100% full ownership of all source code, IP rights, design assets, and trained AI weights upon project completion. We sign strict non-disclosure agreements (NDAs) before any discovery call."
  },
  {
    category: "pricing",
    question: "Do you offer fixed-price quotes or time-and-materials billing?",
    answer: "We offer both: fixed-scope milestone engagements for well-defined MVPs/projects and monthly dedicated team retainers for continuous feature velocity and scaling."
  },
  {
    category: "security",
    question: "Are your AI solutions compliant with SOC2, GDPR, and HIPAA regulatory standards?",
    answer: "Yes. All our cloud architectures, AI data pipelines, and database schemas are engineered with strict SOC2 Type II, ISO 27001, HIPAA, and GDPR compliance controls."
  },
  {
    category: "engagement",
    question: "How do you ensure project transparency and communication during development?",
    answer: "You get direct access to your dedicated Technical Lead via dedicated Slack/Teams channels, bi-weekly sprint demos, real-time Jira/Linear tracking, and staging environment previews."
  }
];

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-background text-foreground relative overflow-hidden">
      <Container size="2xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything You Need To Know
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Have questions about working with Nuvexora? Here are answers to common inquiries from our clients.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto pt-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-7 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 text-sm text-slate-900 dark:text-white transition-all outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
              No matching questions found. Try searching with a different term.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={faq.question}
                  className="bg-slate-50/80 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 hover:bg-white dark:hover:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700"
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-base sm:text-lg focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 sm:px-6 pb-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-800 pt-4">
                          {faq.answer}
                        </div>
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