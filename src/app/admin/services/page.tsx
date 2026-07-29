"use client";

import React, { useState, useEffect } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { AdminModal } from "@/components/admin/admin-modal";
import { Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { getAdminServices, createAdminService, updateAdminService, deleteAdminService } from "@/lib/api/admin-api";

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  startingPrice: string;
  isActive: boolean;
}

const initialServices: ServiceItem[] = [
  { id: "1", title: "AI Solutions & Neural Engineering", category: "AI & Data", badge: "High Demand", startingPrice: "$12,500", isActive: true },
  { id: "2", title: "Web & SaaS Development", category: "Web", badge: "Core Expertise", startingPrice: "$4,900", isActive: true },
  { id: "3", title: "Cloud & DevOps Infrastructure", category: "Cloud", badge: "99.999% SLA", startingPrice: "$8,500", isActive: true },
  { id: "4", title: "Mobile App Development", category: "Mobile", badge: "Native & Cross-Platform", startingPrice: "$6,800", isActive: true },
  { id: "5", title: "Enterprise ERP & CRM Systems", category: "Enterprise", badge: "Custom Suite", startingPrice: "$18,000", isActive: true },
  { id: "6", title: "UI/UX & Brand Identity", category: "Design", badge: "Award Winning", startingPrice: "$3,500", isActive: true },
];

export default function ServicesCMSPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getAdminServices();
      setServices(data.map((item: any) => ({
        id: item._id,
        title: item.title,
        category: item.category,
        badge: item.badge || "",
        startingPrice: item.startingPrice || "",
        isActive: item.isActive,
      })));
    } catch (error) {
      console.error("Failed to fetch services", error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    category: "Web",
    badge: "",
    startingPrice: "",
  });

  const handleOpenModal = (service?: ServiceItem) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        category: service.category,
        badge: service.badge,
        startingPrice: service.startingPrice,
      });
    } else {
      setEditingService(null);
      setFormData({ title: "", category: "Web", badge: "", startingPrice: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: formData.category.toLowerCase().split(" ")[0], // mapping UI category to enum
        shortDescription: "Short description...",
        fullDescription: "Full description...",
        badge: formData.badge,
        startingPrice: formData.startingPrice,
      };

      if (editingService) {
        await updateAdminService({ id: editingService.id, ...payload });
      } else {
        await createAdminService(payload);
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (error) {
      console.error("Failed to save service", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteAdminService(id);
        fetchServices();
      } catch (error) {
        console.error("Failed to delete service", error);
      }
    }
  };

  const columns: Column<ServiceItem>[] = [
    { header: "Service Title", accessorKey: "title" },
    {
      header: "Category",
      cell: (row) => (
        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          {row.category}
        </span>
      ),
    },
    { header: "Badge", accessorKey: "badge" },
    { header: "Starting Price", accessorKey: "startingPrice" },
    {
      header: "Status",
      cell: (row) => (
        <span className={`inline-flex items-center gap-1 text-xs font-bold ${row.isActive ? "text-emerald-600" : "text-rose-500"}`}>
          {row.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          {row.isActive ? "Active" : "Disabled"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AdminDataTable
        title="Services Management"
        description="Create, edit, and organize all company service offerings displayed on the public website."
        columns={columns}
        data={services}
        searchPlaceholder="Search services..."
        onAddNew={() => handleOpenModal()}
        addNewLabel="Create Service"
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Edit Service" : "Create New Service"}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Service Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. AI Solutions & Neural Engineering"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
              >
                <option value="AI & Data">AI & Data</option>
                <option value="Web">Web</option>
                <option value="Cloud">Cloud</option>
                <option value="Mobile">Mobile</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Design">Design</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Starting Price</label>
              <input
                type="text"
                value={formData.startingPrice}
                onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                placeholder="e.g. $4,900"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Badge</label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="e.g. High Demand"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
            >
              Save Service
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
