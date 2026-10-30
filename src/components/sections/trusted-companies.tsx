"use client";

import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { 
  Shield, 
  Cpu, 
  Layers, 
  Zap, 
  Globe, 
  Activity, 
  TrendingUp, 
  Lock,
  Boxes,
  Database
} from "lucide-react";

const technologies = [
  { name: "Next.js 15", icon: Globe, metric: "Full-Stack Web" },
  { name: "React 19", icon: Layers, metric: "UI Engine" },
  { name: "TypeScript", icon: Shield, metric: "Strict Typing" },
  { name: "Node.js", icon: Cpu, metric: "API Backend" },
  { name: "Tailwind CSS", icon: Zap, metric: "Design Tokens" },
  { name: "PostgreSQL", icon: Database, metric: "Relational DB" },
  { name: "MongoDB", icon: Database, metric: "Document DB" },
  { name: "Docker", icon: Boxes, metric: "Containers" },
  { name: "Python / FastAPI", icon: Activity, metric: "AI & Services" },
  { name: "Cloud Infrastructure", icon: Lock, metric: "DevOps & IaC" },
];

export function TrustedCompanies() {
  return (
    <section className="py-6 sm:py-8 bg-slate-50/60 dark:bg-slate-950/40 border-y border-slate-200/80 dark:border-slate-800/80 overflow-hidden select-none">
      <Container size="2xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 mb-8">
          Powered By Modern Tools & Production-Grade Technologies
        </p>

        {/* Technology Ticker Container */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "linear",
            }}
            className="flex items-center gap-8 sm:gap-12 w-max"
          >
            {/* Duplicated array for seamless infinite loop */}
            {[...technologies, ...technologies].map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div
                  key={`${tech.name}-${idx}`}
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 group cursor-default"
                >
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                      {tech.name}
                    </div>
                    <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {tech.metric}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
