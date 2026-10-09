"use client";

import React, { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Star,
  Globe,
  Coins,
  ArrowUpDown,
  Sparkles,
  Layers,
  Save,
  FileSpreadsheet,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Clock,
  Users
} from "lucide-react";
import {
  getAdminPricingPlans,
  createAdminPricingPlan,
  updateAdminPricingPlan,
  deleteAdminPricingPlan,
  getAdminCurrencies,
  createAdminCurrency,
  updateAdminCurrency,
  deleteAdminCurrency
} from "@/lib/api/admin-api";
import { executeMasterExcelExport, executeEmergencyJsonBackup } from "@/lib/export/master-excel-exporter";
import { toast } from "sonner";

interface FeatureCategory {
  category: string;
  items: string[];
}

interface PlanItem {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  badge?: string;
  isPopular: boolean;
  isActive: boolean;
  order: number;
  description: string;
  monthlyPriceUSD: number;
  monthlyPriceINR: number;
  fixedPriceUSD: number;
  fixedPriceINR: number;
  annualDiscountPercent: number;
  deliveryTime: string;
  squadComposition: string;
  idealFor: string;
  highlightedFeatures: string[];
  features?: FeatureCategory[];
  ctaText: string;
  ctaHref: string;
}

interface CurrencyItem {
  _id?: string;
  id?: string;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
  isActive: boolean;
  order?: number;
}

