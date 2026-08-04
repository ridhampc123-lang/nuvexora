"use client";

import React, { useState } from "react";
import { TrendingUp, Plus, DollarSign, Building2, User } from "lucide-react";
import { useBusinessDealsQuery, useCreateBusinessDealMutation } from "@/hooks/use-api-queries";
import { toast } from "sonner";

interface DealItem {
  id: string;
  title: string;
  client: string;
  value: string;
  stage: "prospecting" | "qualification" | "proposal" | "closed_won";
  probability: number;
}

export default function CrmDealsPage() {
  const { data: dbDeals = [], isLoading } = useBusinessDealsQuery();
  const createMutation = useCreateBusinessDealMutation();

  const deals: DealItem[] = dbDeals.map((d: any) => ({
    id: d._id || d.id,
    title: d.title,
    client: d.clientName || d.client || "Client Account",
    value: typeof d.value === "number" ? `$${d.value.toLocaleString()}` : (d.value || "$0"),
    stage: d.stage || "prospecting",
    probability: d.probability ?? 50,
  }));

  const handleNewOpportunity = () => {
    const title = prompt("Enter Opportunity Title:");
    if (!title) return;
    const clientName = prompt("Enter Client Name:") || "New Prospect";
    const valueNum = parseInt(prompt("Enter estimated valuation (USD):") || "50000", 10);

    createMutation.mutate(
      { title, clientName, value: valueNum, stage: "prospecting", probability: 30 },
      {
        onSuccess: () => toast.success("CRM Opportunity created!"),
        onError: () => toast.error("Failed to create opportunity"),
      }
    );
  };

  const stages = [
    { key: "prospecting", label: "Discovery & Lead", color: "border-slate-300 bg-slate-50 dark:bg-slate-900/40" },
    { key: "qualification", label: "Tech Qualification", color: "border-blue-300 bg-blue-50/40 dark:bg-blue-950/20" },
    { key: "proposal", label: "Proposal Submitted", color: "border-indigo-300 bg-indigo-50/40 dark:bg-indigo-950/20" },
    { key: "closed_won", label: "Closed / Won Contract", color: "border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">CRM Deal Pipeline & Sales Funnel</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage corporate enterprise deals, contract valuations, and win probability percentages.</p>
        </div>

        <button 
          onClick={handleNewOpportunity}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Opportunity</span>
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.key);
          const totalValue = stageDeals.reduce((sum, d) => sum + parseInt(String(d.value).replace(/[^0-9]/g, "") || "0"), 0);

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
                  {stageDeals.length === 0 && (
                    <div className="p-6 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      No deals in this stage
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/60 text-right text-xs font-extrabold text-slate-700 dark:text-slate-300">
                Stage Total: ${totalValue.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

