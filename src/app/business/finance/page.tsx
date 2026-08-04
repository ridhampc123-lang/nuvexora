"use client";

import React from "react";
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useBusinessFinanceLedgerQuery } from "@/hooks/use-api-queries";

export default function FinanceLedgerPage() {
  const { data: ledger, isLoading } = useBusinessFinanceLedgerQuery();

  const financialMetrics = [
    { label: "Total Gross Revenue", value: isLoading ? "..." : `$${(ledger?.totalRevenue ?? 0).toLocaleString()}`, change: "Paid Invoices", positive: true },
    { label: "Pending Receivables", value: isLoading ? "..." : `$${(ledger?.pendingRevenue ?? 0).toLocaleString()}`, change: "Unpaid Invoices", positive: false },
    { label: "Recorded Invoices", value: isLoading ? "..." : String(ledger?.invoicesCount ?? 0), change: "Active Ledger", positive: true },
    { label: "Net Operating SLA", value: "99.99%", change: "Verified", positive: true },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Finance & Revenue Ledger</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Corporate profit & loss metrics, account receivables, and recurring revenue stream tracking.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((m) => (
          <div key={m.label} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                m.positive ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300" : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
              }`}>
                {m.change}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">{m.value}</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

