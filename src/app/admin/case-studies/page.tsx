"use client";

import React, { useState, useEffect } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { AdminModal } from "@/components/admin/admin-modal";
import { Edit2, Trash2, Star, Upload, ImageIcon, Loader2, ExternalLink, Briefcase, Plus, CheckCircle2 } from "lucide-react";
import {
  getAdminCaseStudies,
  createAdminCaseStudy,
  updateAdminCaseStudy,
  deleteAdminCaseStudy,
  uploadAdminImage,
} from "@/lib/api/admin-api";
import { toast } from "sonner";

export interface CaseStudyItem {
  id: string;
  _id?: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  metrics: string[];
  technologies: string[];
  coverImage: string;
  deliverables?: string[];
  timeline?: string;
  liveUrl?: string;
  isFeatured: boolean;
  status: "published" | "draft";
  order: number;
}

export default function CaseStudiesCMSPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CaseStudyItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    client: "",
    industry: "Enterprise SaaS",
    summary: "",
    challenge: "",
    solution: "",
    metricsText: "",
    technologiesText: "",
    deliverablesText: "",
    timeline: "6 - 8 Weeks",
    liveUrl: "",
    coverImage: "",
    isFeatured: true,
    status: "published" as "published" | "draft",
    order: 0,
  });

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      const data = await getAdminCaseStudies();
      setCaseStudies(
        data.map((item: any) => ({
          id: item._id,
          _id: item._id,
          title: item.title,
          slug: item.slug,
          client: item.client,
          industry: item.industry,
          summary: item.summary || "",
          challenge: item.challenge || "",
          solution: item.solution || "",
          metrics: Array.isArray(item.metrics) ? item.metrics : [],
          technologies: Array.isArray(item.technologies) ? item.technologies : [],
          deliverables: Array.isArray(item.deliverables) ? item.deliverables : [],
          timeline: item.timeline || "6 - 8 Weeks",
          liveUrl: item.liveUrl || "",
          coverImage: item.coverImage || "",
          isFeatured: item.isFeatured !== undefined ? item.isFeatured : true,
          status: item.status || "published",
          order: item.order !== undefined ? item.order : 0,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch case studies", error);
      toast.error("Failed to load case studies from database");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: CaseStudyItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        slug: item.slug,
        client: item.client,
        industry: item.industry,
        summary: item.summary,
        challenge: item.challenge,
        solution: item.solution,
        metricsText: item.metrics.join(", "),
        technologiesText: item.technologies.join(", "),
        deliverablesText: (item.deliverables || []).join(", "),
        timeline: item.timeline || "6 - 8 Weeks",
        liveUrl: item.liveUrl || "",
        coverImage: item.coverImage || "",
        isFeatured: item.isFeatured,
        status: item.status,
        order: item.order,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        slug: "",
        client: "",
        industry: "Enterprise SaaS",
        summary: "",
        challenge: "",
        solution: "",
        metricsText: "",
        technologiesText: "",
        deliverablesText: "",
        timeline: "6 - 8 Weeks",
        liveUrl: "",
        coverImage: "",
        isFeatured: true,
        status: "published",
        order: caseStudies.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadAdminImage(file);
      if (url) {
        setFormData((prev) => ({ ...prev, coverImage: url }));
        toast.success("Cover image uploaded successfully to Cloudinary");
      }
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload image. Please try again or paste a valid URL.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.client || !formData.industry) {
      toast.error("Please fill in required fields (Title, Client, Industry)");
      return;
    }

    try {
      setSubmitting(true);
      const metricsArray = formData.metricsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const techArray = formData.technologiesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const deliverablesArray = formData.deliverablesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        slug: formData.slug || undefined,
        client: formData.client,
        industry: formData.industry,
        summary: formData.summary,
        challenge: formData.challenge,
        solution: formData.solution,
        metrics: metricsArray,
        technologies: techArray,
        deliverables: deliverablesArray,
        timeline: formData.timeline,
        liveUrl: formData.liveUrl,
        coverImage: formData.coverImage,
        isFeatured: formData.isFeatured,
        status: formData.status,
        order: Number(formData.order) || 0,
      };

      if (editingItem) {
        const updated = await updateAdminCaseStudy({ id: editingItem.id, ...payload });
        toast.success("Case study updated successfully");
        setCaseStudies((prev) =>
          prev.map((item) => (item.id === editingItem.id ? { ...item, ...updated, id: item.id } : item))
        );
      } else {
        const created = await createAdminCaseStudy(payload);
        toast.success("New case study published successfully");
        setCaseStudies((prev) => [{ ...created, id: created._id }, ...prev]);
      }

      setIsModalOpen(false);
      fetchCaseStudies();
    } catch (error: any) {
      console.error("Save error", error);
      toast.error(error?.response?.data?.message || "Failed to save case study");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this case study?")) return;
    try {
      await deleteAdminCaseStudy(id);
      setCaseStudies((prev) => prev.filter((item) => item.id !== id));
      toast.success("Case study deleted successfully");
    } catch (error) {
      console.error("Delete error", error);
      toast.error("Failed to delete case study");
    }
  };

  const handleToggleFeatured = async (item: CaseStudyItem) => {
    try {
      const nextFeatured = !item.isFeatured;
      await updateAdminCaseStudy({ id: item.id, isFeatured: nextFeatured });
      setCaseStudies((prev) =>
        prev.map((cs) => (cs.id === item.id ? { ...cs, isFeatured: nextFeatured } : cs))
      );
      toast.success(`Marked as ${nextFeatured ? "Featured" : "Standard"}`);
    } catch {
      toast.error("Failed to update featured status");
    }
  };

  const columns: Column<CaseStudyItem>[] = [
    {
      header: "Case Study & Client",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.coverImage ? (
            <img
              src={row.coverImage}
              alt={row.title}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="font-bold text-slate-900 dark:text-white truncate max-w-xs">{row.title}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="font-semibold text-blue-600 dark:text-blue-400">{row.client}</span>
              <span>•</span>
              <span>{row.industry}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Key ROI Metrics",
      cell: (row) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {row.metrics.slice(0, 2).map((m, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/80"
            >
              {m}
            </span>
          ))}
          {row.metrics.length > 2 && (
            <span className="text-[10px] text-slate-400 self-center">+{row.metrics.length - 2} more</span>
          )}
        </div>
      ),
    },
    {
      header: "Technologies",
      cell: (row) => (
        <div className="flex flex-wrap gap-1 max-w-[180px]">
          {row.technologies.slice(0, 3).map((t, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {t}
            </span>
          ))}
          {row.technologies.length > 3 && (
            <span className="text-[10px] text-slate-400">+{row.technologies.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            row.status === "published"
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Featured",
      cell: (row) => (
        <button
          onClick={() => handleToggleFeatured(row)}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={row.isFeatured ? "Unmark Featured" : "Mark as Featured"}
        >
          <Star
            className={`w-4 h-4 ${
              row.isFeatured ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"
            }`}
          />
        </button>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.liveUrl && (
            <a
              href={row.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600"
              title="Visit Live Client Project"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={() => handleOpenModal(row)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600"
            title="Edit Case Study"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
            title="Delete Case Study"
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
        title="Dynamic Case Studies CMS"
        description="Create, manage, and publish real enterprise client stories, ROI performance benchmarks, and before-and-after transformations."
        columns={columns}
        data={caseStudies}
        searchPlaceholder="Search case studies by title, client, tech, or industry..."
        onAddNew={() => handleOpenModal()}
        addNewLabel="Add Case Study"
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Enterprise Case Study" : "Create New Case Study"}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Row 1: Title & Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Case Study Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Next-Gen Algorithmic Trading Core"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Client Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Veloce Financial Systems"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Row 2: Industry & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Industry Domain <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. FinTech & Banking, Enterprise SaaS, Healthcare"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                URL Slug <span className="text-slate-400 font-normal">(Leave blank to auto-generate)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. algorithmic-trading-core"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Executive Summary & Synopsis <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="High-level description of what Nuvexora delivered and the core business outcome..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none leading-relaxed"
            />
          </div>

          {/* Row 3: Metrics & Technologies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                ROI Metrics <span className="text-slate-400 font-normal">(Comma-separated)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 4.2x Faster Load, +240% Signups, 99.99% Uptime"
                value={formData.metricsText}
                onChange={(e) => setFormData({ ...formData, metricsText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Technologies Stack <span className="text-slate-400 font-normal">(Comma-separated)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Next.js 15, TypeScript, Tailwind CSS, PostgreSQL"
                value={formData.technologiesText}
                onChange={(e) => setFormData({ ...formData, technologiesText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* The Challenge (Before) */}
          <div>
            <label className="block font-bold text-rose-700 dark:text-rose-400 mb-1">
              The Challenge / Before State
            </label>
            <textarea
              rows={2}
              placeholder="What bottlenecks, legacy architecture, or operational issues was the client facing?"
              value={formData.challenge}
              onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none leading-relaxed"
            />
          </div>

          {/* The Solution (After) */}
          <div>
            <label className="block font-bold text-emerald-700 dark:text-emerald-400 mb-1">
              The Engineering Solution / After State
            </label>
            <textarea
              rows={2}
              placeholder="How did Nuvexora solve the challenge? Architecture, algorithms, workflows, or infrastructure deployed..."
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none leading-relaxed"
            />
          </div>

          {/* Row 4: Timeline & Live Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Engagement Timeline
              </label>
              <input
                type="text"
                placeholder="e.g. 6 - 8 Weeks"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Live URL / Case Study Demo Link
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Row 5: Cloudinary Cover Image */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Cover Image (Cloudinary or Direct URL)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Paste image URL or upload below..."
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
              <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all shrink-0">
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{uploading ? "Uploading..." : "Upload"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            {formData.coverImage && (
              <div className="mt-2 relative w-full h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Row 6: Settings: Status, Order, Featured */}
          <div className="grid grid-cols-3 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "published" | "draft" })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer py-2">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-bold text-slate-700 dark:text-slate-300">Featured</span>
              </label>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{editingItem ? "Update Case Study" : "Publish Case Study"}</span>
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
