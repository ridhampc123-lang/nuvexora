"use client";

import React, { useState } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminContractsQuery, useCreateAdminContractMutation, useUpdateAdminContractMutation, useDeleteAdminContractMutation, useAdminProjectsQuery, useAdminClientsQuery } from "@/hooks/use-api-queries";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ScrollText, Clock, FileSignature } from "lucide-react";

export default function ContractsPage() {
  const { data: contracts = [], isLoading } = useAdminContractsQuery();
  const { data: projects = [] } = useAdminProjectsQuery();
  const { data: clients = [] } = useAdminClientsQuery();

  const createContract = useCreateAdminContractMutation();
  const updateContract = useUpdateAdminContractMutation();
  const deleteContract = useDeleteAdminContractMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    projectId: "",
    clientId: "",
    value: 0,
    status: "draft",
    expiryDate: "",
    content: ""
  });

  const openDrawer = (contract?: any) => {
    if (contract) {
      setEditingContract(contract);
      setFormData({
        title: contract.title,
        projectId: contract.projectId?._id || "",
        clientId: contract.clientId?._id || "",
        value: contract.value,
        status: contract.status,
        expiryDate: contract.expiryDate ? new Date(contract.expiryDate).toISOString().split("T")[0] : "",
        content: contract.content || ""
      });
    } else {
      setEditingContract(null);
      setFormData({
        title: "",
        projectId: "",
        clientId: "",
        value: 0,
        status: "draft",
        expiryDate: "",
        content: ""
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
    };

    if (editingContract) {
      updateContract.mutate(
        { id: editingContract._id, ...payload },
        { onSuccess: () => setIsDrawerOpen(false) }
      );
    } else {
      createContract.mutate(payload, { onSuccess: () => setIsDrawerOpen(false) });
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Contract",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <ScrollText className="w-4 h-4" />
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
          ${row.value.toLocaleString()}
        </div>
      )
    },
    {
      header: "Status",
      cell: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.status === "signed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" :
          row.status === "expired" ? "bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30" :
          row.status === "sent" ? "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30" :
          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: "Expiry Date",
      cell: (row) => (
        row.expiryDate ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {new Date(row.expiryDate).toLocaleDateString()}
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
            onClick={() => deleteContract.mutate(row._id)}
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
        title="Contracts"
        description="Manage legal agreements and client contracts."
        columns={columns}
        data={isLoading ? [] : contracts}
        searchPlaceholder="Search contracts..."
        actionButton={
          <button
            onClick={() => openDrawer()}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-orange-600/20"
          >
            <Plus className="w-4 h-4" />
            Create Contract
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
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <FileSignature className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {editingContract ? "Edit Contract" : "New Contract"}
                    </h2>
                    <p className="text-xs text-slate-500">Contract details</p>
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
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Client</label>
                    <select required value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50">
                      <option value="">-- Select Client --</option>
                      {clients.map((c: any) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Project (Optional)</label>
                    <select value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50">
                      <option value="">-- No Project --</option>
                      {projects.map((p: any) => (
                        <option key={p._id} value={p._id}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Value</label>
                      <input required type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</label>
                      <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50">
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="signed">Signed</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Expiry Date</label>
                    <input required type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50 font-mono" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Terms</label>
                    <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50 resize-none" />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={createContract.isPending || updateContract.isPending} className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20 transition-all disabled:opacity-50">
                    {createContract.isPending || updateContract.isPending ? "Saving..." : editingContract ? "Save Changes" : "Create Contract"}
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
