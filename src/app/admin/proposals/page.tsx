"use client";

import React, { useState } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminProposalsQuery, useCreateAdminProposalMutation, useUpdateAdminProposalMutation, useDeleteAdminProposalMutation, useAdminProjectsQuery, useAdminClientsQuery } from "@/hooks/use-api-queries";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, PenTool, CheckCircle2, Clock } from "lucide-react";

export default function ProposalsPage() {
  const { data: proposals = [], isLoading } = useAdminProposalsQuery();
  const { data: projects = [] } = useAdminProjectsQuery();
  const { data: clients = [] } = useAdminClientsQuery();

  const createProposal = useCreateAdminProposalMutation();
  const updateProposal = useUpdateAdminProposalMutation();
  const deleteProposal = useDeleteAdminProposalMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    projectId: "",
    clientId: "",
    amount: 0,
    status: "draft",
    validUntil: "",
    content: ""
  });

  const openDrawer = (proposal?: any) => {
    if (proposal) {
      setEditingProposal(proposal);
      setFormData({
        title: proposal.title,
        projectId: proposal.projectId?._id || "",
        clientId: proposal.clientId?._id || "",
        amount: proposal.amount,
        status: proposal.status,
        validUntil: proposal.validUntil ? new Date(proposal.validUntil).toISOString().split("T")[0] : "",
        content: proposal.content || ""
      });
    } else {
      setEditingProposal(null);
      setFormData({
        title: "",
        projectId: "",
        clientId: "",
        amount: 0,
        status: "draft",
        validUntil: "",
        content: ""
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : undefined,
    };

    if (editingProposal) {
      updateProposal.mutate(
        { id: editingProposal._id, ...payload },
        { onSuccess: () => setIsDrawerOpen(false) }
      );
    } else {
      createProposal.mutate(payload, { onSuccess: () => setIsDrawerOpen(false) });
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Proposal",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{row.title}</div>
            <div className="text-[10px] text-slate-500">Project: {row.projectId?.title || 'Unknown'}</div>
          </div>
        </div>
      )
    },
    {
      header: "Client",
      cell: (row) => (
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {row.clientId?.name || 'Unknown Client'}
        </div>
      )
    },
    {
      header: "Value",
      cell: (row) => (
        <div className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
          ${row.amount.toLocaleString()}
        </div>
      )
    },
    {
      header: "Status",
      cell: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.status === "accepted" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" :
          row.status === "rejected" ? "bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30" :
          row.status === "sent" ? "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30" :
          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: "Valid Until",
      cell: (row) => (
        row.validUntil ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {new Date(row.validUntil).toLocaleDateString()}
          </div>
        ) : "-"
      )
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openDrawer(row)}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => deleteProposal.mutate(row._id)}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AdminDataTable
        title="Proposals"
        description="Draft, send, and track business proposals."
        columns={columns}
        data={isLoading ? [] : proposals}
        searchPlaceholder="Search proposals..."
        actionButton={
          <button
            onClick={() => openDrawer()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            Create Proposal
          </button>
        }
      />

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {editingProposal ? "Edit Proposal" : "New Proposal"}
                    </h2>
                    <p className="text-xs text-slate-500">Proposal details</p>
                  </div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="space-y-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Title</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Client</label>
                    <select required value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50">
                      <option value="">-- Select Client --</option>
                      {clients.map((c: any) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Project (Optional)</label>
                    <select value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50">
                      <option value="">-- No Project --</option>
                      {projects.map((p: any) => (
                        <option key={p._id} value={p._id}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Amount</label>
                      <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</label>
                      <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50">
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Valid Until</label>
                    <input required type="date" value={formData.validUntil} onChange={e => setFormData({...formData, validUntil: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Content Summary</label>
                    <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={createProposal.isPending || updateProposal.isPending} className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50">
                    {createProposal.isPending || updateProposal.isPending ? "Saving..." : editingProposal ? "Save Changes" : "Create Proposal"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
