"use client";

import React, { useState } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { AdminModal } from "@/components/admin/admin-modal";
import { useAdminLeadsQuery, useUpdateLeadStatusMutation, useDeleteLeadMutation } from "@/hooks/use-api-queries";
import { Mail, User, Building2, Phone, Calendar, IndianRupee, Tag, MessageSquare, Trash2, Eye, ExternalLink, Clock, Sparkles } from "lucide-react";

interface LeadItem {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  email: string;
  phone?: string;
  company?: string;
  serviceCategory?: string;
  service?: string;
  budgetRange?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  status: "new" | "contacted" | "qualified" | "converted" | "closed";
  createdAt: string;
}

export default function LeadsCRMPage() {
  const { data: leads = [], isLoading } = useAdminLeadsQuery();
  const updateStatusMutation = useUpdateLeadStatusMutation();
  const deleteLeadMutation = useDeleteLeadMutation();

  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
    if (selectedLead && (selectedLead._id === id || selectedLead.id === id)) {
      setSelectedLead((prev) => prev ? { ...prev, status: newStatus as any } : null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this lead inquiry?")) {
      deleteLeadMutation.mutate(id);
      if (selectedLead && (selectedLead._id === id || selectedLead.id === id)) {
        setIsModalOpen(false);
      }
    }
  };

  const openLeadModal = (lead: LeadItem) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const totalCount = leads.length;
  const newCount = leads.filter((l: any) => l.status === "new").length;
  const inProgressCount = leads.filter((l: any) => l.status === "contacted" || l.status === "qualified").length;
  const convertedCount = leads.filter((l: any) => l.status === "converted").length;

  const columns: Column<LeadItem>[] = [
    {
      header: "Lead Prospect",
      cell: (row) => {
        const leadName = row.fullName || row.name || "Anonymous";
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm shrink-0">
              {leadName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{leadName}</span>
                {row.status === "new" && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse inline-block" title="New Inquiry" />
                )}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="font-mono">{row.email}</span>
                {row.company && <span className="font-semibold text-slate-400">({row.company})</span>}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Service & Budget",
      cell: (row) => (
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200/60 dark:border-blue-800/80">
            {row.serviceCategory || row.service || "General Inquiry"}
          </span>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Est. Budget: <span className="font-bold text-emerald-600 dark:text-emerald-400">{row.budgetRange || row.budget || "Undisclosed"}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Target Timeline",
      cell: (row) => (
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {row.timeline || "Flexible"}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row) => {
        const leadId = row._id || row.id || "";
        return (
          <select
            value={row.status || "new"}
            onChange={(e) => handleStatusChange(leadId, e.target.value)}
            disabled={updateStatusMutation.isPending}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border outline-none cursor-pointer transition-all ${
              row.status === "new"
                ? "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80"
                : row.status === "contacted" || row.status === "qualified"
                ? "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80"
                : row.status === "converted"
                ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
          >
            <option value="new">🔴 New Inquiry</option>
            <option value="contacted">🟡 In Discussion</option>
            <option value="qualified">🔵 Qualified Lead</option>
            <option value="converted">🟢 Converted Client</option>
            <option value="closed">⚪ Closed / Archived</option>
          </select>
        );
      },
    },
    {
      header: "Submitted",
      cell: (row) => (
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (row) => {
        const leadId = row._id || row.id || "";
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openLeadModal(row)}
              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              title="View Full Scope Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(leadId)}
              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
              title="Delete Inquiry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Inquiries</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New Inquiries</p>
            <h3 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{newCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">In Discussion</p>
            <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{inProgressCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Converted Clients</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{convertedCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <AdminDataTable
        title="Inbound Project Inquiries & Leads CRM"
        description="Review, analyze detailed project scopes, change inquiry statuses, and convert client requests into active projects."
        columns={columns}
        data={isLoading ? [] : leads}
        searchPlaceholder="Search leads by prospect name, email, or company..."
      />

      {/* Full Scope Details Modal */}
      {selectedLead && (
        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Project Inquiry & Scope Details"
        >
          <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
            {/* Lead Prospect Info Header */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shrink-0">
                  {(selectedLead.fullName || selectedLead.name || "A").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedLead.fullName || selectedLead.name}
                  </h4>
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-500" /> {selectedLead.email}</span>
                    {selectedLead.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-500" /> {selectedLead.phone}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedLead.email}?subject=Nuvexora%20Technologies%20-%20Project%20Inquiry%20Response&body=Hi%20${encodeURIComponent(selectedLead.fullName || selectedLead.name || '')},`}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>

            {/* Structured Scope Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Company</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-500" />
                  {selectedLead.company || "Individual / Not Specified"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Service Category</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-blue-500" />
                  {selectedLead.serviceCategory || selectedLead.service || "General Inquiry"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Est. Budget</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5" />
                  {selectedLead.budgetRange || selectedLead.budget || "Undisclosed"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Target Timeline</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  {selectedLead.timeline || "Flexible"}
                </span>
              </div>
            </div>

            {/* Project Overview & Message Scope */}
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-500" /> Project Scope & Message Details
              </label>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {selectedLead.message || "No detailed message provided."}
              </div>
            </div>

            {/* Status Update & Modal Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status:</span>
                <select
                  value={selectedLead.status || "new"}
                  onChange={(e) => handleStatusChange(selectedLead._id || selectedLead.id || "", e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                >
                  <option value="new">🔴 New Inquiry</option>
                  <option value="contacted">🟡 In Discussion</option>
                  <option value="qualified">🔵 Qualified Lead</option>
                  <option value="converted">🟢 Converted Client</option>
                  <option value="closed">⚪ Closed / Archived</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
}

