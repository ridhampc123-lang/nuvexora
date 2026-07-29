"use client";

import React, { useState } from "react";
import { TrendingUp, Plus, DollarSign, Building2, User } from "lucide-react";

interface DealItem {
  id: string;
  title: string;
  client: string;
  value: string;
  stage: "prospecting" | "qualification" | "proposal" | "closed_won";
  probability: number;
}

const initialDeals: DealItem[] = [
  { id: "1", title: "Global Logistics Neural Route Platform", client: "OmniLogistics", value: "$95,000", stage: "prospecting", probability: 30 },
  { id: "2", title: "Enterprise Risk Assessment AI Engine", client: "Veloce Financial", value: "$140,000", stage: "proposal", probability: 75 },
  { id: "3", title: "Multi-Region Cloud Infrastructure Migration", client: "Apex Health", value: "$85,000", stage: "qualification", probability: 50 },
  { id: "4", title: "AWS Cost Optimization Suite", client: "NovaScale", value: "$42,000", stage: "closed_won", probability: 100 },
];

export default function CrmDealsPage() {
  const [deals] = useState<DealItem[]>(initialDeals);

  const stages = [
    { key: "prospecting", label: "Discovery & Lead", color: "border-slate-300 bg-slate-50" },
    { key: "qualification", label: "Tech Qualification", color: "border-blue-300 bg-blue-50/40" },
    { key: "proposal", label: "Proposal Submitted", color: "border-indigo-300 bg-indigo-50/40" },
    { key: "closed_won", label: "Closed / Won Contract", color: "border-emerald-300 bg-emerald-50/40" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">CRM Deal Pipeline & Sales Funnel</h1>
          <p className="text-xs text-slate-500 mt-1">Manage corporate enterprise deals, contract valuations, and win probability percentages.</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>New Opportunity</span>
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.key);
          const totalValue = stageDeals.reduce((sum, d) => sum + parseInt(d.value.replace(/[^0-9]/g, "")), 0);

          return (
            <div key={stage.key} className={`rounded-3xl p-4 border ${stage.color} flex flex-col justify-between min-h-[450px]`}>
              <div>
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3 mb-4">
                  <span className="font-extrabold text-slate-900 dark:text-white text-xs tracking-tight">{stage.label}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200/60 dark:border-slate-700">
                    {stageDeals.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {stageDeals.map((deal) => (
                    <div key={deal.id} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug mb-1">{deal.title}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-3">{deal.client}</div>

                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2 text-xs">
                        <span className="font-extrabold text-blue-600 dark:text-blue-400">{deal.value}</span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                          {deal.probability}% Win
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/60 text-right text-xs font-extrabold text-slate-700">
                Stage Total: ${totalValue.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
