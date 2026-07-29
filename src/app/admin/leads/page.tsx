"use client";

import React from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminLeadsQuery, useUpdateLeadStatusMutation } from "@/hooks/use-api-queries";

interface LeadItem {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  company: string;
  budget: string;
  service: string;
  status: "new" | "contacted" | "converted";
  createdAt: string;
}

export default function LeadsCRMPage() {
  const { data: leads = [], isLoading } = useAdminLeadsQuery();
  const updateStatusMutation = useUpdateLeadStatusMutation();

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const columns: Column<LeadItem>[] = [
    {
      header: "Lead Contact",
      cell: (row) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white">{row.name}</div>
          <div className="text-[10px] text-slate-400 font-mono">{row.email}</div>
        </div>
      ),
    },
    { header: "Company", accessorKey: "company" },
    {
      header: "Requested Service",
      cell: (row) => (
        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200/60 dark:border-blue-800/80">
          {row.service}
        </span>
      ),
    },
    { header: "Est. Budget", accessorKey: "budget" },
    {
      header: "CRM Status",
      cell: (row) => {
        const leadId = row._id || row.id || "";
        return (
          <select
            value={row.status}
            onChange={(e) => handleStatusChange(leadId, e.target.value)}
            disabled={updateStatusMutation.isPending}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border outline-none ${
              row.status === "new"
                ? "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80"
                : row.status === "contacted"
                ? "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80"
                : "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80"
            }`}
          >
            <option value="new">🔴 New Inquiry</option>
            <option value="contacted">🟡 In Discussion</option>
            <option value="converted">🟢 Converted Client</option>
          </select>
        );
      },
    },
    { header: "Submitted", accessorKey: "createdAt" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AdminDataTable
        title="Inbound Leads & Consultation CRM"
        description="Track, assign, and convert client project inquiries submitted from consultation forms dynamically."
        columns={columns}
        data={isLoading ? [] : leads}
        searchPlaceholder="Search leads by name or company..."
      />
    </div>
  );
}

