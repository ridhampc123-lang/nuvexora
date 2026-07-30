"use client";

import React, { useState, useEffect } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { AdminModal } from "@/components/admin/admin-modal";
import { Edit2, Trash2, Upload, ImageIcon, Loader2 } from "lucide-react";
import { getAdminBlogs, createAdminBlog, updateAdminBlog, deleteAdminBlog, uploadAdminImage } from "@/lib/api/admin-api";

interface BlogArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  readTime: string;
  coverImage: string;
  summary: string;
  content: string;
  status: "published" | "draft";
  publishedAt: string;
}

export default function BlogCMSPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAdminBlogs();
      setArticles(data.map((item: any) => ({
        id: item._id,
        title: item.title,
        category: item.category,
        author: item.author,
        readTime: item.readTime || "5 min read",
        coverImage: item.coverImage || "",
        summary: item.summary || "",
        content: item.content || "",
        status: item.isPublished ? "published" : "draft",
        publishedAt: new Date(item.publishedAt || item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      })));
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    category: "Architecture",
    author: "Nuvexora Architecture Team",
    readTime: "5 min read",
    coverImage: "",
    summary: "",
    content: "",
    status: "published" as "published" | "draft",
  });

  const handleOpenModal = (article?: BlogArticle) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        category: article.category,
        author: article.author,
        readTime: article.readTime,
        coverImage: article.coverImage || "",
        summary: article.summary || "",
        content: article.content || "",
        status: article.status,
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: "",
        category: "Architecture",
        author: "Nuvexora Architecture Team",
        readTime: "5 min read",
        coverImage: "",
        summary: "",
        content: "",
        status: "published"
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
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now(),
        category: formData.category,
        author: formData.author,
        readTime: formData.readTime,
        coverImage: formData.coverImage,
        summary: formData.summary || "Technical analysis and engineering architecture breakdown by Nuvexora.",
        content: formData.content || "Full article body content detailing technical implementation...",
        isPublished: formData.status === "published",
      };

      if (editingArticle) {
        await updateAdminBlog({ id: editingArticle.id, ...payload });
      } else {
        await createAdminBlog(payload);
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (error) {
      console.error("Failed to save blog", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteAdminBlog(id);
        fetchBlogs();
      } catch (error) {
        console.error("Failed to delete blog", error);
      }
    }
  };

  const columns: Column<BlogArticle>[] = [
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
    { header: "Article Title", accessorKey: "title" },
    {
      header: "Category",
      cell: (row) => (
        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200/60 dark:border-blue-800/80">
          {row.category}
        </span>
      ),
    },
    { header: "Author", accessorKey: "author" },
    { header: "Read Time", accessorKey: "readTime" },
    {
      header: "Status",
      cell: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${row.status === "published" ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" : "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"}`}>
          {row.status}
        </span>
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
        title="Blog Articles CMS"
        description="Publish, schedule, edit technical insights and engineering articles with Cloudinary cover images."
        columns={columns}
        data={articles}
        searchPlaceholder="Search articles..."
        onAddNew={() => handleOpenModal()}
        addNewLabel="Write Article"
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArticle ? "Edit Article" : "Write New Article"}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Article Title</label>
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
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Article Summary</label>
            <textarea
              rows={2}
              placeholder="Brief summary of the article..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Article Body Content</label>
            <textarea
              rows={4}
              placeholder="Full article markdown/content..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Publishing Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200">
              Cancel
            </button>
            <button type="submit" disabled={uploading} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20 disabled:opacity-50">
              Save Article
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
