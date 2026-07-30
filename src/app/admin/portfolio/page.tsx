"use client";

import React, { useState, useEffect } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { AdminModal } from "@/components/admin/admin-modal";
import { Edit2, Trash2, Star, Upload, ImageIcon, Loader2 } from "lucide-react";
import { getAdminPortfolio, createAdminPortfolio, updateAdminPortfolio, deleteAdminPortfolio, uploadAdminImage } from "@/lib/api/admin-api";

interface PortfolioItem {
  id: string;
  title: string;
  clientName: string;
  category: string;
  metric: string;
  metricLabel: string;
  coverImage: string;
  isFeatured: boolean;
}

export default function PortfolioCMSPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
          coverImage: item.coverImage || "",
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
    coverImage: "",
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
        coverImage: item.coverImage || "",
      });
    } else {
      setEditingItem(null);
      setFormData({ title: "", clientName: "", category: "Fintech", metric: "", metricLabel: "", coverImage: "" });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadAdminImage(file);
      setFormData((prev) => ({ ...prev, coverImage: url }));
    } catch (error) {
      console.error("Failed to upload image to Cloudinary", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
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
        coverImage: formData.coverImage,
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
    {
      header: "Cover",
      cell: (row) => (
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
          {row.coverImage ? (
            <img src={row.coverImage} alt={row.title} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-5 h-5 text-slate-400" />
          )}
        </div>
      ),
    },
    { header: "Case Study Title", accessorKey: "title" },
    { header: "Client", accessorKey: "clientName" },
    {
      header: "Category",
      cell: (row) => (
        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold">
          {row.category}
        </span>
      ),
    },
    {
      header: "Key Metric",
      cell: (row) => (
        <div className="font-bold text-blue-600 dark:text-blue-400">
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
          <button onClick={() => handleOpenModal(row)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
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
        description="Manage corporate case studies, images, metrics, client results, and technical showcases."
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
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Cover Image Upload via Cloudinary */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Cover Image (Cloudinary Integration)</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Image URL or upload file..."
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all shrink-0">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            {formData.coverImage && (
              <div className="mt-2.5 relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Client Name</label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Metric Value</label>
              <input
                type="text"
                placeholder="e.g. +340%"
                value={formData.metric}
                onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Metric Label</label>
              <input
                type="text"
                placeholder="e.g. Throughput Surge"
                value={formData.metricLabel}
                onChange={(e) => setFormData({ ...formData, metricLabel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200">
              Cancel
            </button>
            <button type="submit" disabled={uploading} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20 disabled:opacity-50">
              Save Case Study
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
