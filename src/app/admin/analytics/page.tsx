"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  LineChart, TrendingUp, Users, ArrowUpRight, ArrowDownRight, 
  Globe2, Cpu, DollarSign, Activity, Eye, Zap, RefreshCw, Filter 
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("30d");

  const metrics = [
    { title: "Total Platform Revenue", value: "$184,250", change: "+18.4%", positive: true, icon: DollarSign, subtext: "vs. previous month" },
    { title: "Active API Requests", value: "2.4M", change: "+42.1%", positive: true, icon: Activity, subtext: "Average latency 14ms" },
    { title: "New Client Conversions", value: "38", change: "+12.5%", positive: true, icon: Users, subtext: "Lead-to-client rate 24%" },
    { title: "System Uptime SLA", value: "99.998%", change: "0.00%", positive: true, icon: Cpu, subtext: "Multi-region cluster" }
  ];

  const trafficSources = [
    { source: "Direct & Organic Search", percentage: "58%", visitors: "142,500", color: "bg-blue-600" },
    { source: "Enterprise Referrals", percentage: "24%", visitors: "59,000", color: "bg-indigo-600" },
    { source: "Social & Thought Leadership", percentage: "12%", visitors: "29,400", color: "bg-sky-500" },
    { source: "Partner Integrations", percentage: "6%", visitors: "14,700", color: "bg-purple-600" },
  ];

  const topPages = [
    { title: "AI Solutions & Neural Engineering", url: "/services/ai-solutions", views: "48,200", conversion: "4.8%" },
    { title: "Veloce Financial Case Study", url: "/portfolio/veloce-financial", views: "34,100", conversion: "6.2%" },
    { title: "Enterprise Pricing & Retainers", url: "/pricing", views: "29,800", conversion: "11.4%" },
    { title: "HIPAA Cloud Security Architecture", url: "/blog/hipaa-cloud-security", views: "19,500", conversion: "3.1%" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
            <LineChart className="w-4 h-4" />
            <span>Business Intelligence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Executive Analytics & Telemetry</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Real-time performance metrics, client conversion funnels, and infrastructure telemetry.</p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Year to Date</option>
          </select>
          
          <button className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`inline-flex items-center text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  metric.positive ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                }`}>
                  {metric.positive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {metric.change}
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{metric.value}</div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{metric.title}</div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800/80 pt-2">
                {metric.subtext}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Traffic Channels */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-500" />
              <span>Traffic Distribution</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Channels</span>
          </div>

          <div className="space-y-4">
            {trafficSources.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{item.source}</span>
                  <span className="text-slate-900 dark:text-white">{item.visitors} ({item.percentage})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: item.percentage }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Showcase Pages */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-500" />
              <span>Highest Converting Content</span>
            </h3>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">View Full Heatmap</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {topPages.map((page, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-white hover:text-blue-500 cursor-pointer">{page.title}</div>
                  <div className="text-[11px] font-mono text-slate-400">{page.url}</div>
                </div>
                <div className="flex items-center gap-6 shrink-0 text-right">
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">{page.views}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">Unique Views</div>
                  </div>
                  <div>
                    <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">{page.conversion}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">Conv. Rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
