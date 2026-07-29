"use client";

import React from "react";
import { BookOpen, Search } from "lucide-react";

export default function EmployeeKnowledgeBasePage() {
  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <span>Internal Knowledge Base</span>
        </h1>
        <p className="text-xs text-slate-400">Engineering guidelines, Next.js 15 standards, and architecture runbooks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Next.js 15 App Router & Edge Caching Guide", cat: "Engineering" },
          { title: "SOC2 Compliance & Secret Key Vault Runbook", cat: "Security" },
          { title: "Tailwind CSS v4 & Atomic Design Token Specs", cat: "Frontend" }
        ].map((kb) => (
          <div key={kb.title} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400">{kb.cat}</span>
            <h2 className="text-base font-bold text-white">{kb.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
