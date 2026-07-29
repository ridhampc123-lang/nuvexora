"use client";

import React from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminClientsQuery } from "@/hooks/use-api-queries";
import { Building2, Globe, Mail, Phone, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Company {
  _id: string;
  companyName: string;
  industry: string;
  email: string;
  phone?: string;
  website?: string;
  tier: "Startup" | "Scaleup" | "Enterprise";
  contractValue: number;
  status: "active" | "inactive" | "deleted";
}

export default function CompaniesPage() {
  const { data: companies = [], isLoading } = useAdminClientsQuery();

  // Filter out deleted if needed
  const activeCompanies = companies.filter((c: any) => c.status !== 'deleted');

  const columns: Column<Company>[] = [
    {
      header: "Company",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">
              {row.companyName}
            </div>
            <div className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest mt-0.5">
              {row.industry}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Info",
      cell: (row) => (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <a href={`mailto:${row.email}`} className="hover:text-indigo-500 transition-colors">{row.email}</a>
          </div>
          {row.phone && (
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{row.phone}</span>
            </div>
          )}
          {row.website && (
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <a href={row.website} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline">
                {row.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Tier & Value",
      cell: (row) => (
        <div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            row.tier === "Enterprise" ? "bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-400" :
            row.tier === "Scaleup" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" :
            "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
          }`}>
            {row.tier}
          </span>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">
            ACV: ${row.contractValue.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.status === "active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" :
          "bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30"
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <Link
          href={`/admin/clients`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Manage <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AdminDataTable
        title="Company Directory"
        description="View and manage all B2B company accounts and organizations."
        columns={columns}
        data={isLoading ? [] : activeCompanies}
        searchPlaceholder="Search companies by name or industry..."
      />
    </div>
  );
}
