"use client";

import React, { useState, useEffect } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { AdminModal } from "@/components/admin/admin-modal";
import { Edit2, Trash2, Star } from "lucide-react";
import { getAdminPortfolio, createAdminPortfolio, updateAdminPortfolio, deleteAdminPortfolio } from "@/lib/api/admin-api";

interface PortfolioItem {
  id: string;
  title: string;
  clientName: string;
  category: string;
  metric: string;
  metricLabel: string;
  isFeatured: boolean;
}

export default function PortfolioCMSPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const data = await getAdminPortfolio();
      setPortfolio(
        data.map((item: any) => ({
          id: item._id,
          title: item.title,
          clientName: item.clientName,
          category: item.category,
          metric: item.metric,
          metricLabel: item.metricLabel,
          isFeatured: item.isFeatured,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch portfolio", error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    category: "Fintech",
    metric: "",
    metricLabel: "",
  });

  const handleOpenModal = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        clientName: item.clientName,
        category: item.category,
        metric: item.metric,
        metricLabel: item.metricLabel,
      });
    } else {
      setEditingItem(null);
      setFormData({ title: "", clientName: "", category: "Fintech", metric: "", metricLabel: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        clientName: formData.clientName,
        category: formData.category,
        metric: formData.metric,
        metricLabel: formData.metricLabel,
        isFeatured: true,
      };

      if (editingItem) {
        await updateAdminPortfolio({ id: editingItem.id, ...payload });
      } else {
        await createAdminPortfolio(payload);
      }
      setIsModalOpen(false);
      fetchPortfolio();
    } catch (error) {
      console.error("Failed to save portfolio item", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this case study?")) {
      try {
        await deleteAdminPortfolio(id);
        fetchPortfolio();
      } catch (error) {
        console.error("Failed to delete portfolio item", error);
      }
    }
  };

  const columns: Column<PortfolioItem>[] = [
    { header: "Case Study Title", accessorKey: "title" },
    { header: "Client", accessorKey: "clientName" },
    {
      header: "Category",
      cell: (row) => (
        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
          {row.category}
        </span>
      ),
    },
    {
      header: "Key Metric",
      cell: (row) => (
        <div className="font-bold text-blue-600">
          {row.metric} <span className="text-[10px] text-slate-400 font-normal">({row.metricLabel})</span>
        </div>
      ),
    },
    {
      header: "Featured",
      cell: (row) => (
        <Star className={`w-4 h-4 ${row.isFeatured ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenModal(row)} className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AdminDataTable
        title="Portfolio & Case Studies"
        description="Manage corporate case studies, metrics, client results, and technical showcases."
        columns={columns}
        data={portfolio}
        searchPlaceholder="Search case studies..."
        onAddNew={() => handleOpenModal()}
        addNewLabel="Add Case Study"
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Case Study" : "Add Case Study"}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Client Name</label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Metric Value</label>
              <input
                type="text"
                placeholder="e.g. +340%"
                value={formData.metric}
                onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Metric Label</label>
              <input
                type="text"
                placeholder="e.g. Throughput Surge"
                value={formData.metricLabel}
                onChange={(e) => setFormData({ ...formData, metricLabel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20">
              Save Case Study
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
