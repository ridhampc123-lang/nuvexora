"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Smartphone,
  BrainCircuit,
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
  ArrowRight,
  Filter,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { getPublicServices } from "@/lib/api/public-api";
import type { Service } from "@/types/service";

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Smartphone,
  BrainCircuit,
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
};

const categoryTabs = [
  { id: "all", label: "All 16 Services" },
  { id: "web", label: "Web & Apps" },
  { id: "mobile", label: "Mobile" },
  { id: "ai", label: "AI & Automation" },
  { id: "cloud", label: "Cloud & DevOps" },
  { id: "enterprise", label: "Enterprise Systems" },
  { id: "design", label: "UI/UX & Brand" },
  { id: "marketing", label: "Growth & SEO" },
];

export function ServicesCategories() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getPublicServices();
        setServicesData(data.map((s: any) => ({
          id: s._id,
          name: s.title,
          slug: s.slug,
          category: s.category,
          tagline: s.shortDescription || "",
          description: s.fullDescription || "",
          iconName: s.icon || "Code2",
          badge: s.badge || "",
          estimatedTimeline: "4-12 weeks", // Default or you can add to model
          features: s.features || [],
          technologies: [{ category: "Stack", items: s.technologies || [] }],
        })));
      } catch (error) {
        console.error("Failed to fetch public services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = servicesData.filter((service: Service) => {
    const matchesCategory =
      activeCategory === "all" ||
      service.category === activeCategory ||
      (activeCategory === "ai" && (service.category === "ai" || service.category === "automation")) ||
      (activeCategory === "web" && (service.category === "web" || service.slug === "saas-development"));

    const matchesSearch =
      searchQuery.trim() === "" ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="service-categories" className="py-16 sm:py-24 bg-slate-50/50 dark:bg-slate-900/40 relative">
      <Container size="2xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
            <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Explore Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Specialized Enterprise Capabilities
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            Select a service category to explore specs, technology stacks, deliverables, and timelines.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search services (e.g. AI, React, ERP, SEO)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  activeCategory === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + searchQuery}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {loading ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-slate-500">
                Loading services...
              </div>
            ) : filteredServices.map((service, idx) => {
              const Icon = iconMap[service.iconName] || Code2;
              return (
                <div
                  key={service.id}
                  className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon & Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      {service.badge && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200/60 dark:border-slate-700/60">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                        {service.tagline}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed font-normal">
                      {service.description}
                    </p>

                    {/* Tech Badges Preview */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {service.technologies[0]?.items.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer CTA */}
                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Est. Timeline: {service.estimatedTimeline}
                    </span>
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Explore Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