export default function AdminPricingPage() {
  const [activeTab, setActiveTab] = useState<"plans" | "currencies">("plans");
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<CurrencyItem | null>(null);

  // Plan Form State
  const [planForm, setPlanForm] = useState<Partial<PlanItem>>({
    name: "",
    slug: "",
    badge: "",
    isPopular: false,
    isActive: true,
    order: 0,
    description: "",
    monthlyPriceUSD: 4900,
    monthlyPriceINR: 399000,
    fixedPriceUSD: 8500,
    fixedPriceINR: 690000,
    annualDiscountPercent: 15,
    deliveryTime: "4 to 6 Weeks",
    squadComposition: "1 Lead + 2 Devs + UI/UX",
    idealFor: "",
    highlightedFeatures: [],
    ctaText: "Launch Project",
    ctaHref: "/book-consultation"
  });

  const [newFeatureInput, setNewFeatureInput] = useState("");

  // Currency Form State
  const [currencyForm, setCurrencyForm] = useState<Partial<CurrencyItem>>({
    code: "",
    name: "",
    symbol: "",
    exchangeRate: 1.0,
    isDefault: false,
    isActive: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [pricingData, currenciesData] = await Promise.all([
        getAdminPricingPlans(),
        getAdminCurrencies()
      ]);

      if (pricingData && Array.isArray(pricingData.plans)) {
        setPlans(pricingData.plans);
      }
      if (Array.isArray(currenciesData)) {
        setCurrencies(currenciesData);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pricing data from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- PLAN HANDLERS ---

  const handleOpenCreatePlan = () => {
    setEditingPlan(null);
    setPlanForm({
      name: "",
      slug: "",
      badge: "",
      isPopular: false,
      isActive: true,
      order: plans.length + 1,
      description: "",
      monthlyPriceUSD: 4900,
      monthlyPriceINR: 399000,
      fixedPriceUSD: 8500,
      fixedPriceINR: 690000,
      annualDiscountPercent: 15,
      deliveryTime: "4 to 6 Weeks",
      squadComposition: "1 Lead + 2 Devs + UI/UX",
      idealFor: "",
      highlightedFeatures: [
        "Full-Stack Next.js Architecture",
        "Custom API & PostgreSQL Database",
        "Dedicated UI/UX Design System",
        "30-Day SLA Warranty"
      ],
      ctaText: "Launch Project",
      ctaHref: "/book-consultation"
    });
    setNewFeatureInput("");
    setShowPlanModal(true);
  };

  const handleOpenEditPlan = (plan: PlanItem) => {
    setEditingPlan(plan);
    setPlanForm({
      ...plan,
      highlightedFeatures: [...(plan.highlightedFeatures || [])]
    });
    setNewFeatureInput("");
    setShowPlanModal(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name || !planForm.description) {
      toast.error("Please enter a plan name and description");
      return;
    }

    try {
      if (editingPlan?._id || editingPlan?.id) {
        const id = (editingPlan._id || editingPlan.id) as string;
        await updateAdminPricingPlan({ id, ...planForm });
        toast.success(`Updated plan '${planForm.name}' successfully!`);
      } else {
        await createAdminPricingPlan(planForm);
        toast.success(`Created plan '${planForm.name}' successfully!`);
      }
      setShowPlanModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save plan");
    }
  };

  const handleDeletePlan = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete plan "${name}"?`)) return;
    try {
      await deleteAdminPricingPlan(id);
      toast.success(`Deleted plan "${name}"`);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete plan");
    }
  };

  const handleTogglePlanActive = async (plan: PlanItem) => {
    const id = (plan._id || plan.id) as string;
    try {
      await updateAdminPricingPlan({ id, isActive: !plan.isActive });
      toast.success(`${plan.name} is now ${!plan.isActive ? "Active" : "Hidden"}`);
      loadData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleTogglePopular = async (plan: PlanItem) => {
    const id = (plan._id || plan.id) as string;
    try {
      await updateAdminPricingPlan({ id, isPopular: !plan.isPopular });
      toast.success(`Updated popular ribbon for ${plan.name}`);
      loadData();
    } catch (err) {
      toast.error("Failed to update popular ribbon");
    }
  };

  const addFeatureItem = () => {
    if (!newFeatureInput.trim()) return;
    setPlanForm((prev) => ({
      ...prev,
      highlightedFeatures: [...(prev.highlightedFeatures || []), newFeatureInput.trim()]
    }));
    setNewFeatureInput("");
  };

  const removeFeatureItem = (index: number) => {
    setPlanForm((prev) => ({
      ...prev,
      highlightedFeatures: (prev.highlightedFeatures || []).filter((_, i) => i !== index)
    }));
  };

  // --- CURRENCY HANDLERS ---

  const handleOpenCreateCurrency = () => {
    setEditingCurrency(null);
    setCurrencyForm({
      code: "",
      name: "",
      symbol: "",
      exchangeRate: 1.0,
      isDefault: false,
      isActive: true
    });
    setShowCurrencyModal(true);
  };

  const handleOpenEditCurrency = (curr: CurrencyItem) => {
    setEditingCurrency(curr);
    setCurrencyForm({ ...curr });
    setShowCurrencyModal(true);
  };

  const handleSaveCurrency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currencyForm.code || !currencyForm.symbol || !currencyForm.name) {
      toast.error("Please fill in code, symbol, and currency name");
      return;
    }

    try {
      if (editingCurrency?._id || editingCurrency?.id) {
        const id = (editingCurrency._id || editingCurrency.id) as string;
        await updateAdminCurrency({ id, ...currencyForm });
        toast.success(`Updated currency ${currencyForm.code}`);
      } else {
        await createAdminCurrency(currencyForm);
        toast.success(`Added new currency ${currencyForm.code}`);
      }
      setShowCurrencyModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save currency");
    }
  };

  const handleDeleteCurrency = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete currency "${code}"?`)) return;
    try {
      await deleteAdminCurrency(id);
      toast.success(`Deleted currency "${code}"`);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete currency");
    }
  };

  const handleSetDefaultCurrency = async (curr: CurrencyItem) => {
    const id = (curr._id || curr.id) as string;
    try {
      await updateAdminCurrency({ id, isDefault: true });
      toast.success(`Set ${curr.code} as default global currency`);
      loadData();
    } catch (err) {
      toast.error("Failed to update default currency");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header Bar with Master Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dynamic CMS Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dynamic Pricing & Multi-Currency System
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Full autonomy to add, modify, reorder, and remove investment tiers and global currencies with instant public site reflection.
          </p>
        </div>

        {/* Master Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={executeMasterExcelExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            title="Export all database collections into an Excel Workbook (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Master Excel Export</span>
          </button>

          <button
            type="button"
            onClick={executeEmergencyJsonBackup}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            title="Download complete JSON snapshot of all system collections"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Backup</span>
          </button>

          <button
            type="button"
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Tiers</span>
            <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {plans.length}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Live Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {plans.filter((p) => p.isActive).length}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Featured Tier</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate block">
            {plans.find((p) => p.isPopular)?.name || "None Selected"}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Currencies</span>
            <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {currencies.length}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("plans")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === "plans"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Pricing Plans ({plans.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("currencies")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === "currencies"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Global Currencies ({currencies.length})</span>
        </button>
      </div>

      {/* TAB 1: PRICING PLANS */}
      {activeTab === "plans" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Live Investment Tiers
            </h2>
            <button
              type="button"
              onClick={handleOpenCreatePlan}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Plan</span>
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
              <p>Loading pricing tiers from database...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="p-12 text-center bg-card border border-border rounded-3xl">
              <p className="text-slate-500 mb-3">No pricing plans found.</p>
              <button
                type="button"
                onClick={handleOpenCreatePlan}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Create Your First Plan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const planId = (plan._id || plan.id) as string;

                return (
                  <div
                    key={planId || plan.slug}
                    className={`rounded-3xl border p-6 flex flex-col justify-between transition-all bg-card shadow-xs ${
                      plan.isPopular
                        ? "border-blue-500 ring-2 ring-blue-500/20"
                        : "border-border"
                    } ${!plan.isActive ? "opacity-60" : ""}`}
                  >
                    <div className="space-y-4">
                      {/* Badge & Popular Pill */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-800/50 px-2.5 py-0.5 rounded-full">
                          {plan.badge || "Tier"}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleTogglePopular(plan)}
                            className={`p-1 rounded-full transition-colors ${
                              plan.isPopular
                                ? "text-amber-500 hover:text-amber-600"
                                : "text-slate-300 dark:text-slate-600 hover:text-amber-400"
                            }`}
                            title="Toggle Popular/Recommended ribbon"
                          >
                            <Star className={`w-4 h-4 ${plan.isPopular ? "fill-current" : ""}`} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTogglePlanActive(plan)}
                            className={`p-1 rounded-full ${
                              plan.isActive ? "text-emerald-500" : "text-slate-400"
                            }`}
                            title={plan.isActive ? "Active (visible on site)" : "Hidden"}
                          >
                            {plan.isActive ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {plan.description}
                        </p>
                      </div>

                      {/* Pricing Display */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-border/80 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Monthly Sprint:</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            ${plan.monthlyPriceUSD.toLocaleString()} / ₹{plan.monthlyPriceINR.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Fixed Milestone:</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            ${plan.fixedPriceUSD.toLocaleString()} / ₹{plan.fixedPriceINR.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Cadence & Squad */}
                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="truncate">{plan.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="truncate">{plan.squadComposition}</span>
                        </div>
                      </div>

                      {/* Features Preview */}
                      <div className="space-y-1 pt-2 border-t border-border/60">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Features ({plan.highlightedFeatures?.length || 0})
                        </span>
                        <ul className="space-y-1">
                          {(plan.highlightedFeatures || []).slice(0, 3).map((feat, i) => (
                            <li key={i} className="text-xs text-slate-700 dark:text-slate-300 truncate">
                              • {feat}
                            </li>
                          ))}
                          {(plan.highlightedFeatures?.length || 0) > 3 && (
                            <li className="text-[11px] text-blue-600 dark:text-blue-400">
                              + {(plan.highlightedFeatures?.length || 0) - 3} more...
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-border/60 flex items-center justify-between gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => handleOpenEditPlan(plan)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePlan(planId, plan.name)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GLOBAL CURRENCIES */}
      {activeTab === "currencies" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Supported Currencies
              </h2>
              <p className="text-xs text-slate-500">
                Configure conversion rates relative to USD (USD = 1.0). Visitors can toggle any active currency on the public website.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreateCurrency}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Currency</span>
            </button>
          </div>

          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-border bg-slate-50/80 dark:bg-slate-900/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Currency</th>
                    <th className="p-4">Symbol</th>
                    <th className="p-4">Exchange Rate (vs $1 USD)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Default</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                  {currencies.map((curr) => {
                    const currId = (curr._id || curr.id) as string;

                    return (
                      <tr key={curr.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          <span className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-xs mr-2">
                            {curr.code}
                          </span>
                          <span>{curr.name}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {curr.symbol}
                        </td>
                        <td className="p-4 text-slate-700 dark:text-slate-300 font-mono">
                          1 USD = {curr.exchangeRate} {curr.code}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              curr.isActive
                                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                            }`}
                          >
                            {curr.isActive ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="p-4">
                          {curr.isDefault ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                              <Star className="w-3 h-3 fill-current" />
                              Default
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultCurrency(curr)}
                              className="text-xs text-slate-500 hover:text-blue-600 underline"
                            >
                              Make Default
                            </button>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCurrency(curr)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                            title="Edit Currency"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {!curr.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCurrency(currId, curr.code)}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600"
                              title="Delete Currency"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PLAN MODAL (CREATE / EDIT) */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card text-foreground rounded-3xl border border-border shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-xl font-extrabold">
                {editingPlan ? "Edit Pricing Plan" : "Create New Pricing Plan"}
              </h3>
              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-5 text-xs sm:text-sm">
              {/* Row 1: Name, Slug, Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold block mb-1">Plan Name *</label>
                  <input
                    type="text"
                    required
                    value={planForm.name || ""}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    placeholder="e.g. AI Innovation Sprint"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={planForm.slug || ""}
                    onChange={(e) => setPlanForm({ ...planForm, slug: e.target.value })}
                    placeholder="e.g. ai-sprint"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Badge Ribbon</label>
                  <input
                    type="text"
                    value={planForm.badge || ""}
                    onChange={(e) => setPlanForm({ ...planForm, badge: e.target.value })}
                    placeholder="e.g. Most Popular"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold block mb-1">Plan Description *</label>
                <textarea
                  required
                  rows={2}
                  value={planForm.description || ""}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  placeholder="Target audience and value proposition..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border outline-none focus:border-blue-500"
                />
              </div>

              {/* Row 2: Pricing USD & INR */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-border">
                <div>
                  <label className="font-bold block mb-1">Monthly USD ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={planForm.monthlyPriceUSD ?? 0}
                    onChange={(e) => setPlanForm({ ...planForm, monthlyPriceUSD: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Fixed USD ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={planForm.fixedPriceUSD ?? 0}
                    onChange={(e) => setPlanForm({ ...planForm, fixedPriceUSD: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Monthly INR (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={planForm.monthlyPriceINR ?? 0}
                    onChange={(e) => setPlanForm({ ...planForm, monthlyPriceINR: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Fixed INR (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={planForm.fixedPriceINR ?? 0}
                    onChange={(e) => setPlanForm({ ...planForm, fixedPriceINR: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Cadence & Squad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1">Delivery Timeframe</label>
                  <input
                    type="text"
                    value={planForm.deliveryTime || ""}
                    onChange={(e) => setPlanForm({ ...planForm, deliveryTime: e.target.value })}
                    placeholder="e.g. 3 to 5 Weeks"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Squad Composition</label>
                  <input
                    type="text"
                    value={planForm.squadComposition || ""}
                    onChange={(e) => setPlanForm({ ...planForm, squadComposition: e.target.value })}
                    placeholder="e.g. 1 Tech Lead + 2 Fullstack Devs + 1 Designer"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border outline-none"
                  />
                </div>
              </div>

              {/* Highlighted Features Builder */}
              <div>
                <label className="font-bold block mb-1">Checklist Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    placeholder="Add a key feature deliverable..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border outline-none"
                  />
                  <button
                    type="button"
                    onClick={addFeatureItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border">
                  {(planForm.highlightedFeatures || []).map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-card text-xs"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => removeFeatureItem(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={planForm.isActive}
                    onChange={(e) => setPlanForm({ ...planForm, isActive: e.target.checked })}
                    className="size-4 rounded accent-blue-600"
                  />
                  <span>Active & Visible on Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={planForm.isPopular}
                    onChange={(e) => setPlanForm({ ...planForm, isPopular: e.target.checked })}
                    className="size-4 rounded accent-blue-600"
                  />
                  <span>Highlighted (Most Popular Ribbon)</span>
                </label>
              </div>

              {/* Submit / Cancel */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md"
                >
                  Save Pricing Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CURRENCY MODAL (CREATE / EDIT) */}
      {showCurrencyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card text-foreground rounded-3xl border border-border shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-extrabold">
                {editingCurrency ? "Edit Global Currency" : "Add Global Currency"}
              </h3>
              <button
                type="button"
                onClick={() => setShowCurrencyModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCurrency} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold block mb-1">Currency Code (ISO) *</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={currencyForm.code || ""}
                  onChange={(e) => setCurrencyForm({ ...currencyForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. EUR, GBP, AED, CAD"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Currency Name *</label>
                <input
                  type="text"
                  required
                  value={currencyForm.name || ""}
                  onChange={(e) => setCurrencyForm({ ...currencyForm, name: e.target.value })}
                  placeholder="e.g. Euro, British Pound, Dirham"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Symbol *</label>
                  <input
                    type="text"
                    required
                    value={currencyForm.symbol || ""}
                    onChange={(e) => setCurrencyForm({ ...currencyForm, symbol: e.target.value })}
                    placeholder="e.g. €, £, AED, ¥"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Rate (1 USD = X) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    required
                    value={currencyForm.exchangeRate ?? 1.0}
                    onChange={(e) => setCurrencyForm({ ...currencyForm, exchangeRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={currencyForm.isActive}
                    onChange={(e) => setCurrencyForm({ ...currencyForm, isActive: e.target.checked })}
                    className="size-4 rounded accent-blue-600"
                  />
                  <span>Active for Public Visitors</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={currencyForm.isDefault}
                    onChange={(e) => setCurrencyForm({ ...currencyForm, isDefault: e.target.checked })}
                    className="size-4 rounded accent-blue-600"
                  />
                  <span>Set as Default Currency</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowCurrencyModal(false)}
                  className="px-4 py-2 rounded-xl border border-border font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Currency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
